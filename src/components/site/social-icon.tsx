import { Globe } from "lucide-react";
import { siFacebook, siInstagram, siPinterest, siSnapchat, siTelegram, siThreads, siTiktok, siWhatsapp, siX, siYoutube } from "simple-icons";
import { platformLabel } from "@/lib/cms/social-platforms";
import type { SocialLink } from "@/lib/cms/types";

const PATHS: Record<string, string> = {
  facebook: siFacebook.path,
  instagram: siInstagram.path,
  youtube: siYoutube.path,
  x: siX.path,
  tiktok: siTiktok.path,
  whatsapp: siWhatsapp.path,
  telegram: siTelegram.path,
  pinterest: siPinterest.path,
  snapchat: siSnapchat.path,
  threads: siThreads.path,
};

/** Brand icon for a social link — or the custom icon uploaded in the admin. */
export function SocialIcon({ link, className = "size-[18px]" }: { link: Pick<SocialLink, "platform" | "icon">; className?: string }) {
  if (link.icon) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={link.icon} alt="" className={`${className} object-contain`} />;
  }
  if (link.platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
        <rect x="2" y="9" width="4.2" height="12" />
        <circle cx="4.1" cy="4.2" r="2.2" />
        <path d="M9 9h4v1.7C13.6 9.6 15 8.8 16.8 8.8 20 8.8 22 10.8 22 14.4V21h-4.2v-5.9c0-1.5-.5-2.6-2-2.6s-2.4 1.1-2.4 2.6V21H9z" />
      </svg>
    );
  }
  const d = PATHS[link.platform];
  if (!d) return <Globe className={className} aria-hidden />;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d={d} />
    </svg>
  );
}

export const socialName = platformLabel;
