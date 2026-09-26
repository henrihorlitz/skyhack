"use client";

import { useEffect, useState } from "react";
import { BatteryFull, Camera, Flashlight, Lock, SignalHigh, Wifi } from "lucide-react";
import { AppIcon } from "@/components/brand";
import { cn } from "@/lib/utils";

export type PushNotification = { title: string; body: string };

type Props = { notification: PushNotification | null; onOpen: () => void };

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 10_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return now;
}

// An iOS-style lock screen, drawn in CSS (no copyrighted wallpaper). The family experience starts here:
// when the doctor approves, a push notification slides in; tapping it opens the app.
export function LockScreen({ notification, onOpen }: Props) {
  const now = useClock();
  const time = now?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon" }) ?? "";

  return (
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden text-white select-none"
      // The lock screen belongs to the phone, not our app: use the OS font (SF on Apple devices).
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,#6d8bff_0%,transparent_55%),radial-gradient(90%_70%_at_90%_40%,#ff8a65_0%,transparent_60%),radial-gradient(120%_90%_at_40%_100%,#3a1c71_0%,#1b1340_70%)]" />
      <div className="absolute -top-20 -right-24 size-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex items-center justify-between px-7 pt-3 text-[13px] font-semibold">
        <span>MEO</span>
        <span className="flex items-center gap-1.5">
          <SignalHigh className="size-4" /> <Wifi className="size-4" /> <BatteryFull className="size-5" />
        </span>
      </div>

      <div className="relative mt-6 flex flex-col items-center">
        <Lock className="mb-2 size-4 opacity-80" />
        <p className="text-lg font-medium opacity-90">Saturday 26 September</p>
        <p className="text-[92px] leading-none font-semibold tracking-tight tabular-nums">{time}</p>
      </div>

      <div className="relative mt-auto flex flex-col gap-2 px-3 pb-6">
        {notification && (
          <button
            onClick={onOpen}
            className="flex w-full items-start gap-3 rounded-[22px] bg-white/25 p-3.5 text-left shadow-lg backdrop-blur-2xl animate-in fade-in slide-in-from-top-6 duration-500"
          >
            <AppIcon className="size-10 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="flex justify-between text-[13px]">
                <span className="font-semibold">MindPeace</span>
                <span className="opacity-70">now</span>
              </span>
              <span className="block text-[15px] font-semibold">{notification.title}</span>
              <span className="block text-[14px] leading-snug opacity-90">{notification.body}</span>
            </span>
          </button>
        )}

        <div className="mt-8 flex items-center justify-between px-8">
          <Round><Flashlight className="size-5" /></Round>
          <Round><Camera className="size-5" /></Round>
        </div>
        <button onClick={onOpen} className="mx-auto mt-4 flex flex-col items-center gap-2 text-xs opacity-80">
          <span className={cn(!notification && "animate-pulse")}>Swipe up to open</span>
          <span className="h-1.5 w-36 rounded-full bg-white" />
        </button>
      </div>
    </div>
  );
}

function Round({ children }: { children: React.ReactNode }) {
  return <span className="grid size-12 place-items-center rounded-full bg-black/25 backdrop-blur-xl">{children}</span>;
}
