import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// DESIGN.md: everything is Poppins, weights 400/500/600.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindPeace",
  description: "Doctor-approved daily updates and a voice assistant for families of hospital patients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
