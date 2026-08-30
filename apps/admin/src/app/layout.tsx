import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
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
