/**
 * Arma el acta del día: quién falta en cada hora según ausencias, tardanzas y retiros.
 * - Ausente: falta todas las horas.
 * - Tarde: falta las horas que empezaron antes de que llegue (sin hora cargada, solo la 1ª).
 * - Retiro: falta desde que se fue; si vuelve con hora, hasta que regresa;
 *   si vuelve sin hora, solo la hora en que se retiró.
 */
import type { AttendanceSheet, DataState, Mark, MarkDetail, Student } from '../data/types';
import { modulesOf, toMin, type Module } from '../data/timetable';
import { sheetKey } from './school';

export interface ModuleAbsence {
  s: Student;
  mark: Mark;
  detail: MarkDetail;
}

export function absentInModule(sheet: AttendanceSheet | undefined, students: Student[], m: Module): ModuleAbsence[] {
  if (!sheet) return [];
  const out: ModuleAbsence[] = [];
  const start = toMin(m.start);
  const end = toMin(m.end);
  for (const s of students) {
    const mark = sheet.marks[s.id];
    if (!mark || mark === 'P') continue;
    const detail = sheet.details?.[s.id] ?? {};
    let absent = false;
    if (mark === 'A') absent = true;
    else if (mark === 'T') absent = detail.time ? toMin(detail.time) > start : m.hour === 1;
    else if (mark === 'R' && detail.time) {
      const leave = toMin(detail.time);
      if (!detail.returns) absent = leave < end;
      else if (detail.returnTime) absent = leave < end && toMin(detail.returnTime) > start;
      else absent = leave >= start && leave < end;
    }
    if (absent) out.push({ s, mark, detail });
  }
  return out;
}

export function dayActa(data: DataState, courseId: string, date: string) {
  const sheet = data.attendance[sheetKey(courseId, date)];
  const students = data.students.filter((s) => s.courseId === courseId).sort((a, b) => a.lastName.localeCompare(b.lastName, 'es'));
  const rows = modulesOf(courseId).map((m) => ({
    m,
    signature: data.signatures[`${courseId}|${date}|${m.hour}`],
    absent: absentInModule(sheet, students, m),
  }));
  const marks = sheet ? Object.values(sheet.marks) : [];
  const count = (k: Mark) => marks.filter((x) => x === k).length;
  return {
    sheet,
    students,
    rows,
    totals: { total: students.length, present: sheet ? students.length - count('A') : 0, absent: count('A'), late: count('T'), early: count('R') },
    signed: rows.filter((r) => r.signature).length,
  };
}

export const MARK_SHORT: Record<Mark, string> = { P: 'Presente', A: 'Ausente', T: 'Tarde', R: 'Retiro' };

/** "Rossi, N." */
export const shortName = (s: Student) => `${s.lastName}, ${s.firstName[0]}.`;

/** Texto de la marca con horario, para listas y el acta. */
export function markText(mark: Mark, d: MarkDetail): string {
  if (mark === 'T') return d.time ? `Tarde, llegó ${d.time}` : 'Tarde';
  if (mark === 'R') return `Retiro${d.time ? ` ${d.time}` : ''}${d.returns ? (d.returnTime ? `, volvió ${d.returnTime}` : ', vuelve') : ', no vuelve'}`;
  return MARK_SHORT[mark];
}
