"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";

const ACCEPT = { image: "image/*", video: "video/mp4,video/webm,video/quicktime", pdf: "application/pdf" } as const;

export function MediaInput({
  name, kind, folder, defaultValue = "", required, hint,
}: { name: string; kind: "image" | "video" | "pdf"; folder: string; defaultValue?: string | null; required?: boolean; hint?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [pct, setPct] = useState<number | null>(null);
  const [error, setError] = useState("");
  const urlRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const busy = pct !== null;

  function upload(file: File) {
    setError("");
    setPct(0);
    urlRef.current?.setCustomValidity("Please wait - the file is still uploading.");
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `/api/admin/upload?folder=${folder}&kind=${kind}&name=${encodeURIComponent(file.name)}`);
    xhr.upload.onprogress = (e) => e.lengthComputable && setPct(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      setPct(null);
      urlRef.current?.setCustomValidity("");
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status === 200 && res.url) setValue(res.url);
        else setError(res.error ?? "Upload failed");
      } catch {
        setError("Upload failed");
      }
    };
    xhr.onerror = () => {
      setPct(null);
      urlRef.current?.setCustomValidity("");
      setError("Network error during upload");
    };
    xhr.send(file);
  }

  return (
    <div className="space-y-2">
      {value && kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-32 rounded-xl border border-line bg-white object-cover" />
      )}
      {value && kind === "video" && <video src={value} controls preload="metadata" className="max-h-60 rounded-xl border border-line bg-black" />}
      {value && kind === "pdf" && (
        <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-brand underline">
          <FileText className="size-4" /> Open current PDF
        </a>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={urlRef}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          placeholder="Upload a file, or paste a link"
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm"
        />
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT[kind]}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-soft disabled:opacity-60"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} {busy ? `${pct}%` : "Upload"}
        </button>
        {value && !busy && (
          <button type="button" onClick={() => setValue("")} aria-label="Remove" className="grid size-9 place-items-center rounded-lg border border-line text-muted hover:text-red-700">
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
      {busy && (
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
        </div>
      )}
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
