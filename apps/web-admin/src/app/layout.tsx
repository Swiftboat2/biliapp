import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Instituto República de Italia — Panel Institucional',
  description: 'Sistema Integral de Gestión Escolar y Seguridad — Entre Ríos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <header className="border-b bg-white border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-extrabold text-sm shadow-xs border border-emerald-600">
                IRI
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-base tracking-tight block leading-tight">
                  Instituto República de Italia
                </span>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider inline-block">
                  Entre Ríos · Ciclo 2026
                </span>
              </div>
            </div>

            {/* Selector de Rol / Vistas */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-sm font-semibold">
              <a
                href="/direccion"
                className="px-3.5 py-1.5 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-white transition-all shadow-none hover:shadow-xs flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Dirección
              </a>
              <a
                href="/preceptor"
                className="px-3.5 py-1.5 rounded-lg text-slate-700 hover:text-blue-800 hover:bg-white transition-all shadow-none hover:shadow-xs flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Preceptoría
              </a>
              <a
                href="/docente"
                className="px-3.5 py-1.5 rounded-lg text-slate-700 hover:text-amber-800 hover:bg-white transition-all shadow-none hover:shadow-xs flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                Docente
              </a>
              <span className="h-4 w-px bg-slate-300 mx-1"></span>
              <a
                href="/seguridad-puerta"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all text-xs"
              >
                Puerta QR
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">Panel Integral</p>
                <p className="text-[11px] text-emerald-700 font-medium">En línea</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-black shadow-xs ring-2 ring-slate-100">
                WEB
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
