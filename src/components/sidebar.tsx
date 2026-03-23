"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  Users,
  School,
  Ruler,
  Shirt,
  DollarSign,
  Plus,
  LayoutDashboard,
  Boxes,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { logout } from "@/app/login/logout-action";

const mainNav = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/clientes", label: "Clientes", icon: Users },
];

const catalogNav = [
  { href: "/colegios", label: "Colegios", icon: School },
  { href: "/tallas", label: "Tallas", icon: Ruler },
  { href: "/productos", label: "Productos", icon: Shirt },
  { href: "/precios", label: "Precios", icon: DollarSign },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const catalogActive = catalogNav.some((item) => pathname.startsWith(item.href));

  if (pathname === "/login") return null;

  return (
    <>
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 border-b bg-background px-4 py-3 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="size-5" />
        </button>
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Mimins
        </Link>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-56 border-r bg-muted/20 flex flex-col h-screen sticky top-0",
          "max-md:fixed max-md:z-50 max-md:bg-background",
          mobileOpen ? "" : "max-md:hidden"
        )}
      >
        <div className="p-4 pb-2 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight px-2">
            Mimins
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
            className="text-muted-foreground hover:text-foreground transition-colors md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-3 py-2">
          <Link
            href="/pedidos?nuevo=1"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full justify-start gap-2 text-base"
            )}
          >
            <Plus className="size-4" />
            Nuevo pedido
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-base transition-colors",
                isActive(item.href)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}

          <div className="my-2 border-t" />

          <button
            onClick={() => setCatalogOpen(!catalogOpen)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-base transition-colors w-full text-left",
              catalogActive
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Boxes className="size-4" />
            Catálogos
            <ChevronRight className={cn(
              "ml-auto size-3.5 transition-transform",
              catalogOpen || catalogActive ? "rotate-90" : ""
            )} />
          </button>

          {(catalogOpen || catalogActive) && (
            <div className="flex flex-col gap-0.5 ml-4 border-l pl-2">
              {catalogNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="px-3 py-3 border-t space-y-1">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            aria-label="Cambiar tema"
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="size-4 hidden dark:block" />
            <span className="dark:hidden">Modo oscuro</span>
            <span className="hidden dark:block">Modo claro</span>
          </button>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
