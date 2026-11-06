export function BorderBeam({ size = 120, duration = 8, delay = 0 }: { size?: number; duration?: number; delay?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <div
        className="absolute aspect-square animate-border-beam bg-gradient-to-l from-gold-dark via-gold-light to-transparent [offset-anchor:90%_50%] [offset-path:rect(0_auto_auto_0_round_var(--size))]"
        style={{
          width: size,
          ["--size" as string]: `${size}px`,
          ["--duration" as string]: `${duration}s`,
          animationDelay: `-${delay}s`,
        }}
      />
    </div>
  );
}
