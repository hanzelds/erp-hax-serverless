'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Package,
  BarChart3,
  ShoppingCart,
  Landmark,
  Settings,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Contactos', href: '/contactos', icon: Users },
  { name: 'Ventas', href: '/ventas', icon: FileText },
  { name: 'Gastos', href: '/gastos', icon: Receipt },
  { name: 'Productos', href: '/productos', icon: Package },
  { name: 'Reportes', href: '/reportes', icon: BarChart3 },
  { name: 'Compras', href: '/compras', icon: ShoppingCart },
  { name: 'Banco', href: '/banco', icon: Landmark },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen flex flex-col" style={{ backgroundColor: '#1e2432' }}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-white font-bold text-xl tracking-tight">
          ERP <span className="text-blue-400">Hax</span>
        </h1>
        <p className="text-white/40 text-xs mt-0.5">HAX ESTUDIO CREATIVO</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-white/30 text-xs text-center">Fase 1 — Foundation</p>
      </div>
    </aside>
  )
}
