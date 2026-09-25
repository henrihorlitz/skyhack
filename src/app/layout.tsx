import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TOMORROW: set your product name + one-liner here (shows in browser tab & link previews).
export const metadata: Metadata = {
  title: "SKYHACK",
  description: "Built in 10 hours at SKYHACK 2026, Lisbon.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="px-4 py-6 text-center text-xs text-muted-foreground">
          Prototype built at SKYHACK 2026 · Demo uses synthetic data only · Not medical advice
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
