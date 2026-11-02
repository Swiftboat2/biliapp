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
      <body className="min-h-screen flex flex-col bg-slate-50">
        <header className="border-b bg-white border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo-colegio.png"
                alt="Escudo Instituto República de Italia"
                className="h-10 w-10 rounded-full object-contain"
              />
              <div>
                <span className="font-bold text-slate-900 text-base tracking-tight">
                  Instituto República de Italia
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold ml-2 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Entre Ríos
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="/" className="hover:text-emerald-700 transition-colors">Tablero</a>
              <a href="/asistencia" className="hover:text-emerald-700 transition-colors">Preceptoría & Asistencia</a>
              <a href="/seguridad-puerta" className="hover:text-emerald-700 transition-colors">Validación Puerta</a>
              <a href="/legajos" className="hover:text-emerald-700 transition-colors">Legajos</a>
            </nav>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500">Ciclo Lectivo 2026</span>
              <div className="h-8 w-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                DIR
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
