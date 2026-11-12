/**
 * Horario de clases de ejemplo: módulos de cada curso con materia y docente.
 * Es lo que arma el acta del día (una fila por hora) y lo que firma cada docente.
 * Se usa el mismo horario todos los días hábiles para simplificar la demo.
 */

export interface Module {
  hour: number; // 1ª, 2ª…
  start: string; // HH:MM
  end: string;
  subject: string;
  teacherName: string;
  /** Si el docente tiene usuario en el panel de demo. */
  teacherId?: string;
}

const SEC_TIMES: [string, string][] = [
  ['07:15', '07:55'], ['07:55', '08:35'], ['08:45', '09:25'], ['09:25', '10:05'], ['10:15', '10:55'],
  ['10:55', '11:35'], ['11:45', '12:25'], ['12:25', '13:05'], ['13:10', '13:50'], ['13:50', '14:30'],
];
const PRI_TIMES: [string, string][] = [
  ['07:45', '08:25'], ['08:25', '09:05'], ['09:20', '10:00'], ['10:00', '10:40'], ['10:55', '11:35'], ['11:35', '12:15'],
];
const INI_TIMES: [string, string][] = [['13:15', '14:00'], ['14:00', '14:45'], ['15:15', '16:00'], ['16:00', '16:45']];

type Slot = [subject: string, teacherName: string, teacherId?: string];

const build = (times: [string, string][], slots: Slot[]): Module[] =>
  times.map(([start, end], i) => ({ hour: i + 1, start, end, subject: slots[i][0], teacherName: slots[i][1], teacherId: slots[i][2] }));

const CARLA: Slot = ['Lengua y Cultura Italiana', 'Carla Benedetti', 'u-doc1'];
const PABLO: Slot = ['Matemática', 'Pablo Sosa', 'u-doc2'];

export const TIMETABLE: Record<string, Module[]> = {
  'c-s4': build(INI_TIMES, [
    ['Sala: rutina y juego', 'Andrea Paredes'], CARLA, ['Música', 'Lucas Ferro'], ['Sala: expresión plástica', 'Andrea Paredes'],
  ]),
  'c-4b': build(PRI_TIMES, [
    ['Prácticas del Lenguaje', 'Mónica Leiva'], ['Prácticas del Lenguaje', 'Mónica Leiva'], CARLA, CARLA,
    ['Ciencias Naturales', 'Mónica Leiva'], ['Educación Física', 'Diego Arce'],
  ]),
  'c-5b': build(PRI_TIMES, [
    PABLO, PABLO, ['Ciencias Sociales', 'Inés Villalba'], ['Prácticas del Lenguaje', 'Inés Villalba'],
    ['Lengua y Cultura Italiana', 'Giulia Moretti'], ['Música', 'Lucas Ferro'],
  ]),
  'c-1a': build(SEC_TIMES, [
    ['Físico-Química', 'Hugo Benítez'], ['Físico-Química', 'Hugo Benítez'], ['Historia', 'Paula Retamar'], ['Historia', 'Paula Retamar'],
    CARLA, CARLA, ['Artes Visuales', 'Sergio Lanza'], ['Artes Visuales', 'Sergio Lanza'], ['Inglés', 'Rocío Díaz'], ['Biología', 'Ana Zárate'],
  ]),
  'c-3a': build(SEC_TIMES, [
    ['Química', 'Hugo Benítez'], ['Química', 'Hugo Benítez'], PABLO, PABLO, ['Geografía', 'Paula Retamar'],
    ['Geografía', 'Paula Retamar'], ['Economía', 'Martín Ojeda'], ['Economía', 'Martín Ojeda'], ['Inglés', 'Rocío Díaz'], ['Inglés', 'Rocío Díaz'],
  ]),
};

export const modulesOf = (courseId: string): Module[] => TIMETABLE[courseId] ?? [];

/** Docentes de un curso (para "¿Quién sos?" al firmar). */
export function teachersOf(courseId: string): string[] {
  return [...new Set(modulesOf(courseId).map((m) => m.teacherName))];
}

export const signatureKey = (courseId: string, date: string, hour: number) => `${courseId}|${date}|${hour}`;

/** Minutos desde las 00:00 para comparar horarios "HH:MM". */
export const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
};
