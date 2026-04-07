import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ERP Hax", template: "%s | ERP Hax" },
  description: "Sistema de gestión empresarial — HAX ESTUDIO CREATIVO EIRL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
