"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  {
    section: "Principal",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "▦" },
    ],
  },
  {
    section: "Ventas",
    items: [
      { href: "/contactos", label: "Contactos", icon: "◉" },
      { href: "/ventas", label: "Facturas", icon: "▤" },
      { href: "/productos", label: "Productos", icon: "▣" },
    ],
  },
  {
    section: "Finanzas",
    items: [
      { href: "/gastos", label: "Gastos", icon: "▼" },
      { href: "/compras", label: "Compras", icon: "▽" },
      { href: "/banco", label: "Banco", icon: "◈" },
    ],
  },
  {
    section: "Análisis",
    items: [
      { href: "/reportes", label: "Reportes", icon: "◫" },
    ],
  },
  {
    section: "Sistema",
    items: [
      { href: "/configuracion", label: "Configuración", icon: "◎" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-56 flex flex-col z-30"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ background: "var(--primary)" }}
        >
          H
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">ERP Hax</p>
          <p className="text-xs" style={{ color: "var(--sidebar-text)" }}>
            Hax Estudio
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV.map((group) => (
          <div key={group.section} className="mb-5">
            <p
              className="text-xs font-semibold uppercase tracking-wider px-2 mb-1"
              style={{ color: "var(--sidebar-text)", opacity: 0.6 }}
            >
              {group.section}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5",
                    active
                      ? "text-white font-medium"
                      : "hover:text-white"
                  )}
                  style={{
                    background: active ? "var(--sidebar-active)" : "transparent",
                    color: active ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
                  }}
                >
                  <span className="text-base w-4 text-center">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
          style={{ color: "var(--sidebar-text)" }}>
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            H
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate">Hanzel De Los Santos</p>
            <p className="text-xs truncate" style={{ color: "var(--sidebar-text)" }}>Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
