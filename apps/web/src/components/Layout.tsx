import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { UserRole } from '@biliapp/shared-types';
import {
  Home, CheckSquare, FileCheck2, Award, FolderOpen, ShieldCheck, Bell, MessageCircle, CalendarDays,
  NotebookPen, Eye, LogOut, Menu, RotateCcw, Smartphone, FileText,
} from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { initials, pendingJustifications, todaysEventualPickups } from '../lib/school';
import { visibleStudents } from '../lib/scope';
import { FAMILY, INSTITUTION } from '../data/mock';
import type { StaffRole } from '../data/types';

export interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  roles: StaffRole[];
}

const D = UserRole.DIRECTIVO;
const P = UserRole.PRECEPTOR;
const T = UserRole.DOCENTE;

export const NAV: NavItem[] = [
  { to: '/', label: 'Inicio', icon: Home, roles: [D, P, T] },
  { to: '/asistencia', label: 'Asistencia', icon: CheckSquare, roles: [D, P, T] },
  { to: '/justificativos', label: 'Justificativos', icon: FileCheck2, roles: [D, P] },
  { to: '/calificaciones', label: 'Calificaciones', icon: Award, roles: [D, T] },
  { to: '/observaciones', label: 'Observaciones', icon: NotebookPen, roles: [D, T] },
  { to: '/legajos', label: 'Legajos y salud', icon: FolderOpen, roles: [D, P] },
  { to: '/retiros', label: 'Retiros', icon: ShieldCheck, roles: [D, P] },
  { to: '/comunicados', label: 'Comunicados', icon: Bell, roles: [D, P] },
  { to: '/mensajes', label: 'Mensajes', icon: MessageCircle, roles: [P, T] },
  { to: '/calendario', label: 'Calendario', icon: CalendarDays, roles: [D, P, T] },
  { to: '/supervision', label: 'Supervisión', icon: Eye, roles: [D] },
];

export const ROLE_LABEL: Record<StaffRole, string> = {
  [UserRole.DIRECTIVO]: 'Dirección',
  [UserRole.PRECEPTOR]: 'Preceptoría',
  [UserRole.DOCENTE]: 'Docente',
};

export function Layout() {
  const { data, signIn, signOut, resetDemo } = useApp();
  const user = useUser();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const mine = visibleStudents(user, data);
  const counts: Record<string, number> = {
    '/justificativos': pendingJustifications(data, mine).length,
    '/mensajes': data.threads.filter((t) => t.staffId === user.id && t.unread).length,
    '/retiros': todaysEventualPickups(mine).length,
  };

  const name = `${user.firstName} ${user.lastName}`;
  const items = NAV.filter((n) => n.roles.includes(user.role));

  return (
    <div className="shell">
      <div className="topbar">
        <button className="side-btn" aria-label="Abrir menú" onClick={() => setOpen(true)} style={{ padding: 4 }}>
          <Menu />
        </button>
        <img src="/logo-colegio.png" alt="" />
        <b>Panel Institucional</b>
      </div>

      <aside className={`sidebar${open ? ' open' : ''}`} onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}>
        <div className="brand">
          <img src="/logo-colegio.png" alt="Escudo del Instituto República de Italia" />
          <div>
            <b>{INSTITUTION.name}</b>
            <small>PANEL · {ROLE_LABEL[user.role].toUpperCase()}</small>
          </div>
        </div>
        <span className="nav-label">MENÚ</span>
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Icon size={18} strokeWidth={2.2} />
            {label}
            {counts[to] ? <span className="count">{counts[to]}</span> : null}
          </NavLink>
        ))}
        <div className="sidebar-foot">
          <div className="me">
            <span className="avatar">{initials(name)}</span>
            <div style={{ minWidth: 0 }}>
              <b>{name}</b>
              <small>{user.title}</small>
            </div>
          </div>
          <a className="side-btn" href="/propuesta/">
            <FileText size={15} /> Ver la propuesta
          </a>
          <button className="side-btn" onClick={() => signIn(FAMILY.id)}>
            <Smartphone size={15} /> Ver la app de familias
          </button>
          <button className="side-btn" onClick={() => { if (window.confirm('¿Volver a los datos de ejemplo iniciales?')) resetDemo(); }}>
            <RotateCcw size={15} /> Restablecer datos de ejemplo
          </button>
          <button className="side-btn" onClick={signOut}>
            <LogOut size={15} /> Cambiar de usuario
          </button>
        </div>
      </aside>

      <main className="main" key={location.pathname}>
        <Outlet />
      </main>
    </div>
  );
}
