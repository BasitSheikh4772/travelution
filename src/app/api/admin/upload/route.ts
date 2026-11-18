import { createWriteStream } from "node:fs";
import { mkdir, rename, unlink } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/cms/auth";
import { UPLOAD_DIR } from "@/lib/cms/db";


const FOLDERS = new Set(["reviews", "trips", "destinations", "pages", "visas", "misc"]);
const KINDS: Record<string, string[]> = {
  video: [".mp4", ".webm", ".mov", ".m4v"],
  image: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"],
  pdf: [".pdf"],
};
const MAX = Number(process.env.MAX_UPLOAD_MB ?? 600) * 1024 * 1024;

/**
 * PUT /api/admin/upload?folder=reviews&kind=video&name=clip.mp4  (raw file as the body)
 * Streams straight to disk so large videos never sit in memory.
 */
export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const q = new URL(req.url).searchParams;
  const folder = q.get("folder") ?? "";
  const kind = q.get("kind") ?? "";
  const name = q.get("name") ?? "";
  const ext = path.extname(name).toLowerCase();
  if (!FOLDERS.has(folder) || !KINDS[kind]?.includes(ext)) return NextResponse.json({ error: `Unsupported file type (${ext || "none"})` }, { status: 400 });
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX) return NextResponse.json({ error: `File too large (max ${MAX / 1024 / 1024} MB)` }, { status: 413 });
  if (!req.body) return NextResponse.json({ error: "Empty upload" }, { status: 400 });

  const base = path.basename(name, ext).normalize("NFKD").replace(/[^\x00-\x7f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "file";
  const file = `${base}-${Date.now().toString(36)}${ext}`;
  const dir = path.join(UPLOAD_DIR, folder);
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, file);
  const tmp = `${dest}.part`;

  let bytes = 0;
  const limiter = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, ctl) {
      bytes += chunk.byteLength;
      if (bytes > MAX) ctl.error(new Error("too large"));
      else ctl.enqueue(chunk);
    },
  });
  try {
    await pipeline(Readable.fromWeb(req.body.pipeThrough(limiter) as never), createWriteStream(tmp));
    await rename(tmp, dest);
  } catch {
    await unlink(tmp).catch(() => {});
    return NextResponse.json({ error: bytes > MAX ? "File too large" : "Upload failed" }, { status: bytes > MAX ? 413 : 500 });
  }
  return NextResponse.json({ url: `/media/${folder}/${file}`, size: bytes });
}
