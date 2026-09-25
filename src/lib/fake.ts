import { toast } from "sonner";

// Fake-door helper for anything that doesn't need to really work in the demo
// (payments, sending emails, CRM sync, exports …).
// Usage:  onClick={() => fakeAction("Invoice sent to João Ferreira")}

export async function fakeAction(successMessage: string, delayMs = 900) {
  const id = toast.loading("Working…");
  await new Promise((r) => setTimeout(r, delayMs));
  toast.success(successMessage, { id });
}
