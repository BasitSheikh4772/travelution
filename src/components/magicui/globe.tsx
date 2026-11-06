"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

type LL = [number, number];
const HUB: { name: string; ll: LL } = { name: "Karachi", ll: [24.86, 67.01] };
const DESTS: { name: string; ll: LL; period: number; phase: number }[] = [
  { name: "Dubai", ll: [25.2, 55.27], period: 5.5, phase: 0.0 },
  { name: "Istanbul", ll: [41.01, 28.97], period: 8, phase: 0.35 },
  { name: "Baku", ll: [40.41, 49.87], period: 6.5, phase: 0.7 },
  { name: "Maldives", ll: [4.17, 73.51], period: 7, phase: 0.15 },
  { name: "Makkah", ll: [21.42, 39.83], period: 7.5, phase: 0.55 },
];

// ---- same maths cobe uses in its shaders (see cobe/dist), so the overlay lines up exactly ----
const R0 = 0.8;
const ELEV = 0.02;
const ARC_H = 0.3;
type V3 = [number, number, number];

const toVec = ([lat, lon]: LL): V3 => {
  const a = (lat * Math.PI) / 180;
  const b = (lon * Math.PI) / 180 - Math.PI;
  const c = Math.cos(a);
  return [-c * Math.cos(b), Math.sin(a), c * Math.sin(b)];
};
const norm = (v: V3): V3 => {
  const l = Math.hypot(...v) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const rotate = ([x, y, z]: V3, phi: number, theta: number): V3 => {
  const e = Math.cos(phi), f = Math.sin(phi), c = Math.cos(theta), d = Math.sin(theta);
  return [e * x + f * z, f * d * x + c * y - e * d * z, -f * c * x + d * y + e * c * z];
};
const bezier = (a: V3, ctrl: V3, b: V3, t: number): V3 => {
  const u = 1 - t;
  return [0, 1, 2].map((i) => u * u * a[i] + 2 * u * t * ctrl[i] + t * t * b[i]) as V3;
};

/** Earth globe (cobe) with animated flights out of Karachi, drawn on an exactly-aligned overlay canvas. */
export function Globe({ className }: { className?: string }) {
  const glRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gl = glRef.current;
    const fx = fxRef.current;
    if (!gl || !fx) return;
    const size = gl.offsetWidth;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    fx.width = fx.height = size * dpr;
    const ctx = fx.getContext("2d")!;

    let phi = 4.35;
    const theta = 0.3;
    let drag = 0, down = false, lastX = 0, raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const globe = createGlobe(gl, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,
      phi,
      theta,
      // mostly "dark" mode: deep-ocean body with luminous land dots, then lit/shaded by the overlay below
      dark: 0.7,
      diffuse: 1.25,
      mapSamples: 24000,
      mapBrightness: 6,
      baseColor: [0.22, 0.58, 1],
      markerColor: [0.97, 0.82, 0],
      glowColor: [0.3, 0.62, 1],
      markerElevation: ELEV,
    });

    const hubV = toVec(HUB.ll);
    const routes = DESTS.map((d) => {
      const to = toVec(d.ll);
      return {
        ...d,
        a: hubV.map((x) => x * (R0 + ELEV)) as V3,
        b: to.map((x) => x * (R0 + ELEV)) as V3,
        ctrl: norm([hubV[0] + to[0], hubV[1] + to[1], hubV[2] + to[2]]).map((x) => x * (R0 + ARC_H)) as V3,
        toV: to,
      };
    });

    const half = (size * dpr) / 2;
    // projects a point; returns screen px + whether it's on the visible hemisphere
    const proj = (v: V3, ph: number) => {
      const r = rotate(v, ph, theta);
      return { x: half + r[0] * half, y: half - r[1] * half, vis: !(r[2] < 0 && Math.hypot(r[0], r[1]) < R0) };
    };

    const plane = (x: number, y: number, ang: number, s: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.scale(s, s);
      ctx.beginPath();
      const half = [[11, 0], [3, -2.4], [-1, -9], [-4, -9], [-2.6, -2], [-7.5, -1.6], [-9, -4.2], [-11, -4.2], [-10, 0]] as const;
      half.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      [...half].reverse().forEach(([px, py]) => ctx.lineTo(px, -py));
      ctx.closePath();
      ctx.shadowColor = "rgba(247,208,0,0.95)";
      ctx.shadowBlur = 14 * dpr;
      ctx.fillStyle = "#ffe35a";
      ctx.fill();
      ctx.restore();
    };

    const t0 = performance.now();
    const frame = (now: number) => {
      const time = (now - t0) / 1000;
      if (!down && !reduce) phi += 0.0035;
      const ph = phi + drag;
      globe.update({ phi: ph });

      ctx.clearRect(0, 0, fx.width, fx.height);
      ctx.lineCap = "round";

      // lighting pass: sun from the upper-left, soft night-side shadow bottom-right, thin atmosphere rim
      const rad = R0 * half;
      ctx.save();
      ctx.beginPath();
      ctx.arc(half, half, rad, 0, Math.PI * 2);
      ctx.clip();
      const shade = ctx.createRadialGradient(half - rad * 0.4, half - rad * 0.45, rad * 0.1, half + rad * 0.1, half + rad * 0.1, rad * 1.25);
      shade.addColorStop(0, "rgba(190,225,255,0.20)");
      shade.addColorStop(0.35, "rgba(0,0,0,0)");
      shade.addColorStop(0.75, "rgba(2,6,32,0.32)");
      shade.addColorStop(1, "rgba(1,3,20,0.62)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, fx.width, fx.height);
      const rim = ctx.createRadialGradient(half, half, rad * 0.86, half, half, rad);
      rim.addColorStop(0, "rgba(120,190,255,0)");
      rim.addColorStop(1, "rgba(150,210,255,0.35)");
      ctx.fillStyle = rim;
      ctx.fillRect(0, 0, fx.width, fx.height);
      ctx.restore();

      for (const r of routes) {
        // faint full route
        ctx.setLineDash([3 * dpr, 7 * dpr]);
        ctx.lineWidth = 1.2 * dpr;
        ctx.strokeStyle = "rgba(255,255,255,0.28)";
        ctx.beginPath();
        let pen = false;
        for (let i = 0; i <= 48; i++) {
          const p = proj(bezier(r.a, r.ctrl, r.b, i / 48), ph);
          if (p.vis) { pen ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); pen = true; } else pen = false;
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // flight progress with a pause at the destination
        const cycle = (time / r.period + r.phase) % 1;
        const t = Math.min(cycle / 0.82, 1);
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const flying = cycle < 0.82;

        if (flying) {
          // comet trail
          const seg = 16;
          for (let i = 0; i < seg; i++) {
            const t1 = Math.max(0, e - 0.22 * ((i + 1) / seg));
            const t2 = Math.max(0, e - 0.22 * (i / seg));
            const p1 = proj(bezier(r.a, r.ctrl, r.b, t1), ph);
            const p2 = proj(bezier(r.a, r.ctrl, r.b, t2), ph);
            if (!p1.vis || !p2.vis) continue;
            ctx.strokeStyle = `rgba(255,214,10,${0.9 * (1 - i / seg)})`;
            ctx.lineWidth = (3.2 - 2.2 * (i / seg)) * dpr;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
          const p = proj(bezier(r.a, r.ctrl, r.b, e), ph);
          const q = proj(bezier(r.a, r.ctrl, r.b, Math.min(e + 0.015, 1)), ph);
          if (p.vis) plane(p.x, p.y, Math.atan2(q.y - p.y, q.x - p.x), dpr * (0.8 + 0.5 * Math.sin(Math.PI * e)));
        } else {
          // arrival pulse
          const k = (cycle - 0.82) / 0.18;
          const p = proj(r.b, ph);
          if (p.vis) {
            ctx.strokeStyle = `rgba(255,224,80,${1 - k})`;
            ctx.lineWidth = 2 * dpr;
            ctx.beginPath();
            ctx.arc(p.x, p.y, (6 + 26 * k) * dpr, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // city dots + labels
      const drawCity = (name: string, v: V3, big: boolean) => {
        const p = proj(v, ph);
        if (!p.vis) return;
        ctx.fillStyle = "#ffd60a";
        ctx.shadowColor = "rgba(255,214,10,0.9)";
        ctx.shadowBlur = 10 * dpr;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (big ? 5.5 : 3.6) * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.font = `600 ${(big ? 12 : 10.5) * dpr}px system-ui, sans-serif`;
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "rgba(20,5,8,0.75)";
        ctx.lineWidth = 3 * dpr;
        ctx.strokeText(name, p.x + 9 * dpr, p.y + 4 * dpr);
        ctx.fillText(name, p.x + 9 * dpr, p.y + 4 * dpr);
      };
      drawCity(HUB.name, routes[0].a, true);
      routes.forEach((r) => drawCity(r.name, r.b, false));

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onDown = (e: PointerEvent) => { down = true; lastX = e.clientX; fx.style.cursor = "grabbing"; };
    const onUp = () => { down = false; phi += drag; drag = 0; fx.style.cursor = "grab"; };
    const onMove = (e: PointerEvent) => { if (down) drag = (e.clientX - lastX) / 120; };
    fx.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      fx.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      globe.destroy();
    };
  }, []);

  return (
    <div className={`relative ${className ?? ""}`} style={{ aspectRatio: "1" }}>
      {/* atmosphere glow + ground shadow */}
      <div aria-hidden className="absolute inset-[6%] rounded-full bg-sky-500/25 blur-3xl" />
      <div aria-hidden className="absolute inset-[14%] rounded-full bg-gold/10 blur-3xl" />
      <div aria-hidden className="absolute -bottom-5 left-[14%] right-[14%] h-10 rounded-[50%] bg-black/60 blur-2xl" />
      <canvas ref={glRef} className="absolute inset-0 size-full" />
      <canvas ref={fxRef} className="absolute inset-0 size-full" style={{ cursor: "grab", touchAction: "pan-y" }} />
    </div>
  );
}
