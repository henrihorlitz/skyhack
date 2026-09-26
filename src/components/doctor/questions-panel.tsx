import { CalendarClock, MessageCircleQuestion } from "lucide-react";
import { timeLabel } from "@/lib/client";
import type { Question } from "@/lib/types";

// Questions the voice agent was not allowed to answer, bundled for the doctor.
export function QuestionsPanel({ questions }: { questions: Question[] }) {
  if (questions.length === 0) return null;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 rounded-card bg-card p-6 shadow-card">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-section">
        <MessageCircleQuestion className="size-4 text-primary" />
        Family questions for you ({questions.length})
      </h3>
      <ul className="flex flex-col gap-2.5">
        {questions.map((q) => (
          <li key={q.id} className="rounded-row bg-row p-3.5 text-sm">
            <p className="text-[15px] font-semibold">&ldquo;{q.question}&rdquo;</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] font-medium text-muted-foreground">
              <span>
                {q.askedBy} · via voice assistant · {timeLabel(q.createdAt)}
              </span>
              {q.callbackSlot && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-0.5 font-semibold text-primary-deep">
                  <CalendarClock className="size-3.5" /> Callback {q.callbackSlot}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
