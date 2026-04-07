import { prisma } from "@/lib/prisma";
import Topbar from "@/components/layout/Topbar";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { INVOICE_STATUS_LABELS } from "@/lib/constants";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  PENDING: "bg-orange-100 text-orange-700",
  PARTIAL: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
};

export default async function VentasPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { contact: true, businessUnit: true },
  });

  const totals = {
    all: invoices.length,
    pending: invoices.filter((i) => ["PENDING", "PARTIAL"].includes(i.status)).length,
    paid: invoices.filter((i) => i.status === "PAID").length,
    draft: invoices.filter((i) => i.status === "DRAFT").length,
  };

  return (
    <div>
      <Topbar
        title="Facturas"
        actions={
          <Link href="/ventas/nueva"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            + Nueva factura
          </Link>
        }
      />
      <div className="p-6">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: totals.all, color: "gray" },
            { label: "Pendientes", value: totals.pending, color: "orange" },
            { label: "Pagadas", value: totals.paid, color: "green" },
            { label: "Borradores", value: totals.draft, color: "gray" },
          ].map((s) => (
            <div key={s.label} className="bg-white border rounded-xl px-5 py-3" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {invoices.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm">No hay facturas aún.</p>
              <Link href="/ventas/nueva" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
                Crear primera factura
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b" style={{ borderColor: "var(--border)" }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">N°</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Unidad</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--border)" }}>
                    <td className="px-5 py-3">
                      <Link href={`/ventas/${inv.id}`} className="font-mono text-blue-600 hover:underline text-xs">
                        {inv.number ?? inv.id.slice(0, 8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-900">{inv.contact.name}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{inv.businessUnit.name}</td>
                    <td className="px-5 py-3 text-gray-500">{formatDate(inv.issueDate)}</td>
                    <td className="px-5 py-3 text-right font-medium">{formatCurrency(Number(inv.total))}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[inv.status] ?? "bg-gray-100"}`}>
                        {INVOICE_STATUS_LABELS[inv.status] ?? inv.status}
                      </span>
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
