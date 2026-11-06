import { MessageCircle } from "lucide-react";
import { getSiteInfo } from "@/lib/wp/queries";

export async function WhatsAppButton() {
  const s = await getSiteInfo();
  return (
    <a
      href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent("Hi Travelution, I'd like help planning a trip.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
