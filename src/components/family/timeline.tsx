"use client";

import { useState } from "react";
import { ChevronDown, Home } from "lucide-react";
import { relativeDay } from "@/lib/client";
import type { Approval } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = { approvals: Approval[]; doctor: string; freshDay?: string };

// Past days (tap to expand) → today highlighted → upcoming steps → expected discharge.
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
        <Node key={i.id} dot={<span className="block size-3 rounded-full border-2 border-dashed border-muted-foreground/50 bg-background" />}>
          <p className="text-xs font-medium text-muted-foreground">{i.when ?? "Coming up"}</p>
          <p className="text-sm">{i.text}</p>
        </Node>
      ))}
      <Node last dot={<span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground"><Home className="size-3.5" /></span>}>
        <p className="text-xs font-medium text-muted-foreground">Expected home</p>
        {latest.update.discharge ? (
          <p className="font-semibold">{latest.update.discharge}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Not estimated yet. {doctor} will update you.</p>
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
      dot={<span className={cn("block size-3 rounded-full", current ? "bg-primary ring-4 ring-primary/15" : "bg-muted-foreground/40")} />}
      className={cn(fresh && "animate-in fade-in slide-in-from-left-4 duration-700")}
    >
      <button onClick={() => setOpen(!open)} className="flex w-full items-start justify-between gap-2 text-left">
        <div>
          <p className={cn("text-xs font-medium", current ? "text-primary" : "text-muted-foreground")}>
            {day === "today" ? "Today" : day === "yesterday" ? "Yesterday" : day}
            {fresh && <span className="ml-2 rounded-full bg-nursing-soft px-1.5 py-0.5 text-[10px] text-nursing">New</span>}
          </p>
          <p className={cn(current ? "font-semibold" : "text-sm")}>{approval.update.headline}</p>
        </div>
        <ChevronDown className={cn("mt-1 size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul className={cn("mt-2 flex flex-col gap-1.5 rounded-xl p-3 text-sm leading-relaxed", current ? "bg-card shadow-sm ring-1 ring-border" : "bg-muted/50")}>
          {today.map((i) => (
            <li key={i.id}>{i.text}</li>
          ))}
        </ul>
      )}
    </Node>
  );
}

function Node({ dot, children, last, className }: { dot: React.ReactNode; children: React.ReactNode; last?: boolean; className?: string }) {
  return (
    <li className={cn("relative flex gap-3 pb-5", className)}>
      <div className="relative flex w-7 shrink-0 justify-center pt-1">
        {!last && <span className="absolute top-4 bottom-[-4px] w-px bg-border" />}
        <span className="relative bg-transparent">{dot}</span>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}
