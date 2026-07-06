"use client";

import { usePathname } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = pathname.startsWith("/app");

  if (isApp) {
    return <AppShell>{children}</AppShell>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
