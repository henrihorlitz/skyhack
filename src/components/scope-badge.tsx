import { cn } from "@/lib/utils";

type Kind = "nursing" | "medical" | "withheld" | "internal";

const STYLES: Record<Kind, { label: string; className: string }> = {
  nursing: { label: "Nursing scope", className: "bg-nursing-soft text-nursing" },
  medical: { label: "Needs your approval", className: "bg-medical-soft text-medical" },
  withheld: { label: "Withheld", className: "bg-withheld-soft text-withheld" },
  internal: { label: "Care team only", className: "bg-internal-soft text-internal" },
};

export function ScopeBadge({ kind, className }: { kind: Kind; className?: string }) {
  const s = STYLES[kind];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        s.className,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
