import { CalendarClock, ClipboardList } from "lucide-react";

const VISIBLE = ["log_question_for_doctor", "book_callback_slot"];

// Shows what the assistant did (question passed on, callback booked), so judges see the agent act.
export function EventChips({ events }: { events: { tool: string; label: string }[] }) {
  const shown = events
    .filter((e) => VISIBLE.includes(e.tool))
    .sort((a, b) => VISIBLE.indexOf(a.tool) - VISIBLE.indexOf(b.tool));
  return (
    <>
      {shown.map((e, n) => (
        <span
          key={n}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-[13px] font-semibold text-primary-deep animate-in fade-in zoom-in-95"
        >
          {e.tool === "book_callback_slot" ? <CalendarClock className="size-3.5" /> : <ClipboardList className="size-3.5" />}
          {e.label}
        </span>
      ))}
    </>
  );
}
