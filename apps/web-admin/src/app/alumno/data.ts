// Datos de ejemplo del simulador de la app móvil (espejo de apps/mobile/src/data).

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  level: 'INICIAL' | 'PRIMARIA' | 'SECUNDARIA';
  course: string;
  /** Texto del año actual dentro de la trayectoria. */
  yearLabel: string;
}

export const CHILDREN: Child[] = [
  { id: 'student-1', firstName: 'Mateo', lastName: 'González', level: 'INICIAL', course: 'Sala de 4 · Turno Tarde', yearLabel: 'Sala de 4' },
  { id: 'student-2', firstName: 'Sofía', lastName: 'González', level: 'PRIMARIA', course: '4° Grado "B" · Turno Mañana', yearLabel: '4° Grado' },
];

/** Umbrales de faltas: 1° reincorporación a las 10, 2° a las 20. */
export const THRESHOLDS = [10, 20];
export const nextThreshold = (faltas: number) => {
  const idx = THRESHOLDS.findIndex((t) => faltas < t);
  const i = idx === -1 ? THRESHOLDS.length - 1 : idx;
  return { value: THRESHOLDS[i], label: `${i + 1}° reincorporación` };
};

export interface PartialNote { id: string; title: string; date: string; grade: number; observation?: string }
export interface Subject {
  id: string;
  name: string;
  partials: PartialNote[];
  /** Nota de trimestre cargada por el docente (no es promedio). null = sin cargar. */
  trimester: [number | null, number | null, number | null];
}

export const SUBJECTS: Subject[] = [
  { id: 'lengua', name: 'Lengua', trimester: [8, 9, null], partials: [
    { id: 'l1', title: 'Lectura comprensiva: El zorro y la luna', date: 'Hace 2 días', grade: 9, observation: 'Excelente participación oral.' },
    { id: 'l2', title: 'Producción escrita: Cuento breve', date: '28 Oct', grade: 8 } ] },
  { id: 'matematica', name: 'Matemática', trimester: [7, 7, null], partials: [
    { id: 'm1', title: 'Fracciones y ángulos', date: 'Hace 2 días', grade: 8, observation: 'Repasar fracciones equivalentes.' },
    { id: 'm2', title: 'Problemas de proporcionalidad', date: '22 Oct', grade: 6 } ] },
  { id: 'italiano', name: 'Lengua y Cultura Italiana', trimester: [9, 10, null], partials: [
    { id: 'i1', title: 'Oral: Tradizioni e Famiglia', date: 'Ayer', grade: 9 } ] },
  { id: 'naturales', name: 'Ciencias Naturales', trimester: [8, 8, null], partials: [
    { id: 'n1', title: 'Informe: Ciclo del agua', date: '30 Oct', grade: 8 } ] },
  { id: 'sociales', name: 'Ciencias Sociales', trimester: [8, null, null], partials: [
    { id: 's1', title: 'Línea de tiempo: Inmigración', date: '20 Oct', grade: 6, observation: 'Completar las fechas faltantes.' } ] },
];

export interface AttRecord { id: string; date: string; time: string; state: string; fraction: number; justified?: boolean }
export const ATTENDANCE: Record<string, AttRecord[]> = {
  'student-1': [
    { id: 'a1', date: 'Hoy, 13 Noviembre', time: '13:10 hs', state: 'Tardanza', fraction: 0.25 },
    { id: 'a2', date: '28 Octubre', time: '13:00 hs', state: 'Presente puntual', fraction: 0, justified: true },
  ],
  'student-2': [
    { id: 'b1', date: 'Hoy, 13 Noviembre', time: '08:10 hs', state: 'Tardanza', fraction: 0.25 },
    { id: 'b2', date: '06 Noviembre', time: '—', state: 'Ausente', fraction: 1, justified: true },
    { id: 'b3', date: '15 Octubre', time: '—', state: 'Ausente', fraction: 1 },
    { id: 'b4', date: '02 Octubre', time: '11:30 hs', state: 'Retiro anticipado', fraction: 0.5 },
  ],
};

export const TODAY_CLASSES = [
  { time: '08:00', subject: 'Matemática' },
  { time: '09:20', subject: 'Lengua' },
  { time: '10:40', subject: 'Lengua y Cultura Italiana' },
];

// Trayectoria completa: Inicial (3) + Primaria (6) + Secundaria (6)
export const TRAJECTORY = [
  ...['Sala de 3', 'Sala de 4', 'Sala de 5'].map((label) => ({ level: 'Nivel Inicial', label })),
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ level: 'Nivel Primario', label: `${n}° Grado` })),
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ level: 'Nivel Secundario', label: `${n}° Año` })),
];
export const CURRENT_CYCLE = 2026;

export const ALBUMS: Record<string, { title: string; date: string; photos: number }[]> = {
  'student-1|Sala de 3': [{ title: 'Período de adaptación', date: 'Mar 2025', photos: 18 }, { title: 'Acto del 25 de Mayo', date: 'May 2025', photos: 22 }],
  'student-1|Sala de 4': [{ title: "Pintura y Símbolos: Fratelli d'Italia", date: 'Nov 2026', photos: 24 }, { title: 'Huerta Escolar Bilingüe', date: 'Nov 2026', photos: 16 }],
  'student-2|Sala de 3': [{ title: 'Primer día de jardín', date: 'Mar 2020', photos: 14 }],
  'student-2|Sala de 5': [{ title: 'Acto de egreso del jardín', date: 'Dic 2022', photos: 40 }],
  'student-2|1° Grado': [{ title: 'Primeras letras', date: 'Jun 2023', photos: 20 }],
  'student-2|3° Grado': [{ title: 'Feria de Ciencias', date: 'Sep 2025', photos: 27 }],
  'student-2|4° Grado': [
    { title: 'Torneo Intercolegial de Atletismo', date: 'Nov 2026', photos: 32 },
    { title: 'Taller de Teatro: Le Avventure di Pinocchio', date: 'Nov 2026', photos: 20 },
    { title: 'Festa della Repubblica: Cocina Italiana', date: 'Oct 2026', photos: 42 },
  ],
};
