import type { Metadata } from "next";

import { adminPublicEnvironment } from "@/config/environment.client";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(adminPublicEnvironment.NEXT_PUBLIC_ADMIN_URL),
  title: "Threads of Gold Merchant",
  description: "Private merchant operations workspace for Threads of Gold.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
