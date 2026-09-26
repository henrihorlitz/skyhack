"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fakeAction } from "@/lib/fake";

// Clears today's approvals and family questions so the demo can run again from the start.
export function ResetButton() {
  async function reset() {
    await fetch("/api/reset", { method: "POST" });
    await fakeAction("Demo reset: today's updates and questions cleared", 300);
  }
  return (
    <Button variant="ghost" size="sm" onClick={reset}>
      <RotateCcw /> Reset demo
    </Button>
  );
}
