/**
 * Calendario unificado: eventos que carga el colegio + evaluaciones que agendan los docentes.
 * Lo usan el panel (todos los roles) y la app de familias.
 */
import { ASSIGNMENTS, COURSES } from '../data/mock';
import type { Audience, DataState, EventKind } from '../data/types';
import { addDays, isoDate } from './dates';
import { audienceLabel, course, staffName, subject } from './school';

export type CalKind = EventKind | 'Evaluación';

export interface CalItem {
  id: string;
  source: 'evento' | 'evaluacion';
  title: string;
  kind: CalKind;
  date: string;
  endDate?: string;
  time?: string;
  detail?: string;
  /** A quién va dirigido, en texto ("Todo el colegio", "4° Grado B"). */
  who: string;
  /** Cursos alcanzados (todos si el evento es para todo el colegio). */
  courseIds: string[];
  createdBy?: string;
}

export const KIND_COLOR: Record<CalKind, string> = {
  Evaluación: 'red',
  Acto: 'celeste',
  Reunión: 'violet',
  Salida: 'amber',
  Institucional: 'green',
  Feriado: 'gray',
};
export const KINDS: CalKind[] = ['Evaluación', 'Acto', 'Reunión', 'Salida', 'Institucional', 'Feriado'];

function coursesOf(a: Audience): string[] {
  if (a.kind === 'TODOS') return COURSES.map((c) => c.id);
  if (a.kind === 'NIVEL') return COURSES.filter((c) => c.level === a.level).map((c) => c.id);
  return [a.courseId];
}

export function calendarItems(data: DataState): CalItem[] {
  const events: CalItem[] = data.events.map((e) => ({
    id: e.id,
    source: 'evento',
    title: e.title,
    kind: e.kind,
    date: e.date,
    endDate: e.endDate,
    time: e.time,
    detail: e.detail,
    who: audienceLabel(e.audience),
    courseIds: coursesOf(e.audience),
    createdBy: e.createdBy,
  }));
  const evals: CalItem[] = data.evaluations.map((e) => {
    const a = ASSIGNMENTS.find((x) => x.id === e.assignmentId)!;
    return {
      id: e.id,
      source: 'evaluacion',
      title: `${e.kind}: ${e.title}`,
      kind: 'Evaluación',
      date: e.date,
      who: `${course(a.courseId).name} · ${subject(a.subjectId).name}`,
      detail: `Docente: ${staffName(a.teacherId)}`,
      courseIds: [a.courseId],
    };
  });
  return [...events, ...evals].sort((x, y) => x.date.localeCompare(y.date) || (x.time ?? '').localeCompare(y.time ?? ''));
}

/** Solo lo que corresponde a ciertos cursos (los hijos de una familia, los cursos de un preceptor). */
export const forCourses = (items: CalItem[], courseIds: string[]) => items.filter((i) => i.courseIds.some((c) => courseIds.includes(c)));

export const occursOn = (i: CalItem, day: string) => day >= i.date && day <= (i.endDate ?? i.date);

/* ---------- Fechas ---------- */

export const parseDay = (iso: string) => new Date(iso + 'T12:00:00');
/** Lunes de la semana de la fecha. */
export function weekStart(d: Date): Date {
  const x = new Date(d);
  const dow = (x.getDay() + 6) % 7; // 0 = lunes
  x.setDate(x.getDate() - dow);
  return x;
}
export const weekDays = (d: Date) => Array.from({ length: 7 }, (_, i) => isoDate(addDays(weekStart(d), i)));

/** Celdas del mes (semanas completas de lunes a domingo). */
export function monthGrid(year: number, month: number): string[] {
  const first = new Date(year, month, 1, 12);
  const start = weekStart(first);
  const last = new Date(year, month + 1, 0, 12);
  const days: string[] = [];
  for (let d = start; d <= last || days.length % 7 !== 0; d = addDays(d, 1)) days.push(isoDate(d));
  return days;
}

export const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const WEEKDAYS_SHORT = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
