import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Bell, ChevronLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { EducationalLevel } from '@biliapp/shared-types';
import { useApp } from '../data/store';
import { FAMILY, INSTITUTION } from '../data/mock';
import { course, findStudent } from '../lib/school';
import type { Communication, DataState, Student } from '../data/types';

export type Screen = 'inicio' | 'mensajes' | 'archivos' | 'galeria' | 'asistencia' | 'retiros';
export type Go = (s: Screen) => void;

/** Hijos de la familia de ejemplo; el primero (Mateo) en verde y la segunda (Sofía) en celeste, como en la app. */
export function useKids() {
  const { data } = useApp();
  return FAMILY.studentIds.map((id, i) => ({ s: findStudent(data, id), color: (i === 0 ? 'green' : 'celeste') as KidColor }));
}
export type KidColor = 'green' | 'celeste';
export type Kid = { s: Student; color: KidColor };

export const kidInitials = (s: Student) => `${s.firstName[0]}${s.lastName[0]}`;
export const isKinder = (s: Student) => course(s.courseId).level === EducationalLevel.INICIAL;

/** Comunicados que le llegan a la familia: todo el colegio, el nivel o el curso de alguno de sus hijos. */
export function commsFor(data: DataState, kids: Student[]): Communication[] {
  return data.communications.filter((c) => {
    if (c.audience.kind === 'TODOS') return true;
    if (c.audience.kind === 'NIVEL') {
      const level = c.audience.level;
      return kids.some((k) => course(k.courseId).level === level);
    }
    const courseId = c.audience.courseId;
    return kids.some((k) => k.courseId === courseId);
  });
}

export function pendingSignatures(data: DataState, kids: Student[]) {
  return commsFor(data, kids).filter((c) => c.requiresSignature && !data.familySigned.includes(c.id));
}

/** Ola verde superior con escudo, notificaciones y avatar de la familia. */
export function Hero({ title, context, onBack, go, children }: { title: string; context?: string; onBack?: () => void; go: Go; children?: ReactNode }) {
  const { data } = useApp();
  const kids = useKids().map((k) => k.s);
  const alerts = pendingSignatures(data, kids).length + data.threads.filter((t) => t.familyUnread && FAMILY.studentIds.includes(t.studentId)).length;
  return (
    <header className="fam-hero">
      <div className="fam-hero-top">
        <img src="/logo-colegio.png" alt="" />
        <div>
          <b>{INSTITUTION.name}</b>
          <small>{INSTITUTION.place.toUpperCase()} · CICLO {INSTITUTION.cycle}</small>
        </div>
        <div className="fam-hero-actions">
          <button className="fam-circle-btn" aria-label="Retiro seguro" onClick={() => go('retiros')}><ShieldCheck /></button>
          <button className="fam-circle-btn" aria-label={`Notificaciones${alerts ? ` (${alerts})` : ''}`} onClick={() => go(alerts && pendingSignatures(data, kids).length ? 'archivos' : 'mensajes')}>
            <Bell />
            {alerts > 0 && <span className="dot" />}
          </button>
          <span className="fam-avatar">{FAMILY.firstName[0]}{FAMILY.lastName[0]}</span>
        </div>
      </div>
      {onBack && <button className="fam-back" onClick={onBack}><ChevronLeft size={15} /> Volver</button>}
      <h2>{title}</h2>
      {context && <span className="ctx">{context}</span>}
      {children}
    </header>
  );
}

/** Selector segmentado de hijo (Mateo / Sofía). */
export function KidSwitch({ kids, value, onChange }: { kids: Kid[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="fam-seg" role="tablist" aria-label="Hijo">
      {kids.map((k) => (
        <button key={k.s.id} role="tab" aria-selected={value === k.s.id} className={`${value === k.s.id ? 'on ' : ''}${k.color}`} onClick={() => onChange(k.s.id)}>
          {k.s.firstName} · {course(k.s.courseId).name.replace(/"/g, '')}
        </button>
      ))}
    </div>
  );
}

/** Hoja inferior dentro del teléfono (reemplaza a los Modal de React Native). */
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fam-sheet-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="fam-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <span className="grab" />
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

/** Aviso tipo "Alert" de la app, dentro del teléfono. */
export function usePhoneToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const t = useRef<number | undefined>(undefined);
  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setMsg(null), 3000);
  }, []);
  useEffect(() => () => window.clearTimeout(t.current), []);
  return { show, node: msg ? <div className="fam-toast" role="status"><CheckCircle2 /> {msg}</div> : null };
}

/** Días de clase transcurridos en el ciclo, para el % de asistencia del ejemplo. */
export const SCHOOL_DAYS_SO_FAR = 160;
export const attendancePct = (faltas: number) => Math.max(0, Math.round((1 - faltas / SCHOOL_DAYS_SO_FAR) * 100));
