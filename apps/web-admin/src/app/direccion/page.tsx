import React from 'react';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

export default function DireccionDashboard() {
  return (
    <div className="space-y-6">
      {/* Header institucional de Dirección */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
                Módulo Directivo
              </span>
              <span className="text-xs text-emerald-200">Ciclo Lectivo 2026 · Entre Ríos</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Tablero General de Conducción y Gestión
            </h1>
            <p className="text-sm text-emerald-100/90 mt-1 max-w-2xl">
              Supervisión de presentismo institucional, gobierno escolar, autorizaciones legales de salidas y alertas sanitarias en tiempo real.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 text-white text-xs font-semibold backdrop-blur-xs border border-white/15">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Corte operativo: Hoy 09:30 hs
            </span>
          </div>
        </div>
      </div>

      {/* Métricas Principales (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Matrícula General</span>
              <Users className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">842</p>
            <p className="text-xs text-slate-500 mt-1">Estudiantes matriculados activos</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>Jardín: <strong>120</strong></span>
            <span>Primaria: <strong>380</strong></span>
            <span>Secundaria: <strong>342</strong></span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Presentismo Global</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-emerald-600 tracking-tight">95.2%</p>
            <p className="text-xs text-slate-500 mt-1">802 presentes en la institución</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>Ausencias: <strong className="text-red-600">32</strong></span>
            <span>Tardanzas (1/4): <strong className="text-amber-600">8</strong></span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs border-l-4 border-l-amber-500 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-amber-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Aptos Médicos</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-amber-700 tracking-tight">14</p>
            <p className="text-xs text-slate-500 mt-1">Certificados por vencer en 30 días</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-800 font-semibold flex items-center justify-between">
            <span>Reclamar a familias</span>
            <span>Acción preventiva ›</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs border-l-4 border-l-red-600 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-red-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Alertas Legales / Puerta</span>
              <ShieldAlert className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-3xl font-black text-red-600 tracking-tight">3</p>
            <p className="text-xs text-slate-500 mt-1">Restricciones de acercamiento judicial</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-red-700 font-bold flex items-center justify-between">
            <span>Protocolo de guardia activo</span>
            <span>Ver detalle ›</span>
          </div>
        </div>
      </div>

      {/* Contenido Operativo de Dirección */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Salidas Didácticas / Autorizaciones pendientes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                Autorizaciones Pendientes de Firma Directiva
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Salidas escolares y eventos que requieren aval formal del equipo de conducción
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200">
              2 pendientes
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                    Primaria · 4° Grado
                  </span>
                  <span className="text-xs text-slate-400">Vence: 10 Noviembre</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Visita Educativa al Museo Provincial de Bellas Artes
                </h3>
                <p className="text-xs text-slate-600">
                  Solicitante: Prof. Lucía Gómez · 42/45 padres ya firmaron digitalmente en App
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs">
                  Aprobar Salida
                </button>
                <button className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors">
                  Ver Plan
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    Nivel Inicial · Sala de 4
                  </span>
                  <span className="text-xs text-slate-400">Vence: 14 Noviembre</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Taller de Huerta y Vida en la Naturaleza (Parque Escolar)
                </h3>
                <p className="text-xs text-slate-600">
                  Solicitante: Seño Valeria Ramos · 28/30 consentimientos registrados
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs">
                  Aprobar Salida
                </button>
                <button className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors">
                  Ver Plan
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <a href="/circulares" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
              Emitir nueva Circular Oficial para Familias <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Columna Derecha: Alertas de Guardia y Protocolos Legales */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-slate-700" />
              Guardia y Retiros Restringidos
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Protocolos de seguridad en portería escolar
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-200 text-red-900 px-2 py-0.5 rounded">
                  Restricción Judicial
                </span>
                <span className="text-[11px] font-medium text-slate-500">Juzgado Familia N° 2</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Legajo #4812 — Alumno: Sala de 5
              </p>
              <p className="text-[11px] text-red-800 leading-tight">
                Autorizado retiro exclusivamente a la madre (Dra. Fernández). Alerta roja en QR Puerta ante cualquier intento de tercero.
              </p>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  Alerta Médica Urgente
                </span>
                <span className="text-[11px] font-medium text-slate-500">Gabinete / Enfermería</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                Legajo #3920 — Alumno: 3° Grado A
              </p>
              <p className="text-[11px] text-amber-900 leading-tight">
                Alergia severa a frutos secos con protocolo de EpiPen en botiquín de preceptoría.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="/seguridad-puerta"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Abrir Monitor de Puerta en Vivo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

