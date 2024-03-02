import "@/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

import MainLayout from "@/components/MainLayout";
import { Toaster } from "@/components/ui/sonner";

import { SpeedInsights } from '@vercel/speed-insights/next';

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SUBS",
  description: "Seoun Middle School Broadcast System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "h-fit bg-background font-sans antialiased dark",
          fontSans.variable
        )}
      >
        <MainLayout>{children}</MainLayout>
        <Toaster richColors />
        <SpeedInsights />
      </body>
    </html>
  );
}
