import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  repeat?: number;
  duration?: number;
};

export function Marquee({ children, className, reverse, pauseOnHover, repeat = 4, duration = 45 }: Props) {
  return (
    <div
      className={cn("group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]", className)}
      style={{ ["--duration" as string]: `${duration}s` }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn(
            "flex shrink-0 animate-marquee justify-around [gap:var(--gap)]",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
