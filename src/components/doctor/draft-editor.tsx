"use client";

import { EyeOff, Home, Lock } from "lucide-react";
import { ScopeBadge } from "@/components/scope-badge";
import type { FamilyUpdate, UpdateItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = { draft: FamilyUpdate; onChange: (d: FamilyUpdate) => void; pronoun: "she" | "he"; disabled?: boolean };

// The AI draft as the doctor sees it: every item can be switched off or reworded before approval.
export function DraftEditor({ draft, onChange, pronoun, disabled }: Props) {
  const setItem = (id: string, patch: Partial<UpdateItem>) =>
    onChange({ ...draft, items: draft.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });

  const section = (name: UpdateItem["section"]) => draft.items.filter((i) => i.section === name);
  const withheld = draft.withheld.filter((w) => w.kind === "withheld");
  const internal = draft.withheld.filter((w) => w.kind === "internal");

  return (
    <div className="flex flex-col gap-5">
      <Block title={`Why ${pronoun}'s here`} badge={<ScopeBadge kind="medical" />}>
        <Editable value={draft.whyHere} disabled={disabled} onSave={(whyHere) => onChange({ ...draft, whyHere })} />
      </Block>

      <Block title="How today went">
        {section("today").map((i) => (
          <ItemRow key={i.id} item={i} disabled={disabled} onChange={(p) => setItem(i.id, p)} />
        ))}
      </Block>

      <Block title="What's next">
        {section("next").map((i) => (
          <ItemRow key={i.id} item={i} disabled={disabled} onChange={(p) => setItem(i.id, p)} />
        ))}
      </Block>

      <Block title="Expected discharge" badge={draft.discharge && draft.dischargeShared ? <ScopeBadge kind="medical" /> : undefined}>
        {draft.discharge ? (
          <div className={cn("flex items-start gap-3 rounded-row bg-row p-3.5 transition-opacity", !draft.dischargeShared && "opacity-45")}>
            <Toggle
              checked={draft.dischargeShared}
              disabled={disabled}
              onChange={(dischargeShared) => onChange({ ...draft, dischargeShared })}
            />
            <Home className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <Editable
                value={draft.discharge}
                disabled={disabled || !draft.dischargeShared}
                onSave={(discharge) => onChange({ ...draft, discharge })}
              />
            </div>
            {!draft.dischargeShared && <EyeOff className="size-4 text-muted-foreground" />}
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <Home className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm font-medium text-subtitle">No date in the note, so the family sees &quot;No date yet&quot;.</p>
          </div>
        )}
      </Block>

      <div className="rounded-[20px] bg-coral-soft p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-coral-ink">
          <Lock className="size-4" /> Not shared with the family ({draft.withheld.length})
        </h3>
        <ul className="flex flex-col gap-2.5">
          {[...withheld, ...internal].map((w, n) => (
            <li key={n} className="rounded-row bg-card p-3.5 text-sm shadow-soft">
              <div className="mb-1 flex items-start justify-between gap-2">
                <span className="font-semibold">{w.text}</span>
                <ScopeBadge kind={w.kind} />
              </div>
              <p className="font-medium text-subtitle">{w.reason}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Block({ title, badge, children }: { title: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-section">{title}</h3>
        {badge}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

function ItemRow({ item, onChange, disabled }: { item: UpdateItem; onChange: (p: Partial<UpdateItem>) => void; disabled?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-row bg-row p-3.5 transition-opacity",
        !item.include && "opacity-45",
      )}
    >
      <Toggle checked={item.include} disabled={disabled} onChange={(include) => onChange({ include })} />
      <div className="min-w-0 flex-1">
        {item.when && <div className="mb-0.5 text-[13px] font-semibold text-primary-deep">{item.when}</div>}
        <Editable value={item.text} disabled={disabled || !item.include} onSave={(text) => onChange({ text })} />
      </div>
      {item.include ? <ScopeBadge kind={item.scope} /> : <EyeOff className="size-4 text-muted-foreground" />}
    </div>
  );
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Shared with family" : "Not shared"}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-primary" : "bg-neutral-ink/25",
      )}
    >
      <span className={cn("absolute top-0.5 size-4 rounded-full bg-card shadow-sm transition-all", checked ? "left-4.5" : "left-0.5")} />
    </button>
  );
}

// Inline-editable text: click and type, saved on blur.
function Editable({ value, onSave, disabled }: { value: string; onSave: (v: string) => void; disabled?: boolean }) {
  return (
    <p
      contentEditable={!disabled}
      suppressContentEditableWarning
      onBlur={(e) => {
        const text = e.currentTarget.textContent?.trim() ?? "";
        if (text && text !== value) onSave(text);
      }}
      className="rounded-md text-[15px] leading-relaxed outline-none focus:bg-card focus:ring-2 focus:ring-ring/40"
    >
      {value}
    </p>
  );
}
