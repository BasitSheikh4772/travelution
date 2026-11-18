"use server";

import { unlink } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { adminConfigured, checkCredentials, endSession, requireAdmin, startSession } from "./auth";
import { mutateDb, UPLOAD_DIR, type Db } from "./db";
import { CONTENT_GROUPS } from "./content-schema";
import { ENTITIES, MEDIA_TYPES, type EntityKey, type FieldDef } from "./admin-schema";
import { TAGS, type TagKey } from "./tags";

type Item = Record<string, unknown>;
const bust = (tags: TagKey[]) => tags.forEach((t) => updateTag(TAGS[t]));

/* ───────────────────────────── auth ───────────────────────────── */

let failures: { n: number; until: number } = { n: 0, until: 0 };

export async function login(_prev: { error?: string } | undefined, fd: FormData): Promise<{ error?: string }> {
  if (!adminConfigured()) return { error: "Admin login isn’t configured. Set ADMIN_PASSWORD in the server environment." };
  if (Date.now() < failures.until) return { error: "Too many attempts. Please wait a minute and try again." };
  if (!checkCredentials(String(fd.get("user") ?? ""), String(fd.get("password") ?? ""))) {
    failures = { n: failures.n + 1, until: failures.n + 1 >= 5 ? Date.now() + 60_000 : 0 };
    if (failures.n >= 5) failures.n = 0;
    await new Promise((r) => setTimeout(r, 800));
    return { error: "Wrong username or password." };
  }
  failures = { n: 0, until: 0 };
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}

/* ───────────────────────────── helpers ───────────────────────────── */

const slugify = (s: string) =>
  s.normalize("NFKD").replace(/[^\x00-\x7f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";

function uniqueSlug(list: Item[], wanted: string, selfId: unknown) {
  let slug = wanted;
  let i = 2;
  while (list.some((x) => x.slug === slug && String(x.id) !== String(selfId))) slug = `${wanted}-${i++}`;
  return slug;
}

function mediaFields(key: EntityKey): FieldDef[] {
  return ENTITIES[key].fields.filter((f) => MEDIA_TYPES.includes(f.type));
}

/** Delete an uploaded file once nothing in the database points at it any more. */
async function dropIfOrphan(db: Db, url: unknown) {
  if (typeof url !== "string" || !url.startsWith("/media/")) return;
  if (JSON.stringify(db).includes(`"${url}"`)) return;
  const file = path.resolve(UPLOAD_DIR, url.slice("/media/".length));
  if (file.startsWith(UPLOAD_DIR + path.sep)) await unlink(file).catch(() => {});
}

function parseFields(fields: FieldDef[], fd: FormData): Item {
  const out: Item = {};
  for (const f of fields) {
    const raw = fd.get(f.name);
    switch (f.type) {
      case "checkbox": out[f.name] = raw === "on"; break;
      case "number": { const n = raw === null || raw === "" ? null : Number(raw); out[f.name] = n !== null && Number.isFinite(n) ? n : null; break; }
      case "multiselect": out[f.name] = fd.getAll(f.name).map(String); break;
      case "lines": out[f.name] = String(raw ?? "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean); break;
      case "image": { const v = String(raw ?? "").trim(); out[f.name] = v || null; break; }
      default: out[f.name] = String(raw ?? "").trim();
    }
    if (f.required && (out[f.name] === "" || out[f.name] === null)) throw new Error(`${f.label} is required`);
  }
  return out;
}

/* ───────────────────────────── generic CRUD ───────────────────────────── */

export async function saveEntity(key: EntityKey, id: string | null, fd: FormData) {
  await requireAdmin();
  const def = ENTITIES[key];
  const parsed = parseFields(def.fields, fd);

  await mutateDb(async (db) => {
    const list = db[key] as unknown as Item[];
    const existing = id ? list.find((x) => String(x.id) === id) : undefined;
    if (id && !existing) throw new Error("That item no longer exists");
    const before: Item = { ...(existing ?? {}) };
    const next: Item = { ...before, ...parsed };

    if (key === "trips" || key === "destinations" || key === "services") {
      next.slug = uniqueSlug(list, slugify(String(parsed.slug || parsed[def.labelField] || "")), existing?.id);
    }
    if (key === "trips") {
      next.link = `/trip/${next.slug}`;
      next.currency = String(parsed.currency || "PKR").toUpperCase();
    }

    if (!existing) {
      if (def.idType === "number") next.id = list.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;
      else next.id = key === "services" ? String(next.slug) : crypto.randomUUID().slice(0, 8);
      if (key === "reviews") { next.order = list.reduce((m, x) => Math.max(m, Number(x.order) || 0), -1) + 1; next.createdAt = new Date().toISOString(); }
      // new trips go first; everything else appends
      if (key === "trips") list.unshift(next); else list.push(next);
    } else {
      Object.assign(existing, next);
      for (const f of mediaFields(key)) if (before[f.name] !== next[f.name]) await dropIfOrphan(db, before[f.name]);
    }
  });

  bust(def.tags);
  redirect(`/admin/${key}?saved=${encodeURIComponent(String(parsed[def.labelField] ?? ""))}`);
}

export async function deleteEntity(key: EntityKey, id: string) {
  await requireAdmin();
  const def = ENTITIES[key];
  await mutateDb(async (db) => {
    const list = db[key] as unknown as Item[];
    const i = list.findIndex((x) => String(x.id) === id);
    if (i === -1) return;
    const [gone] = list.splice(i, 1);
    for (const f of mediaFields(key)) await dropIfOrphan(db, gone[f.name]);
  });
  bust(def.tags);
  redirect(`/admin/${key}?deleted=1`);
}

export async function moveEntity(key: EntityKey, id: string, dir: "up" | "down") {
  await requireAdmin();
  await mutateDb((db) => {
    const list = db[key] as unknown as Item[];
    if (key === "reviews") list.sort((a, b) => Number(a.order) - Number(b.order));
    const i = list.findIndex((x) => String(x.id) === id);
    const j = dir === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    if (key === "reviews") list.forEach((r, n) => (r.order = n));
  });
  bust(ENTITIES[key].tags);
  redirect(`/admin/${key}`);
}

export async function togglePublished(key: EntityKey, id: string) {
  await requireAdmin();
  await mutateDb((db) => {
    const item = (db[key] as unknown as Item[]).find((x) => String(x.id) === id);
    if (item) item.published = !item.published;
  });
  bust(ENTITIES[key].tags);
  redirect(`/admin/${key}`);
}

/* ───────────────────────────── page content & settings ───────────────────────────── */

export async function saveContent(groupId: string, fd: FormData) {
  await requireAdmin();
  const group = CONTENT_GROUPS.find((g) => g.id === groupId);
  if (!group) throw new Error("Unknown page");
  await mutateDb(async (db) => {
    for (const f of group.fields) {
      const v = String(fd.get(f.key) ?? "").replace(/\r\n/g, "\n").trim();
      const old = db.content[f.key];
      if (v === "" || v === f.default) delete db.content[f.key];
      else db.content[f.key] = v;
      if (f.type === "image" && old && old !== db.content[f.key]) await dropIfOrphan(db, old);
    }
  });
  bust(["content"]);
  redirect(`/admin/pages/${groupId}?saved=1`);
}

export async function saveSettings(fd: FormData) {
  await requireAdmin();
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  await mutateDb((db) => {
    db.settings = {
      name: s("name") || db.settings.name,
      phone: s("phone"),
      phoneAlt: s("phoneAlt"),
      whatsapp: s("whatsapp").replace(/\D/g, ""),
      email: s("email"),
      address: s("address"),
      mapUrl: s("mapUrl"),
      socials: fd.getAll("social_platform").map((p, i) => ({
        id: `${String(p)}-${i}`,
        platform: String(p),
        url: String(fd.getAll("social_url")[i] ?? "").trim(),
        icon: String(fd.getAll("social_icon")[i] ?? "").trim() || null,
      })).filter((l) => l.url),
    };
  });
  bust(["settings"]);
  redirect("/admin/settings?saved=1");
}

/* ───────────────────────────── enquiries ───────────────────────────── */

export async function setLeadRead(id: string, read: boolean) {
  await requireAdmin();
  await mutateDb((db) => { const l = db.leads.find((x) => x.id === id); if (l) l.read = read; }, ["leads"]);
  redirect("/admin/enquiries");
}

export async function deleteLead(id: string) {
  await requireAdmin();
  await mutateDb((db) => { db.leads = db.leads.filter((x) => x.id !== id); }, ["leads"]);
  redirect("/admin/enquiries");
}
