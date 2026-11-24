// Datos de ejemplo de la vista Alumno (se reemplazan por la API).

export type Concept = 'Muy Bueno' | 'Bueno' | 'Regular' | 'En proceso';

export interface PartialNote {
  id: string;
  title: string;
  date: string;
  concept: Concept;
  observation?: string;
}

export interface SubjectGrades {
  id: string;
  name: string;
  /** Notas parciales: siempre de concepto. */
  partials: PartialNote[];
  /** Nota de trimestre: la carga el docente (no es promedio). null = todavía no cargada. */
  trimester: { 1: number | null; 2: number | null; 3: number | null };
}

export const studentSubjects: SubjectGrades[] = [
  {
    id: 'lengua',
    name: 'Lengua',
    partials: [
      { id: 'l1', title: 'Lectura comprensiva: El zorro y la luna', date: 'Hace 2 días', concept: 'Muy Bueno', observation: 'Excelente participación oral.' },
      { id: 'l2', title: 'Producción escrita: Cuento breve', date: '28 Oct', concept: 'Bueno' },
    ],
    trimester: { 1: 8, 2: 9, 3: null },
  },
  {
    id: 'matematica',
    name: 'Matemática',
    partials: [
      { id: 'm1', title: 'Fracciones y ángulos', date: 'Hace 2 días', concept: 'Bueno', observation: 'Repasar fracciones equivalentes.' },
      { id: 'm2', title: 'Problemas de proporcionalidad', date: '22 Oct', concept: 'En proceso' },
    ],
    trimester: { 1: 7, 2: 7, 3: null },
  },
  {
    id: 'italiano',
    name: 'Lengua y Cultura Italiana',
    partials: [
      { id: 'i1', title: 'Oral: Tradizioni e Famiglia', date: 'Ayer', concept: 'Muy Bueno' },
    ],
    trimester: { 1: 9, 2: 10, 3: null },
  },
  {
    id: 'naturales',
    name: 'Ciencias Naturales',
    partials: [
      { id: 'n1', title: 'Informe: Ciclo del agua', date: '30 Oct', concept: 'Bueno' },
    ],
    trimester: { 1: 8, 2: 8, 3: null },
  },
  {
    id: 'sociales',
    name: 'Ciencias Sociales',
    partials: [
      { id: 's1', title: 'Línea de tiempo: Inmigración', date: '20 Oct', concept: 'Regular', observation: 'Completar las fechas faltantes.' },
    ],
    trimester: { 1: 8, 2: null, 3: null },
  },
];

export interface StudentAttendanceRecord {
  id: string;
  date: string;
  time: string;
  state: string;
  fraction: number;
  justified: 'APPROVED' | 'PENDING' | 'NOT_APPLICABLE';
}

export const studentAttendance: StudentAttendanceRecord[] = [
  { id: 'a1', date: 'Hoy, 13 Noviembre', time: '08:10 hs', state: 'Tardanza', fraction: 0.25, justified: 'NOT_APPLICABLE' },
  { id: 'a2', date: '06 Noviembre', time: '—', state: 'Ausente', fraction: 1, justified: 'APPROVED' },
  { id: 'a3', date: '15 Octubre', time: '—', state: 'Ausente', fraction: 1, justified: 'NOT_APPLICABLE' },
  { id: 'a4', date: '02 Octubre', time: '11:30 hs', state: 'Retiro anticipado', fraction: 0.5, justified: 'NOT_APPLICABLE' },
];

export const studentSchedulePreview = [
  { time: '08:00', subject: 'Matemática' },
  { time: '09:20', subject: 'Lengua' },
  { time: '10:40', subject: 'Lengua y Cultura Italiana' },
];
