/**
 * Cálculo de notas: parciales → nota del trimestre → promedio anual, por alumno y por curso.
 *
 * Reglas (editables cuando el colegio defina su reglamento):
 * - El promedio de parciales es ponderado por el peso de cada instancia (×1 o ×2).
 * - La nota del trimestre es la que carga el docente; si todavía no la cargó, se usa el promedio de parciales.
 * - El promedio anual es el promedio de las notas de los trimestres que tengan nota.
 * - Aprobado: 6 o más.
 */
import type { DataState, GradeInstance, Student } from '../data/types';
import { gradeKey, parseGrade } from './school';

export const PASS_MARK = 6;

export const partialKey = (instanceId: string, studentId: string) => `${instanceId}|${studentId}`;

export function instancesFor(data: DataState, assignmentId: string, periodId: string): GradeInstance[] {
  return data.instances
    .filter((i) => i.assignmentId === assignmentId && i.periodId === periodId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function average(values: (number | null)[]): number | null {
  const nums = values.filter((v): v is number => v !== null);
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
}

export function partialGrade(data: DataState, instanceId: string, studentId: string): number | null {
  const v = data.partials[partialKey(instanceId, studentId)]?.value;
  return v === undefined ? null : parseGrade(v);
}

/** Promedio ponderado de los parciales del alumno en el trimestre. */
export function partialAverage(data: DataState, assignmentId: string, periodId: string, studentId: string): number | null {
  let sum = 0;
  let weights = 0;
  for (const inst of instancesFor(data, assignmentId, periodId)) {
    const g = partialGrade(data, inst.id, studentId);
    if (g === null) continue;
    sum += g * inst.weight;
    weights += inst.weight;
  }
  return weights ? sum / weights : null;
}

export interface TermGrade {
  value: number | null;
  /** 'cierre': cargada por el docente · 'parciales': calculada de los parciales. */
  source: 'cierre' | 'parciales' | null;
}

export function termGrade(data: DataState, periodId: string, assignmentId: string, studentId: string): TermGrade {
  const official = data.grades[gradeKey(periodId, assignmentId, studentId)]?.value;
  const n = official !== undefined ? parseGrade(official) : null;
  if (n !== null) return { value: n, source: 'cierre' };
  const avg = partialAverage(data, assignmentId, periodId, studentId);
  return { value: avg, source: avg === null ? null : 'parciales' };
}

/** Promedio anual del alumno en una materia: promedio de sus trimestres con nota. */
export function annualAverage(data: DataState, assignmentId: string, studentId: string): number | null {
  return average(data.periods.map((p) => termGrade(data, p.id, assignmentId, studentId).value));
}

/** Promedio del curso en una materia para un trimestre (o el año, si periodId es null). */
export function courseAverage(data: DataState, assignmentId: string, students: Student[], periodId: string | null): number | null {
  return average(
    students.map((s) => (periodId ? termGrade(data, periodId, assignmentId, s.id).value : annualAverage(data, assignmentId, s.id))),
  );
}

/** Promedio del curso en una instancia parcial. */
export function instanceAverage(data: DataState, instanceId: string, students: Student[]): number | null {
  return average(students.map((s) => partialGrade(data, instanceId, s.id)));
}

/** Formato argentino: coma decimal, hasta 2 decimales. */
export function fmtNota(n: number | null): string {
  return n === null ? '—' : n.toLocaleString('es-AR', { maximumFractionDigits: 2 });
}

/** Valor sugerido para la nota del trimestre a partir del promedio (2 decimales, coma decimal). */
export const suggestion = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');

export const passClass = (n: number | null) => (n === null ? 'gray' : n >= PASS_MARK ? 'green' : 'red');
