import { CalendarClock, MessageCircleQuestion } from "lucide-react";
import { timeLabel } from "@/lib/client";
import type { Question } from "@/lib/types";

// Questions the voice agent was not allowed to answer, bundled for the doctor.
export function QuestionsPanel({ questions }: { questions: Question[] }) {
  if (questions.length === 0) return null;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-withheld/30 bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <MessageCircleQuestion className="size-4 text-withheld" />
        Family questions for you ({questions.length})
      </h3>
      <ul className="flex flex-col gap-2.5">
        {questions.map((q) => (
          <li key={q.id} className="rounded-lg bg-muted/50 p-3 text-sm">
            <p className="font-medium">&ldquo;{q.question}&rdquo;</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>
                {q.askedBy} · via voice assistant · {timeLabel(q.createdAt)}
              </span>
              {q.callbackSlot && (
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
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
