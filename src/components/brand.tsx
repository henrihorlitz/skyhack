import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder logo until Henri's design system lands (swap the icon/wordmark here only).
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-semibold tracking-tight", className)}>
      <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Leaf className="size-4" />
      </span>
      MindPeace
    </span>
  );
}
