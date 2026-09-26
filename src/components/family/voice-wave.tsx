"use client";

import { useEffect, useRef } from "react";

// A soft, blurred ribbon that moves with the voice on the call screen (inspired by design Inspo/).
// getLevel() returns the current audio volume 0..1; the ribbon swells when someone speaks.
// Colors are placeholders until the design system lands.
const RIBBONS = [
  { colors: ["#1e3a8a", "#2563eb", "#0ea5e9"], width: 46, speed: 0.9, phase: 0, alpha: 0.9 },
  { colors: ["#10b981", "#34d399", "#1d4ed8"], width: 30, speed: 1.3, phase: 2.1, alpha: 0.75 },
  { colors: ["#0d9488", "#60a5fa", "#1e40af"], width: 20, speed: 1.7, phase: 4.2, alpha: 0.6 },
];

export function VoiceWave({ getLevel, className }: { getLevel: () => number; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const level = useRef(getLevel);

  useEffect(() => {
    level.current = getLevel;
  });

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    let frame = 0;
    let t = 0;
    let amp = 0.15;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (el.width !== w * dpr) {
        el.width = w * dpr;
        el.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const target = 0.18 + Math.min(1, (level.current() || 0) * 2.2) * 0.82;
      amp += (target - amp) * 0.12; // smooth, so it breathes instead of jittering
      t += 0.016;

      for (const r of RIBBONS) {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        r.colors.forEach((c, i) => grad.addColorStop(i / (r.colors.length - 1), c));
        ctx.strokeStyle = grad;
        ctx.globalAlpha = r.alpha;
        ctx.lineWidth = r.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let x = -20; x <= w + 20; x += 6) {
          const p = x / w;
          const y =
            h / 2 +
            Math.sin(p * 5 + t * r.speed + r.phase) * h * 0.18 * amp +
            Math.sin(p * 9 - t * r.speed * 1.4 + r.phase) * h * 0.08 * amp +
            Math.sin(p * Math.PI) * -h * 0.06;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvas} className={className} style={{ filter: "blur(14px)" }} aria-hidden />;
}
