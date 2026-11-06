/** Deterministic values so SSR and client markup match. */
export function Meteors({ number = 14 }: { number?: number }) {
  return (
    <>
      {Array.from({ length: number }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute size-0.5 rotate-[215deg] animate-meteor rounded-full bg-white/80"
          style={{
            top: "-40px",
            left: `${(i * 97) % 100}%`,
            animationDelay: `${((i * 37) % 70) / 10}s`,
            animationDuration: `${3 + ((i * 13) % 5)}s`,
          }}
        >
          <span className="absolute top-1/2 -z-10 h-px w-[60px] -translate-y-1/2 bg-gradient-to-r from-white/70 to-transparent" />
        </span>
      ))}
    </>
  );
}
