import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/sidebar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mimins",
  description: "Sistema de gestión de pedidos - Uniformes escolares",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="font-[family-name:var(--font-inter)] min-h-full flex">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 pt-16 md:pt-6 md:p-6 lg:p-8">
          <div className="max-w-6xl">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
