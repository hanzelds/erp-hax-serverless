'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

interface TopbarProps {
  title: string
  actions?: React.ReactNode
}

export default function Topbar({ title, actions }: TopbarProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h2 className="text-gray-800 font-semibold text-base">{title}</h2>
      <div className="flex items-center gap-3">
        {actions}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Salir
        </button>
      </div>
    </header>
  )
}
