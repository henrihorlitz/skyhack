import Link from "next/link";
import { Logo } from "@/components/brand";
import { DEMO_USER, HOSPITAL } from "@/data/seed";

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/doctor">
            <Logo />
          </Link>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {HOSPITAL.name} · {HOSPITAL.department} · {HOSPITAL.ward}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold">
            {DEMO_USER.avatar}
          </span>
          <span className="hidden font-medium sm:inline">{DEMO_USER.name}</span>
        </div>
      </div>
    </header>
  );
}
