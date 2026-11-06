import { BlurFade } from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  dark,
  watermark,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  dark?: boolean;
  /** huge outlined word behind the heading */
  watermark?: string;
}) {
  return (
    <div className={cn("relative max-w-2xl", align === "center" && "mx-auto text-center")}>
      {watermark && (
        <span
          aria-hidden
          className={cn(
            "text-stroke pointer-events-none absolute -top-10 left-0 select-none whitespace-nowrap font-display text-[7rem] font-semibold leading-none opacity-[0.07] sm:text-[10rem]",
            dark ? "text-white" : "text-brand",
          )}
        >
          {watermark}
        </span>
      )}
      <BlurFade>
        <p className={cn("relative inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]", dark ? "text-gold" : "text-gold-dark")}>
          <span className="h-px w-8 bg-gold-grad" /> {eyebrow}
        </p>
      </BlurFade>
      <BlurFade delay={0.08}>
        <h2 className={cn("relative mt-3 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl", dark ? "text-white" : "text-brand")}>
          {title}
        </h2>
      </BlurFade>
      {body && (
        <BlurFade delay={0.16}>
          <p className={cn("relative mt-4 text-base leading-relaxed sm:text-lg", dark ? "text-white/70" : "text-muted")}>{body}</p>
        </BlurFade>
      )}
    </div>
  );
}
