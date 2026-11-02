export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tablero Institucional General
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Resumen operativo en tiempo real: asistencia, alertas médicas, seguridad en puerta y legajos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sistema en Línea
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Matrícula Activa</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">842</p>
          <p className="text-xs text-slate-500 mt-1">Jardín (120) · Primaria (380) · Secundaria (342)</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Presentismo Hoy</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">94.8%</p>
          <p className="text-xs text-slate-500 mt-1">44 ausencias · 8 tardanzas (1/4 falta)</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-xs font-semibold uppercase text-amber-700 tracking-wider">Aptos Físicos por Vencer</p>
          <p className="text-3xl font-extrabold text-amber-700 mt-2">14</p>
          <p className="text-xs text-slate-500 mt-1">Vencimiento dentro de los próximos 30 días</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
          <p className="text-xs font-semibold uppercase text-red-700 tracking-wider">Alertas Legales Activas</p>
          <p className="text-3xl font-extrabold text-red-700 mt-2">3</p>
          <p className="text-xs text-slate-500 mt-1">Restricciones de acercamiento judicial vigentes</p>
        </div>
      </div>

      {/* Operational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-3">Preceptoría — Justificaciones Pendientes</h2>
          <p className="text-sm text-slate-600 mb-4">
            Comprobantes y certificados médicos subidos por las familias desde la app móvil.
          </p>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Mateo González (Sala de 4)</p>
                <p className="text-xs text-slate-500">Certificado Pediatra (Cuadro febril 48hs)</p>
              </div>
              <a href="/asistencia" className="text-xs font-semibold text-blue-700 hover:underline">
                Revisar & Aprobar →
              </a>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Sofía González (4° Grado B)</p>
                <p className="text-xs text-slate-500">Constancia Odontológica (Tardanza)</p>
              </div>
              <a href="/asistencia" className="text-xs font-semibold text-blue-700 hover:underline">
                Revisar & Aprobar →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-3">Seguridad Física — Turno Salida (Pick-Up)</h2>
          <p className="text-sm text-slate-600 mb-4">
            Control en puerta con validación de adultos autorizados y alertas legales visibles.
          </p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900 mb-4">
            💡 La terminal de puerta permite búsqueda rápida por DNI, escaneo de credencial o foto de tutor para autorizar el egreso seguro.
          </div>
          <a
            href="/seguridad-puerta"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Abrir Terminal de Puerta (Pick-Up)
          </a>
        </div>
      </div>
    </div>
  );
}

