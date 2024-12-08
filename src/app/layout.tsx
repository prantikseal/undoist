"use client";

import { useThemeStore } from "@/store/themeStore";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <html lang="en" className={theme}>
      <body>{children}</body>
    </html>
  );
}
