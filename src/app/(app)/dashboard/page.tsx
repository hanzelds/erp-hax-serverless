import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Topbar from "@/components/layout/Topbar";
import { formatCurrency } from "@/lib/utils";

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalReceivable,
    totalPayable,
    monthInvoices,
    pendingInvoices,
    recentInvoices,
    recentExpenses,
  ] = await Promise.all([
    // Cuentas por cobrar
    prisma.invoice.aggregate({
      where: { status: { in: ["APPROVED", "PENDING", "PARTIAL"] } },
      _sum: { total: true, amountPaid: true },
    }),
    // Cuentas por pagar (gastos sin conciliar)
    prisma.expense.aggregate({
      where: { createdAt: { gte: startOfMonth } },
      _sum: { total: true },
    }),
    // Ventas del mes
    prisma.invoice.aggregate({
      where: {
        status: { in: ["APPROVED", "PENDING", "PARTIAL", "PAID"] },
        issueDate: { gte: startOfMonth },
      },
      _sum: { total: true },
      _count: true,
    }),
    // Facturas pendientes
    prisma.invoice.count({
      where: { status: { in: ["PENDING", "PARTIAL"] } },
    }),
    // Últimas facturas
    prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { contact: true, businessUnit: true },
    }),
    // Últimos gastos
    prisma.expense.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { businessUnit: true },
    }),
  ]);

  const receivable =
    Number(totalReceivable._sum.total ?? 0) -
    Number(totalReceivable._sum.amountPaid ?? 0);

  return {
    receivable,
    payable: Number(totalPayable._sum.total ?? 0),
    monthSales: Number(monthInvoices._sum.total ?? 0),
    monthInvoiceCount: monthInvoices._count,
    pendingInvoices,
    recentInvoices,
    recentExpenses,
  };
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  PENDING: "bg-yellow-100 text-yellow-700",
  PARTIAL: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador", PENDING: "Pendiente", PARTIAL: "Parcial",
  PAID: "Pagada", APPROVED: "Aprobada", REJECTED: "Rechazada",
};

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardData();

  return (
    <div>
      <Topbar title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Hola, {session?.user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Aquí está el resumen de hoy.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            label="Cuentas por Cobrar"
            value={formatCurrency(data.receivable)}
            sub={`${data.pendingInvoices} facturas pendientes`}
            color="blue"
          />
          <KPICard
            label="Ventas del Mes"
            value={formatCurrency(data.monthSales)}
            sub={`${data.monthInvoiceCount} facturas emitidas`}
            color="green"
          />
          <KPICard
            label="Gastos del Mes"
            value={formatCurrency(data.payable)}
            sub="Total registrado"
            color="orange"
          />
          <KPICard
            label="Cuentas por Pagar"
            value={formatCurrency(data.payable)}
            sub="Proveedores"
            color="red"
          />
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent invoices */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-sm">Facturas recientes</h3>
              <a href="/ventas" className="text-xs text-blue-600 hover:underline">Ver todas</a>
            </div>
            {data.recentInvoices.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No hay facturas aún</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b" style={{ borderColor: "var(--border)" }}>
                    <th className="text-left pb-2 font-medium">Cliente</th>
                    <th className="text-left pb-2 font-medium">Unidad</th>
                    <th className="text-right pb-2 font-medium">Total</th>
                    <th className="text-right pb-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentInvoices.map((inv) => (
                    <tr key={inv.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                      <td className="py-2.5 text-gray-800">{inv.contact.name}</td>
                      <td className="py-2.5 text-gray-500 text-xs">{inv.businessUnit.name}</td>
                      <td className="py-2.5 text-right font-medium">{formatCurrency(Number(inv.total))}</td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[inv.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {STATUS_LABELS[inv.status] ?? inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent expenses */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-sm">Gastos recientes</h3>
              <a href="/gastos" className="text-xs text-blue-600 hover:underline">Ver todos</a>
            </div>
            {data.recentExpenses.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No hay gastos aún</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b" style={{ borderColor: "var(--border)" }}>
                    <th className="text-left pb-2 font-medium">Descripción</th>
                    <th className="text-left pb-2 font-medium">Unidad</th>
                    <th className="text-right pb-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentExpenses.map((exp) => (
                    <tr key={exp.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                      <td className="py-2.5 text-gray-800 max-w-[160px] truncate">{exp.description}</td>
                      <td className="py-2.5 text-gray-500 text-xs">{exp.businessUnit.name}</td>
                      <td className="py-2.5 text-right font-medium text-red-600">
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
    </div>
  );
}

function KPICard({
  label, value, sub, color,
}: {
  label: string; value: string; sub: string; color: "blue" | "green" | "orange" | "red";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="bg-white rounded-xl border p-5" style={{ borderColor: "var(--border)" }}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      <p className={`text-xs mt-1 font-medium px-2 py-0.5 rounded-full inline-block ${colors[color]}`}>
        {sub}
      </p>
    </div>
  );
}
