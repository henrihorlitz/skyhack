import Link from "next/link";
import { Smartphone, Stethoscope } from "lucide-react";
import { Logo } from "@/components/brand";
import { ResetButton } from "@/components/reset-button";

// Demo launcher: open the doctor view and the family app in two browser windows.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <div>
        <Logo className="mb-6 text-lg" />
        <h1 className="text-3xl font-semibold tracking-tight">Peace of mind for families, time back for doctors.</h1>
        <p className="mt-3 text-muted-foreground">
          The doctor&apos;s daily note becomes a doctor-approved, plain-language update for the family, plus a voice
          assistant that only shares what the doctor approved.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Launch href="/doctor" icon={<Stethoscope className="size-5" />} title="Doctor view" text="Ward 4B · Dr. Inês Silva" />
        <Launch href="/family/maria" icon={<Smartphone className="size-5" />} title="Family app" text="Ana, daughter of Maria" />
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Tip: open each in its own window, family app narrow.</span>
        <ResetButton />
      </div>
    </main>
  );
}

function Launch({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link href={href} target="_blank" className="rounded-xl border bg-card p-5 transition-colors hover:bg-muted/60">
      <span className="mb-3 grid size-10 place-items-center rounded-lg bg-muted">{icon}</span>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{text}</p>
    </Link>
  );
}
