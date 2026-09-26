"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FamilyApp } from "@/components/family/family-app";
import { LockScreen, type PushNotification } from "@/components/family/lock-screen";
import { useDemoState } from "@/lib/client";
import { DEMO_USER } from "@/data/seed";
import type { Patient } from "@/lib/types";

const PUSH_DELAY_MS = 1500;

// The family's phone: starts on the lock screen. A newly approved update arrives as a push
// notification a moment later; tapping it opens the app with the new day highlighted.
export function FamilyExperience({ patient }: { patient: Patient }) {
  const state = useDemoState(patient.id);
  const [locked, setLocked] = useState(true);
  const [notification, setNotification] = useState<PushNotification | null>(null);
  const [freshDay, setFreshDay] = useState<string>();
  const seen = useRef<string | null>(null);
  const lockedRef = useRef(locked);

  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  const approvals = state?.approvals ?? [];
  const latest = approvals.at(-1);

  useEffect(() => {
    if (!latest) return;
    const key = latest.approvedAt;
    const isNew = seen.current !== null && seen.current !== key;
    seen.current = key;
    if (!isNew) return;
    const timer = setTimeout(() => {
      setFreshDay(latest.day);
      const title = `New update about ${patient.firstName}`;
      const body = `${DEMO_USER.name} approved today's update. Tap to see how ${patient.pronoun}'s doing.`;
      if (lockedRef.current) setNotification({ title, body });
      else toast.success(title, { description: `Approved by ${DEMO_USER.name}` });
    }, PUSH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [latest, patient.firstName, patient.pronoun]);

  function open() {
    setLocked(false);
    setNotification(null);
  }

  if (locked) return <LockScreen notification={notification} onOpen={open} />;
  return (
    <div className="flex flex-1 flex-col animate-in fade-in zoom-in-95 duration-300">
      <FamilyApp patient={patient} approvals={approvals} freshDay={freshDay} />
    </div>
  );
}
