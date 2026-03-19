import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "Mimins",
  description: "Sistema de gestión de pedidos - Uniformes escolares",
};

const navItems = [
  { href: "/colegios", label: "Colegios" },
  { href: "/tallas", label: "Tallas" },
  { href: "/productos", label: "Productos" },
  { href: "/clientes", label: "Clientes" },
  { href: "/pedidos", label: "Pedidos" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <aside className="w-56 border-r bg-muted/40 p-4 flex flex-col gap-2">
          <Link href="/" className="text-lg font-bold mb-4 px-2">
            Mimins
          </Link>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
