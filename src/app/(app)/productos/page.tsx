import { prisma } from "@/lib/prisma";
import Topbar from "@/components/layout/Topbar";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function ProductosPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <Topbar title="Productos y Servicios"
        actions={
          <Link href="/productos/nuevo"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            + Nuevo producto
          </Link>
        }
      />
      <div className="p-6">
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm">No hay productos registrados.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b" style={{ borderColor: "var(--border)" }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Código</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ITBIS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50" style={{ borderColor: "var(--border)" }}>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.code ?? "—"}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">
                      <Link href={`/productos/${p.id}`} className="hover:text-blue-600">{p.name}</Link>
                      {p.description && <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.type === "SERVICE" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {p.type === "SERVICE" ? "Servicio" : "Producto"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium">{formatCurrency(Number(p.price))}</td>
                    <td className="px-5 py-3 text-right text-gray-500">
                      {p.taxExempt ? "Exento" : `${(Number(p.taxRate) * 100).toFixed(0)}%`}
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
