"use client";
import { signOut } from "next-auth/react";

interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
}

export default function Topbar({ title, actions }: TopbarProps) {
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6"
      style={{ borderColor: "var(--border)" }}>
      <h1 className="font-semibold text-gray-800 text-base">{title}</h1>
      <div className="flex items-center gap-3">
        {actions}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors px-2 py-1 rounded"
        >
          Salir
        </button>
      </div>
    </header>
  );
}
