import { prisma } from "@/lib/prisma";
import Topbar from "@/components/layout/Topbar";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/constants";

export default async function GastosPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { createdAt: "desc" },
    include: { businessUnit: true, supplier: true },
  });

  const total = expenses.reduce((s, e) => s + Number(e.total), 0);

  return (
    <div>
      <Topbar
        title="Gastos"
        actions={
          <Link href="/gastos/nuevo"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            + Nuevo gasto
          </Link>
        }
      />
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border rounded-xl px-5 py-3" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs text-gray-500">Total gastos</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(total)}</p>
          </div>
          <div className="bg-white border rounded-xl px-5 py-3" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs text-gray-500">Registros</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{expenses.length}</p>
          </div>
          <div className="bg-white border rounded-xl px-5 py-3" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs text-gray-500">Promedio por gasto</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(expenses.length > 0 ? total / expenses.length : 0)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {expenses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm">No hay gastos registrados.</p>
              <Link href="/gastos/nuevo" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
                Registrar primer gasto
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b" style={{ borderColor: "var(--border)" }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Descripción</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoría</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Suplidor</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Unidad</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-b last:border-0 hover:bg-gray-50" style={{ borderColor: "var(--border)" }}>
                    <td className="px-5 py-3 font-medium text-gray-900 max-w-[200px] truncate">{exp.description}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {EXPENSE_CATEGORY_LABELS[exp.category] ?? exp.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{exp.supplier?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{exp.businessUnit.name}</td>
                    <td className="px-5 py-3 text-gray-500">{formatDate(exp.expenseDate)}</td>
                    <td className="px-5 py-3 text-right font-medium text-red-600">
                      -{formatCurrency(Number(exp.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
