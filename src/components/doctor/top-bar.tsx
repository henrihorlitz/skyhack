import Link from "next/link";
import { Logo } from "@/components/brand";
import { DEMO_USER, HOSPITAL } from "@/data/seed";

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
        <div className="flex items-center gap-5">
          <Link href="/doctor">
            <Logo />
          </Link>
          <span className="hidden text-sm font-medium text-subtitle sm:inline">
            {HOSPITAL.name} · {HOSPITAL.department} · {HOSPITAL.ward}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- small static avatar */}
          <img src={DEMO_USER.photo} alt="" className="size-9 rounded-full bg-primary-soft object-cover object-top" />
          <span className="hidden font-medium sm:inline">{DEMO_USER.name}</span>
        </div>
      </div>
    </header>
  );
}

// Shown under the doctor screens and the launcher (not in the family phone view).
export function DemoFooter() {
  return (
    <footer className="px-4 py-8 text-center text-[13px] font-medium text-muted-foreground">
      Prototype built at SKYHACK 2026 · Synthetic data only · Not medical advice
    </footer>
  );
}
