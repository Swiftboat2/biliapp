import type { ReactElement } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './data/store';
import { Layout, NAV } from './components/Layout';
import { Login } from './pages/Login';
import { Inicio } from './pages/Inicio';
import { Asistencia } from './pages/Asistencia';
import { Justificativos } from './pages/Justificativos';
import { Calificaciones } from './pages/Calificaciones';
import { Observaciones } from './pages/Observaciones';
import { Legajos } from './pages/Legajos';
import { Retiros } from './pages/Retiros';
import { Comunicados } from './pages/Comunicados';
import { Mensajes } from './pages/Mensajes';
import { Calendario } from './pages/Calendario';
import { Supervision } from './pages/Supervision';
import { FamilySimulator } from './family/FamilySimulator';
import { Acta } from './pages/Acta';
import { CursoDocente, QrPrint } from './pages/CursoDocente';

const PAGES: Record<string, ReactElement> = {
  '/asistencia': <Asistencia />,
  '/justificativos': <Justificativos />,
  '/calificaciones': <Calificaciones />,
  '/observaciones': <Observaciones />,
  '/legajos': <Legajos />,
  '/retiros': <Retiros />,
  '/comunicados': <Comunicados />,
  '/mensajes': <Mensajes />,
  '/calendario': <Calendario />,
  '/supervision': <Supervision />,
};

export function App() {
  const { user, isFamily } = useApp();
  const { pathname } = useLocation();

  // Páginas que se abren sin entrar al panel: la del QR del aula, el acta imprimible y el QR para imprimir.
  if (/^\/(curso|acta|qr)\//.test(pathname)) {
    return (
      <Routes>
        <Route path="/curso/:courseId" element={<CursoDocente />} />
        <Route path="/acta/:courseId/:date" element={<Acta />} />
        <Route path="/qr/:courseId" element={<QrPrint />} />
      </Routes>
    );
  }
  if (isFamily) return <FamilySimulator />;
  if (!user) return <Login />;

  // Cada rol solo ve las secciones que le corresponden.
  const allowed = NAV.filter((n) => n.to !== '/' && n.roles.includes(user.role));
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        {allowed.map((n) => (
          <Route key={n.to} path={n.to.slice(1)} element={PAGES[n.to]} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
