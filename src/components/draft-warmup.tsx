"use client";

import { useEffect } from "react";
import { fetchDraft } from "@/lib/client";
import { PATIENTS } from "@/data/seed";
import { TODAY_NOTES } from "@/data/notes";

// Prepares today's drafts in the background (like the daily job would), so the doctor view
// opens instantly. Drafts are cached on the server, so this only costs AI time once per note.
export function DraftWarmup() {
  useEffect(() => {
    for (const p of PATIENTS) fetchDraft(p.id, TODAY_NOTES[p.id]).catch(() => {});
  }, []);
  return null;
}
