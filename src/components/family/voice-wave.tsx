"use client";

import { useEffect, useRef } from "react";

// A silk-like ribbon that moves with the voice on the call screen (inspired by design Inspo/).
// Many thin strands with slightly shifted phases twist against each other, which reads as one
// ribbon with depth. getLevel() returns the audio volume 0..1; the ribbon swells when someone speaks.
// Teal shades from DESIGN.md.
const STRANDS = 30;
const COLORS = ["#1f5551", "#2e9696", "#38a8a8", "#7fd1c9"];

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
    let amp = 0.55;

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

      // Idle: a calm, slow ribbon. Speaking: taller and faster.
      const target = 0.55 + Math.min(1, (level.current() || 0) * 2.5) * 0.45;
      amp += (target - amp) * 0.08;
      t += 0.012 + amp * 0.02;

      const mid = h / 2;
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      COLORS.forEach((c, i) => grad.addColorStop(i / (COLORS.length - 1), c));

      // y position of strand k at horizontal position x
      const y = (x: number, k: number) => {
        const p = x / w;
        const offset = k / (STRANDS - 1) - 0.5; // -0.5 .. 0.5 across the ribbon
        const spine = Math.sin(p * 3.2 + t) * h * 0.22 * amp + Math.sin(p * 6.5 - t * 1.3) * h * 0.07 * amp;
        const twist = Math.cos(p * 2.6 + t * 0.8) * h * 0.34 * (0.5 + amp * 0.5); // ribbon width; passing 0 = a twist
        return mid + spine + offset * twist;
      };

      // Soft glow under the ribbon
      ctx.save();
      ctx.shadowColor = "rgba(56, 168, 168, 0.45)";
      ctx.shadowBlur = 24;
      ctx.strokeStyle = grad;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 10;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) (x === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, x, y(x, STRANDS / 2));
      ctx.stroke();
      ctx.restore();

      // The strands: brighter in the middle, fading toward the ribbon's edges
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      for (let k = 0; k < STRANDS; k++) {
        ctx.globalAlpha = 0.3 + 0.6 * (1 - Math.abs(k / (STRANDS - 1) - 0.5) * 2);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) (x === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, x, y(x, k));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvas}
      className={className}
      style={{ filter: "blur(0.4px)", maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}
      aria-hidden
    />
  );
}
