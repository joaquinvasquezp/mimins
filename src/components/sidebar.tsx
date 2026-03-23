"use client";

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
  Settings,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";

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

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const catalogActive = catalogNav.some((item) => pathname.startsWith(item.href));

  return (
    <aside className="w-56 border-r bg-muted/20 flex flex-col h-screen sticky top-0">
      <div className="p-4 pb-2">
        <Link href="/" className="text-xl font-semibold tracking-tight px-2">
          Mimins
        </Link>
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
          <Settings className="size-4" />
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
    </aside>
  );
}
