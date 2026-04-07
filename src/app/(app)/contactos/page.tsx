import { prisma } from "@/lib/prisma";
import Topbar from "@/components/layout/Topbar";
import Link from "next/link";

export default async function ContactosPage() {
  const contacts = await prisma.contact.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { invoices: true } } },
  });

  const clients = contacts.filter((c) => c.type === "CLIENT" || c.type === "BOTH");
  const suppliers = contacts.filter((c) => c.type === "SUPPLIER" || c.type === "BOTH");

  return (
    <div>
      <Topbar
        title="Contactos"
        actions={
          <Link href="/contactos/nuevo"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            + Nuevo contacto
          </Link>
        }
      />
      <div className="p-6">
        {/* Tabs summary */}
        <div className="flex gap-4 mb-6">
          <div className="bg-white border rounded-xl px-5 py-3 flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
            <span className="text-2xl font-bold text-gray-900">{clients.length}</span>
            <span className="text-sm text-gray-500">Clientes</span>
          </div>
          <div className="bg-white border rounded-xl px-5 py-3 flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
            <span className="text-2xl font-bold text-gray-900">{suppliers.length}</span>
            <span className="text-sm text-gray-500">Suplidores</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {contacts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm">No hay contactos aún.</p>
              <Link href="/contactos/nuevo" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
                Crear primer contacto
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b" style={{ borderColor: "var(--border)" }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">RNC/Cédula</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Facturas</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--border)" }}>
                    <td className="px-5 py-3">
                      <Link href={`/contactos/${c.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {c.name}
                      </Link>
                      {c.businessName && <p className="text-xs text-gray-400">{c.businessName}</p>}
                    </td>
                    <td className="px-5 py-3 text-gray-500">{c.rnc || c.cedula || "—"}</td>
                    <td className="px-5 py-3 text-gray-500">{c.email || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.type === "CLIENT" ? "bg-blue-100 text-blue-700" :
                        c.type === "SUPPLIER" ? "bg-orange-100 text-orange-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {c.type === "CLIENT" ? "Cliente" : c.type === "SUPPLIER" ? "Suplidor" : "Ambos"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-500">{c._count.invoices}</td>
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
