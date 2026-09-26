"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Home } from "lucide-react";
import { relativeDay } from "@/lib/client";
import { DEMO_TODAY } from "@/data/seed";
import type { Approval } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = { approvals: Approval[]; doctor: string; freshDay?: string };

// Past days (tap to expand) → today in teal → upcoming steps → expected discharge (an estimate).
export function Timeline({ approvals, doctor, freshDay }: Props) {
  const latest = approvals.at(-1);
  if (!latest) return null;
  const upcoming = latest.update.items.filter((i) => i.section === "next");

  return (
    <ol className="relative flex flex-col">
      {approvals.map((a) => (
        <PastNode key={`${a.day}-${a === latest}`} approval={a} current={a === latest} fresh={a.day === freshDay} />
      ))}
      {upcoming.map((i) => (
        <Node key={i.id} dot={<span className="block size-3 rounded-full border-2 border-primary/45 bg-card" />}>
          <p className="text-[13px] font-semibold text-muted-foreground">{i.when ?? "Coming up"}</p>
          <p className="text-[15px] leading-snug">{i.text}</p>
        </Node>
      ))}
      <Node
        last
        dot={
          <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-primary-deep">
            <Home className="size-3.5" />
          </span>
        }
      >
        <p className="text-[13px] font-semibold text-muted-foreground">Expected home · estimate</p>
        {latest.update.discharge ? (
          <p className="font-semibold">{latest.update.discharge}</p>
        ) : (
          <p className="text-[15px] font-medium text-subtitle">No date yet. {doctor} will update you.</p>
        )}
      </Node>
    </ol>
  );
}

function PastNode({ approval, current, fresh }: { approval: Approval; current: boolean; fresh: boolean }) {
  const [open, setOpen] = useState(current);
  const day = relativeDay(approval.day);
  const today = approval.update.items.filter((i) => i.section === "today");
  return (
    <Node
      id={`day-${approval.day}`}
      dot={<span className={cn("block size-3 rounded-full", current ? "bg-primary ring-4 ring-primary/20" : "bg-muted-foreground/35")} />}
      className={cn("scroll-mt-6", fresh && "animate-in fade-in slide-in-from-left-4 duration-700")}
    >
      <button onClick={() => setOpen(!open)} className="flex w-full items-start justify-between gap-2 text-left">
        <div>
          <p className={cn("text-[13px] font-semibold", current ? "text-primary-deep" : "text-muted-foreground")}>
            {day === "today" ? "Today" : day === "yesterday" ? "Yesterday" : day}
            {fresh && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[11px] text-primary-foreground">New</span>}
          </p>
          <p className={cn(current ? "font-semibold" : "text-[15px] font-medium text-subtitle")}>{approval.update.headline}</p>
        </div>
        <ChevronDown className={cn("mt-1 size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="mt-2.5 flex flex-col gap-1.5 rounded-row bg-row p-3.5 text-[15px] leading-relaxed">
          {today.map((i) => (
            <li key={i.id}>{i.text}</li>
          ))}
        </ul>
      )}
    </Node>
  );
}

function Node({
  id,
  dot,
  children,
  last,
  className,
}: {
  id?: string;
  dot: React.ReactNode;
  children: React.ReactNode;
  last?: boolean;
  className?: string;
}) {
  return (
    <li id={id} className={cn("relative flex gap-3 pb-5", className)}>
      {/* The line runs from this dot's center into the next item, so the dots read as one connected path. */}
      {!last && <span className="absolute top-2.5 -bottom-2.5 left-[13.5px] w-px bg-border" />}
      <div className="relative flex w-7 shrink-0 justify-center pt-1">
        <span className="relative z-10">{dot}</span>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// "Tuesday 29 September, if the scan is clear" → "2026-09-29". Only reads a date the doctor approved.
function dischargeDay(text: string | null | undefined): string | null {
  const m = text?.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3})[a-z]*/);
  const month = m ? MONTHS.indexOf(m[2].toLowerCase()) : -1;
  if (!m || month < 0) return null;
  return `${DEMO_TODAY.slice(0, 4)}-${String(month + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

// DESIGN.md day chips: one per day of the stay, today in teal. The approved expected discharge day
// gets a dashed, half-filled chip with a home outline: "roughly here", not a promise. Tap a day to jump to it.
export function DayStrip({ admitted, approvals }: { admitted: string; approvals: Approval[] }) {
  const home = dischargeDay(approvals.at(-1)?.update.discharge);
  const start = Date.parse(`${admitted}T12:00:00Z`);
  const minEnd = Date.parse(`${DEMO_TODAY}T12:00:00Z`) + 7 * 86_400_000;
  const end = Math.max(minEnd, home ? Date.parse(`${home}T12:00:00Z`) + 2 * 86_400_000 : 0);
  const days: string[] = [];
  for (let t = start; t <= end; t += 86_400_000) days.push(new Date(t).toISOString().slice(0, 10));
  const withUpdate = new Set(approvals.map((a) => a.day));
  const scroller = useHorizontalScroll();

  return (
    // Vertical padding inside the scroller so the chips' shadow isn't clipped.
    <div
      ref={scroller}
      className="-mx-5 -my-3 flex cursor-grab gap-2 overflow-x-auto px-5 py-3 select-none [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
    >
      {days.map((d) => {
        const date = new Date(`${d}T12:00:00Z`);
        const selected = d === DEMO_TODAY;
        const isHome = d === home && !selected;
        return (
          <button
            key={d}
            data-today={selected || undefined}
            onClick={() => document.getElementById(`day-${d}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            title={isHome ? "Expected home (estimate)" : undefined}
            className={cn(
              "flex h-[58px] w-[42px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-chip",
              selected && "bg-primary text-primary-foreground shadow-glow",
              isHome && "border-2 border-dashed border-primary/60 bg-[linear-gradient(to_top,var(--primary-soft)_50%,var(--card)_50%)] text-primary-deep",
              !selected && !isHome && "bg-day text-muted-foreground",
            )}
          >
            <span className="text-[11px] font-medium">{date.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" })}</span>
            <span className={cn("text-[15px] font-semibold", !selected && !isHome && "text-foreground")}>{date.getUTCDate()}</span>
            {isHome ? (
              <Home className="size-2.5" strokeWidth={2.5} />
            ) : (
              <span className={cn("size-1 rounded-full", withUpdate.has(d) ? (selected ? "bg-primary-foreground" : "bg-primary") : "bg-transparent")} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// Makes a row scrollable sideways on desktop too: mouse wheel → horizontal, click-and-drag,
// and centers "today" when it first appears.
function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const center = () => {
      const today = el.querySelector<HTMLElement>("[data-today]");
      if (!today) return;
      const box = el.getBoundingClientRect();
      const chip = today.getBoundingClientRect();
      el.scrollLeft += chip.left + chip.width / 2 - (box.left + box.width / 2);
    };
    requestAnimationFrame(center); // after layout

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // trackpads already scroll sideways
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // touch scrolls natively
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      if (Math.abs(e.clientX - startX) > 4) moved = true;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const onUp = () => (dragging = false);
    // A drag should not count as a tap on a day.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);
  return ref;
}
