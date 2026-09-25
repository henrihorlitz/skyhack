import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AiPlayground } from "@/components/ai-playground";
import { DEMO_USER } from "@/data/seed";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">SKYHACK starter</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex size-8 items-center justify-center rounded-full bg-muted font-medium">
            {DEMO_USER.avatar}
          </span>
          {DEMO_USER.name}
        </div>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Smoke test</CardTitle>
          <CardDescription>
            Agent, AI, voice and fake actions. Check <Link href="/status" className="underline">/status</Link> for
            connections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AiPlayground />
        </CardContent>
      </Card>
    </main>
  );
}
