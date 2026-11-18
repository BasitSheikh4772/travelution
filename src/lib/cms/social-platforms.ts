/** Built-in social platforms (labels only — safe to import from client components). */
export const SOCIAL_PLATFORMS = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "x", label: "X (Twitter)" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "tiktok", label: "TikTok" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "pinterest", label: "Pinterest" },
  { id: "snapchat", label: "Snapchat" },
  { id: "threads", label: "Threads" },
  { id: "other", label: "Other (upload an icon)" },
] as const;

export const platformLabel = (id: string) => SOCIAL_PLATFORMS.find((p) => p.id === id)?.label ?? id;
