import { cn } from "@/lib/utils";

type Kind = "nursing" | "medical" | "withheld" | "internal";

// DESIGN.md status chips: teal = safe to share, teal outline = needs the doctor's approval,
// coral = withheld from the family, gray = care team only.
const STYLES: Record<Kind, { label: string; className: string }> = {
  nursing: { label: "Safe to share", className: "bg-primary-soft text-primary-deep" },
  medical: { label: "Needs approval", className: "bg-card text-primary-deep ring-1 ring-primary/35" },
  withheld: { label: "Withheld", className: "bg-coral-soft text-coral-ink" },
  internal: { label: "Care team only", className: "bg-neutral-soft text-neutral-ink" },
};

export function ScopeBadge({ kind, className }: { kind: Kind; className?: string }) {
  const s = STYLES[kind];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold whitespace-nowrap",
        s.className,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
