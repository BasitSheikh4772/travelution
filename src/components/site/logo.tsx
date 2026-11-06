import Image from "next/image";
import { cn } from "@/lib/utils";

/** The client's real logo (cropped from travelution.com.pk). `light` = white lettering for dark backgrounds. */
export function Logo({ variant = "color", className, priority }: { variant?: "color" | "light"; className?: string; priority?: boolean }) {
  return (
    <Image
      src={variant === "light" ? "/logo-light.png" : "/logo.png"}
      alt="Travelution — The Future of Travel"
      width={1752}
      height={764}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  );
}

export function LogoMark({ variant = "color", className }: { variant?: "color" | "light"; className?: string }) {
  return (
    <Image
      src={variant === "light" ? "/mark-light.png" : "/mark.png"}
      alt=""
      width={589}
      height={421}
      className={cn("h-auto w-auto", className)}
    />
  );
}
