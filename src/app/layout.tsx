import type { Metadata } from "next";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEMScan — Regulatory Intelligence for the Australian NEM",
  description: "AI-powered regulatory intelligence platform for the Australian National Electricity Market, built by Symphony.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-nem-bg text-foreground antialiased">
        <Providers>
          <Sidebar />
          <div className="ml-64 min-h-screen">
            <Suspense><Header /></Suspense>
            <main className="p-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
