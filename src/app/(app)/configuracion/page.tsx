import Topbar from "@/components/layout/Topbar";
export default function Page() {
  return (
    <div>
      <Topbar title="Configuracion" />
      <div className="p-6">
        <div className="bg-white rounded-xl border p-12 text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-gray-400 text-sm">Módulo en construcción...</p>
        </div>
      </div>
    </div>
  );
}
