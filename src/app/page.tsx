import Link from "next/link";
import { Smartphone, Stethoscope } from "lucide-react";
import { Logo } from "@/components/brand";
import { ResetButton } from "@/components/reset-button";
import { DemoFooter } from "@/components/doctor/top-bar";
import { DraftWarmup } from "@/components/draft-warmup";

// Demo launcher: open the doctor view and the family app in two browser windows.
export default function Home() {
  return (
    <>
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 px-6 py-16">
      <div>
        <Logo className="mb-8 text-lg" />
        <h1 className="text-[44px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[56px]">Peace of mind for families, time back for doctors.</h1>
        <p className="mt-4 text-lg font-medium text-subtitle">
          The doctor&apos;s daily note becomes a doctor-approved, plain-language update for the family, plus a voice
          assistant that only shares what the doctor approved.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Launch href="/doctor" icon={<Stethoscope className="size-5" />} title="Doctor view" text="Ward 4B · Dr. Inês Silva" />
        <Launch href="/family/maria" icon={<Smartphone className="size-5" />} title="Family app" text="Ana, daughter of Maria" />
      </div>
      <div className="flex items-center justify-between text-[13px] font-medium text-muted-foreground">
        <span>Tip: open each in its own window, family app narrow.</span>
        <ResetButton />
      </div>
    </main>
    <DemoFooter />
    <DraftWarmup />
    </>
  );
}

function Launch({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link href={href} target="_blank" className="rounded-card bg-card p-6 shadow-card transition-transform hover:-translate-y-0.5">
      <span className="mb-4 grid size-11 place-items-center rounded-full bg-primary-soft text-primary-deep">{icon}</span>
      <p className="text-[22px] font-semibold">{title}</p>
      <p className="text-sm font-medium text-subtitle">{text}</p>
    </Link>
  );
}
