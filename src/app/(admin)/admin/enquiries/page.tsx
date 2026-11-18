import { connection } from "next/server";
import { readDb } from "@/lib/cms/db";
import { deleteLead, setLeadRead } from "@/lib/cms/actions";
import { PageTitle, btnGhost } from "@/components/admin/shell";
import { ConfirmButton } from "@/components/admin/confirm-button";

// Per-request admin screen: skip instant-navigation validation (dev overlay insight)
export const instant = false;

export default async function Enquiries() {
  await connection(); // admin screens always render per request
  const { leads } = await readDb(["leads"]);
  return (
    <>
      <PageTitle title="Enquiries" sub="Messages sent through the website’s contact, Hajj and trip-design forms." />
      <div className="max-w-4xl space-y-3">
        {leads.map((l) => (
          <details key={l.id} className="group rounded-2xl border border-line bg-white open:shadow-sm">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-5 py-4">
              <span className="min-w-0">
                <span className={`block truncate ${l.read ? "font-medium" : "font-bold text-brand"}`}>{!l.read && <span className="mr-2 inline-block size-2 rounded-full bg-gold align-middle" />}{l.name} <span className="font-normal text-muted">— {l.topic || "General"}</span></span>
                <span className="block truncate text-xs text-muted">{l.email}{l.phone ? ` · ${l.phone}` : ""}</span>
              </span>
              <time className="text-xs text-muted">{new Date(l.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</time>
            </summary>
            <div className="border-t border-line px-5 py-4">
              <p className="whitespace-pre-line text-sm leading-relaxed">{l.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`mailto:${l.email}`} className={btnGhost}>Reply by email</a>
                {l.phone && <a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className={btnGhost}>WhatsApp</a>}
                <form action={setLeadRead.bind(null, l.id, !l.read)}><button className={btnGhost}>{l.read ? "Mark unread" : "Mark read"}</button></form>
                <form action={deleteLead.bind(null, l.id)}><ConfirmButton message="Delete this enquiry?" className={`${btnGhost} !text-red-700`}>Delete</ConfirmButton></form>
              </div>
            </div>
          </details>
        ))}
        {!leads.length && <p className="rounded-2xl border border-line bg-white px-5 py-10 text-center text-sm text-muted">No enquiries yet.</p>}
      </div>
    </>
  );
}
