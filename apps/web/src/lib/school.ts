import { EducationalLevel, SchoolShift } from '@biliapp/shared-types';
import { ASSIGNMENTS, COURSES, FAMILY, STAFF, SUBJECTS } from '../data/mock';
import type { Audience, DataState, Mark, Student } from '../data/types';
import { todayISO } from './dates';

/** Valor de cada marca en faltas, según reglamento. */
export const MARK_VALUE: Record<Mark, number> = { P: 0, A: 1, T: 0.25, R: 0.5 };
export const MARK_LABEL: Record<Mark, string> = { P: 'Presente', A: 'Ausente', T: 'Tarde', R: 'Retiro anticipado' };

/** Límites reglamentarios que disparan aviso a familia y Dirección. */
export const THRESHOLDS = [10, 15, 20];

export function fmtFaltas(n: number): string {
  const whole = Math.floor(n);
  const frac = n - whole;
  const sym = frac === 0.25 ? '¼' : frac === 0.5 ? '½' : frac === 0.75 ? '¾' : '';
  if (whole === 0 && sym) return sym;
  return `${whole}${sym}`;
}

export const sheetKey = (courseId: string, date: string, subjectId?: string) => `${courseId}|${date}|${subjectId ?? 'diaria'}`;

/** Faltas totales: las acumuladas + las de las planillas diarias cargadas en el panel. */
export function totalAbsences(student: Student, state: DataState): number {
  let total = student.absences;
  for (const sheet of Object.values(state.attendance)) {
    if (sheet.subjectId || sheet.courseId !== student.courseId) continue;
    const m = sheet.marks[student.id];
    if (m) total += MARK_VALUE[m];
  }
  return total;
}

/** Último límite alcanzado (10, 15 o 20), o null. */
export function thresholdReached(total: number): number | null {
  const hit = THRESHOLDS.filter((t) => total >= t);
  return hit.length ? hit[hit.length - 1] : null;
}

export const course = (id: string) => COURSES.find((c) => c.id === id)!;
export const subject = (id: string) => SUBJECTS.find((s) => s.id === id)!;
export const staff = (id: string) => STAFF.find((s) => s.id === id);
export const staffName = (id: string) => {
  if (id === FAMILY.id) return `${FAMILY.firstName} ${FAMILY.lastName} (familia)`;
  const s = staff(id);
  return s ? `${s.firstName} ${s.lastName}` : 'Personal';
};
export const assignment = (id: string) => ASSIGNMENTS.find((a) => a.id === id)!;
export const fullName = (s: Student) => `${s.lastName}, ${s.firstName}`;
export const displayName = (s: Student) => `${s.firstName} ${s.lastName}`;

export const LEVEL_LABEL: Record<EducationalLevel, string> = {
  [EducationalLevel.INICIAL]: 'Nivel Inicial',
  [EducationalLevel.PRIMARIA]: 'Primaria',
  [EducationalLevel.SECUNDARIA]: 'Secundaria',
};

export const SHIFT_LABEL: Record<SchoolShift, string> = {
  [SchoolShift.MANANA]: 'Turno Mañana',
  [SchoolShift.TARDE]: 'Turno Tarde',
  [SchoolShift.DOBLE]: 'Doble turno',
  [SchoolShift.CONTRATURNO]: 'Contraturno',
};

/** Escala por nivel: Jardín cualitativa, Primaria y Secundaria numérica 1–10. */
export const isQualitative = (level: EducationalLevel) => level === EducationalLevel.INICIAL;

export function conceptFor(value: number): string {
  if (value >= 9.75) return 'Sobresaliente';
  if (value >= 9) return 'Distinguido';
  if (value >= 7) return 'Muy bueno';
  if (value >= 6) return 'Bueno';
  return 'En proceso';
}

export function parseGrade(v: string): number | null {
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) && n >= 1 && n <= 10 ? n : null;
}

export function audienceLabel(a: Audience): string {
  if (a.kind === 'TODOS') return 'Todo el colegio';
  if (a.kind === 'NIVEL') return LEVEL_LABEL[a.level];
  return course(a.courseId).name;
}

/** Familias destinatarias (una por alumno, aproximado para el ejemplo). */
export function audienceSize(a: Audience, students: Student[]): number {
  if (a.kind === 'TODOS') return students.length;
  if (a.kind === 'NIVEL') return students.filter((s) => course(s.courseId).level === a.level).length;
  return students.filter((s) => s.courseId === a.courseId).length;
}

/* ---------- Selectores compartidos ---------- */

export const gradeKey = (periodId: string, assignmentId: string, studentId: string) => `${periodId}|${assignmentId}|${studentId}`;

/** Alumnos de una clase con nota cargada en el período. */
export const gradesLoaded = (data: DataState, periodId: string, assignmentId: string, students: Student[]) =>
  students.filter((s) => data.grades[gradeKey(periodId, assignmentId, s.id)]).length;

/** Planillas (materia × curso) con todas las notas del período cargadas. */
export function gradeProgress(data: DataState, periodId: string, teacherId?: string) {
  const list = teacherId ? ASSIGNMENTS.filter((a) => a.teacherId === teacherId) : ASSIGNMENTS;
  let done = 0;
  for (const a of list) {
    const st = data.students.filter((s) => s.courseId === a.courseId);
    if (st.length && gradesLoaded(data, periodId, a.id, st) === st.length) done++;
  }
  return { done, total: list.length };
}

export const findStudent = (data: DataState, id: string): Student => data.students.find((s) => s.id === id)!;

export const studentInitials = (s: Student) => initials(displayName(s));

/** Alergias y condiciones (y opcionalmente medicación) en texto, para alertas de salud. */
export function healthItems(s: Student, withMedication = false): string[] {
  return [...s.health.allergies.map((a) => `Alergia: ${a}`), ...s.health.conditions, ...(withMedication ? s.health.medication : [])];
}
export const hasHealthCondition = (s: Student) => s.health.allergies.length + s.health.conditions.length > 0;

/** Permisos de retiro eventuales cargados por las familias para hoy. */
export function todaysEventualPickups(students: Student[]) {
  const today = todayISO();
  return students.flatMap((s) => s.pickup.filter((p) => !p.permanent && p.validOn === today).map((p) => ({ s, p })));
}

/** Justificativos pendientes; si se pasan alumnos, solo los de esos alumnos. */
export function pendingJustifications(data: DataState, students?: Student[]) {
  const ids = students && new Set(students.map((s) => s.id));
  return data.justifications.filter((j) => j.status === 'PENDIENTE' && (!ids || ids.has(j.studentId)));
}

/** Asistencia diaria de un curso en una fecha: planilla y conteos. */
export function dayStats(data: DataState, courseId: string, date = todayISO()) {
  const sheet = data.attendance[sheetKey(courseId, date)];
  const total = data.students.filter((s) => s.courseId === courseId).length;
  const marks = sheet ? Object.values(sheet.marks) : [];
  const count = (m: Mark) => marks.filter((x) => x === m).length;
  return { course: course(courseId), sheet, total, present: total - count('A'), absent: count('A'), late: count('T'), early: count('R') };
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}
