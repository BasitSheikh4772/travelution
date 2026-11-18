import { connection } from "next/server";
import { readDb } from "@/lib/cms/db";
import { saveSettings } from "@/lib/cms/actions";
import { SocialEditor } from "@/components/admin/social-editor";
import { Notice, PageTitle, btn, inputCls } from "@/components/admin/shell";

const Row = ({ name, label, value, hint, type = "text" }: { name: string; label: string; value: string; hint?: string; type?: string }) => (
  <label className="block text-sm font-semibold text-brand">
    {label}
    <input name={name} type={type} defaultValue={value} className={inputCls} />
    {hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
  </label>
);

// Per-request admin screen: skip instant-navigation validation (dev overlay insight)
export const instant = false;

export default async function Settings({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await connection(); // admin screens always render per request
  const { saved } = await searchParams;
  const s = (await readDb()).settings;
  return (
    <>
      <PageTitle title="Site settings" sub="Contact details and social links used in the footer, contact page, WhatsApp button and forms." />
      {saved && <Notice>Saved. The website is updated.</Notice>}
      <form action={saveSettings} className="grid max-w-3xl gap-5 rounded-3xl border border-line bg-white p-6 sm:grid-cols-2 sm:p-8">
        <Row name="name" label="Company name" value={s.name} />
        <Row name="email" label="Email" value={s.email} type="email" />
        <Row name="phone" label="Phone" value={s.phone} />
        <Row name="phoneAlt" label="Landline" value={s.phoneAlt} />
        <Row name="whatsapp" label="WhatsApp number" value={s.whatsapp} hint="Digits only with country code, e.g. 923212997860" />
        <Row name="mapUrl" label="Google Maps link" value={s.mapUrl} />
        <div className="sm:col-span-2"><Row name="address" label="Address" value={s.address} /></div>
        <h2 className="font-display text-2xl text-brand sm:col-span-2">Social links &amp; icons</h2>
        <SocialEditor initial={s.socials} />
        <div className="border-t border-line pt-6 sm:col-span-2"><button className={btn}>Save changes</button></div>
      </form>
    </>
  );
}
