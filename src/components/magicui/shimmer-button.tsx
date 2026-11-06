import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  variant?: "brand" | "light" | "gold";
};

const styles = {
  brand: "bg-brand text-white shadow-[0_10px_30px_-10px_rgba(70,13,19,0.8)]",
  light: "bg-white text-brand shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]",
  gold: "bg-gold-grad animate-gradient text-brand-deep shadow-[0_10px_40px_-10px_rgba(247,208,0,0.7)]",
};

/** Magic UI Shimmer Button, rendered as a link. */
export function ShimmerButton({ href, children, className, external, variant = "brand" }: Props) {
  const cls = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-7 py-3.5 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-px",
    styles[variant],
    className,
  );
  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 animate-shimmer bg-[length:200%_100%]",
          variant === "gold"
            ? "bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.6)_50%,transparent_65%)]"
            : "bg-[linear-gradient(110deg,transparent_35%,rgba(225,185,10,0.5)_50%,transparent_65%)]",
        )}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}
