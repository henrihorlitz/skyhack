import Image from "next/image";
import { cn } from "@/lib/utils";

// The MindPeace mark (leaf with a check: "approved, you can relax") + wordmark. See DESIGN.md.
export function AppIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/app-icon.png"
      alt=""
      width={96}
      height={96}
      className={cn("size-8 rounded-[10px]", className)}
      priority
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight text-foreground", className)}>
      <AppIcon />
      MindPeace
    </span>
  );
}
