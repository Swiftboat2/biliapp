/**
 * Datos de ejemplo del panel institucional.
 * Igual que la app mobile, el panel arranca con datos de muestra en el cliente.
 * Cuando el API tenga los endpoints del personal, reemplazar este módulo por llamadas reales.
 */
import { EducationalLevel, SchoolShift, UserRole } from '@biliapp/shared-types';
import type {
  Assignment, Communication, Course, DataState, Evaluation, GradeInstance, GradingPeriod, Justification,
  Mark, Observation, StaffUser, Student, Subject, Thread,
} from './types';
import { addDays, isoDate, todayISO } from '../lib/dates';

export const INSTITUTION = {
  name: 'Instituto República de Italia',
  place: 'Entre Ríos',
  cycle: 2026,
};

/** Familia de ejemplo para el simulador de la app (Laura López, mamá de Mateo y Sofía). */
export const FAMILY = { id: 'u-fam', firstName: 'Laura', lastName: 'López', studentIds: ['st-c-s4-0', 'st-c-4b-3'] };

export const STAFF: StaffUser[] = [
  { id: 'u-dir', firstName: 'Graciela', lastName: 'Fontana', role: UserRole.DIRECTIVO, title: 'Directora general' },
  { id: 'u-pre1', firstName: 'Martín', lastName: 'Acosta', role: UserRole.PRECEPTOR, title: 'Preceptor · Primaria', courseIds: ['c-4b', 'c-5b'] },
  { id: 'u-pre2', firstName: 'Silvia', lastName: 'Romero', role: UserRole.PRECEPTOR, title: 'Preceptora · Inicial y Secundaria', courseIds: ['c-s4', 'c-1a', 'c-3a'] },
  { id: 'u-doc1', firstName: 'Carla', lastName: 'Benedetti', role: UserRole.DOCENTE, title: 'Lengua y Cultura Italiana' },
  { id: 'u-doc2', firstName: 'Pablo', lastName: 'Sosa', role: UserRole.DOCENTE, title: 'Matemática' },
];

export const COURSES: Course[] = [
  { id: 'c-s4', name: 'Sala de 4', level: EducationalLevel.INICIAL, shift: SchoolShift.TARDE, preceptorId: 'u-pre2' },
  { id: 'c-4b', name: '4° Grado "B"', level: EducationalLevel.PRIMARIA, shift: SchoolShift.MANANA, preceptorId: 'u-pre1' },
  { id: 'c-5b', name: '5° Grado "B"', level: EducationalLevel.PRIMARIA, shift: SchoolShift.MANANA, preceptorId: 'u-pre1' },
  { id: 'c-1a', name: '1° Año "A"', level: EducationalLevel.SECUNDARIA, shift: SchoolShift.MANANA, preceptorId: 'u-pre2' },
  { id: 'c-3a', name: '3° Año "A"', level: EducationalLevel.SECUNDARIA, shift: SchoolShift.MANANA, preceptorId: 'u-pre2' },
];

export const SUBJECTS: Subject[] = [
  { id: 's-ita', name: 'Lengua y Cultura Italiana' },
  { id: 's-mat', name: 'Matemática' },
  { id: 's-ef', name: 'Educación Física (contraturno)' },
];

export const ASSIGNMENTS: Assignment[] = [
  { id: 'a-1', teacherId: 'u-doc1', subjectId: 's-ita', courseId: 'c-s4', schedule: 'Lun y Mié · 14:00' },
  { id: 'a-2', teacherId: 'u-doc1', subjectId: 's-ita', courseId: 'c-4b', schedule: 'Mar y Jue · 08:00' },
  { id: 'a-3', teacherId: 'u-doc1', subjectId: 's-ita', courseId: 'c-1a', schedule: 'Lun, Mié y Vie · 10:20' },
  { id: 'a-4', teacherId: 'u-doc2', subjectId: 's-mat', courseId: 'c-5b', schedule: 'Todos los días · 07:45' },
  { id: 'a-5', teacherId: 'u-doc2', subjectId: 's-mat', courseId: 'c-3a', schedule: 'Lun a Jue · 09:30' },
];

const NAMES: Record<string, [string, string][]> = {
  'c-s4': [['Mateo', 'López'], ['Emma', 'Ferreyra'], ['Benjamín', 'Ojeda'], ['Olivia', 'Medina'], ['Thiago', 'Godoy'], ['Mía', 'Correa'], ['Lorenzo', 'Vera'], ['Catalina', 'Ríos']],
  'c-4b': [['Tomás', 'Álvarez'], ['Lucía', 'Benítez'], ['Bruno', 'Duarte'], ['Sofía', 'López'], ['Valentina', 'Paz'], ['Joaquín', 'Ruiz'], ['Martina', 'Silva'], ['Felipe', 'Torres'], ['Isabella', 'Quiroga']],
  'c-5b': [['Agustín', 'Molina'], ['Julieta', 'Cabrera'], ['Santino', 'Herrera'], ['Abril', 'Domínguez'], ['Lautaro', 'Ponce'], ['Renata', 'Aguirre'], ['Facundo', 'Navarro'], ['Delfina', 'Sánchez']],
  'c-1a': [['Ignacio', 'Gómez'], ['Camila', 'Peralta'], ['Nicolás', 'Rossi'], ['Victoria', 'Bianchi'], ['Franco', 'Moreno'], ['Malena', 'Castro'], ['Bautista', 'Ferrari'], ['Juana', 'Luna'], ['Dante', 'Rinaldi']],
  'c-3a': [['Máximo', 'Giménez'], ['Pilar', 'Ortiz'], ['Ramiro', 'Costa'], ['Ana', 'Marino'], ['Gael', 'Suárez'], ['Lola', 'Romano'], ['Simón', 'Ibarra'], ['Zoe', 'Colombo']],
};

// Faltas previas variadas; los casos al límite se fijan más abajo (Bruno, Máximo, Lucía).
const ABSENCES = [3, 4.25, 2.5, 1, 4, 2, 6.5, 0.5, 7, 3, 0, 5.75, 2.25, 8, 1.5, 9.5];

function buildStudents(): Student[] {
  const today = todayISO();
  const list: Student[] = [];
  let n = 0;
  for (const [courseId, names] of Object.entries(NAMES)) {
    names.forEach(([firstName, lastName], i) => {
      const id = `st-${courseId}-${i}`;
      const guardianFirst = ['Laura', 'Diego', 'Paola', 'Hernán', 'Marcela', 'Javier', 'Carolina', 'Gustavo'][n % 8];
      const s: Student = {
        id,
        firstName,
        lastName,
        dni: String(54_100_000 + n * 7_919).replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        courseId,
        absences: ABSENCES[n % ABSENCES.length],
        guardianName: `${guardianFirst} ${lastName}`,
        guardianPhone: `343 15${(4_200_000 + n * 1_337).toString().slice(0, 7)}`,
        health: {
          allergies: [],
          conditions: [],
          medication: [],
          physicalExamUntil: isoDate(addDays(new Date(), n % 5 === 0 ? 12 : 140 + n)),
        },
        doeReports: [],
        pickup: [
          { id: `${id}-p1`, fullName: `${guardianFirst} ${lastName}`, dni: `2${(8_000_000 + n * 31_337).toString().slice(0, 7)}`, relationship: n % 2 ? 'Padre' : 'Madre', permanent: true },
        ],
      };
      list.push(s);
      n++;
    });
  }

  // Casos reales del día a día (ejemplos).
  const by = (first: string, last: string) => list.find((s) => s.firstName === first && s.lastName === last)!;

  const mateo = by('Mateo', 'López');
  mateo.guardianName = 'Laura López';
  mateo.health.allergies = ['Maní (severa)'];
  mateo.health.medication = ['Autoinyector de adrenalina en mochila'];
  mateo.legalAlert = { severity: 'CRITICA', text: 'Diego R. tiene prohibido retirar al alumno (oficio judicial 2026). Ante intento, llamar a Dirección.' };
  mateo.pickup = [
    { id: 'pk-mateo-1', fullName: 'Laura López', dni: '28.441.902', relationship: 'Madre', permanent: true },
    { id: 'pk-mateo-2', fullName: 'Ricardo López', dni: '12.905.330', relationship: 'Abuelo', permanent: true },
    { id: 'pk-mateo-3', fullName: 'Marta Giménez', dni: '14.523.118', relationship: 'Abuela', permanent: false, validOn: today, createdBy: 'Laura López' },
  ];

  const sofia = by('Sofía', 'López');
  sofia.guardianName = 'Laura López';
  sofia.health.conditions = ['Celiaquía'];
  sofia.pickup = mateo.pickup.filter((p) => p.permanent).map((p) => ({ ...p, id: p.id + '-s' }));

  const bruno = by('Bruno', 'Duarte');
  bruno.absences = 14.5;
  by('Lucía', 'Benítez').absences = 9.25;
  bruno.doeReports = [{ date: isoDate(addDays(new Date(), -21)), text: 'Entrevista con la familia por inasistencias reiteradas. Se acuerda seguimiento quincenal con el equipo de orientación.' }];

  by('Valentina', 'Paz').pickup.push({ id: 'pk-vp-ev', fullName: 'Carolina Ibáñez', dni: '30.118.774', relationship: 'Madre de compañera', permanent: false, validOn: today, createdBy: 'Javier Paz' });
  by('Ignacio', 'Gómez').health.conditions = ['Diabetes tipo 1'];
  by('Ignacio', 'Gómez').health.medication = ['Insulina · control 10:00 en enfermería'];
  by('Emma', 'Ferreyra').health.allergies = ['Picadura de abeja'];
  by('Camila', 'Peralta').health.conditions = ['Asma'];
  by('Camila', 'Peralta').health.medication = ['Salbutamol (rescate)'];
  by('Máximo', 'Giménez').absences = 19.5;
  by('Pilar', 'Ortiz').legalAlert = { severity: 'MODERADA', text: 'Régimen de comunicación: el padre solo retira los viernes.' };
  by('Pilar', 'Ortiz').doeReports = [{ date: isoDate(addDays(new Date(), -9)), text: 'Acompañamiento por situación familiar. Informe reservado.' }];
  by('Agustín', 'Molina').pickup.push({ id: 'pk-am-ev', fullName: 'Rosa Molina', dni: '16.004.251', relationship: 'Tía', permanent: false, validOn: today, createdBy: 'Paola Molina' });
  by('Franco', 'Moreno').pickup.push({ id: 'pk-fm-ev', fullName: 'Leandro Vidal', dni: '33.778.019', relationship: 'Vecino', permanent: false, validOn: today, createdBy: 'Hernán Moreno' });

  return list;
}

function buildJustifications(students: Student[]): Justification[] {
  const s = (first: string) => students.find((x) => x.firstName === first)!.id;
  const ago = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
  return [
    { id: 'j-1', studentId: s('Lucía'), dates: 'Lunes 9 y martes 10', reason: 'Angina. Reposo 48 h.', fileName: 'certificado_benitez.jpg', sentAt: ago(14), status: 'PENDIENTE' },
    { id: 'j-2', studentId: s('Nicolás'), dates: 'Viernes 6', reason: 'Turno odontológico.', fileName: 'constancia_rossi.pdf', sentAt: ago(30), status: 'PENDIENTE' },
    { id: 'j-3', studentId: s('Lola'), dates: 'Jueves 5 y viernes 6', reason: 'Gastroenteritis.', fileName: 'cert_romano.jpg', sentAt: ago(50), status: 'PENDIENTE' },
    { id: 'j-4', studentId: s('Santino'), dates: 'Miércoles 4', reason: 'Control pediátrico.', fileName: 'herrera_pediatra.jpg', sentAt: ago(120), status: 'APROBADO', reviewedBy: 'u-pre1' },
  ];
}

const PERIODS: GradingPeriod[] = [
  { id: 'p-1', name: '1° Trimestre', status: 'CERRADO', closesOn: '2026-05-29' },
  { id: 'p-2', name: '2° Trimestre', status: 'CERRADO', closesOn: '2026-08-28' },
  { id: 'p-3', name: '3° Trimestre', status: 'ABIERTO', closesOn: isoDate(addDays(new Date(), 9)) },
];

function buildCommunications(): Communication[] {
  const ago = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
  return [
    { id: 'cm-1', title: 'Salida educativa al Museo Provincial', body: 'El jueves 19 los alumnos de 4° Grado "B" visitarán el Museo Provincial de Paraná. Salida 8:30, regreso 12:00. Se requiere autorización firmada.', audience: { kind: 'CURSO', courseId: 'c-4b' }, requiresSignature: true, sentBy: 'u-dir', sentAt: ago(2), recipients: 41, read: 34, signed: 29 },
    { id: 'cm-2', title: 'Festa della Repubblica y Muestra de Arte', body: 'Invitamos a las familias del Nivel Inicial a la muestra de arte del viernes a las 17 h en el SUM.', audience: { kind: 'NIVEL', level: EducationalLevel.INICIAL }, requiresSignature: false, sentBy: 'u-dir', sentAt: ago(28), recipients: 64, read: 58, signed: 0 },
    { id: 'cm-3', title: 'Cambio de horario de Educación Física', body: 'Desde la semana próxima, Educación Física de 1° Año "A" pasa a los martes a las 14 h.', audience: { kind: 'CURSO', courseId: 'c-1a' }, requiresSignature: false, sentBy: 'u-pre2', sentAt: ago(75), recipients: 30, read: 30, signed: 0 },
  ];
}

function buildThreads(students: Student[]): Thread[] {
  const s = (first: string, last: string) => students.find((x) => x.firstName === first && x.lastName === last)!;
  const at = (dayOffset: number, h: number, m: number) => {
    const d = addDays(new Date(), dayOffset);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
  const sofia = s('Sofía', 'López');
  const bruno = s('Bruno', 'Duarte');
  const ignacio = s('Ignacio', 'Gómez');
  return [
    {
      id: 't-1', staffId: 'u-doc1', studentId: sofia.id, subject: 'Tarea de italiano', unread: true, familyUnread: false,
      messages: [
        { id: 'm1', from: 'FAMILIA', authorName: 'Laura López', text: 'Buenas noches profe, Sofía no encuentra la ficha de "La famiglia". ¿La puede reenviar?', at: at(-1, 23, 10) },
      ],
    },
    {
      id: 't-2', staffId: 'u-pre1', studentId: bruno.id, subject: 'Inasistencias de Bruno', unread: true,
      messages: [
        { id: 'm2', from: 'STAFF', authorName: 'Martín Acosta', text: 'Buen día. Bruno lleva 14½ faltas. Les pedimos acercarse a Preceptoría esta semana.', at: at(-2, 9, 5) },
        { id: 'm3', from: 'FAMILIA', authorName: `${bruno.guardianName}`, text: 'Gracias, vamos el jueves a la mañana. Estuvo con bronquitis, traemos el certificado.', at: at(-1, 21, 40) },
      ],
    },
    {
      id: 't-3', staffId: 'u-pre2', studentId: ignacio.id, subject: 'Control de glucemia', unread: false,
      messages: [
        { id: 'm4', from: 'FAMILIA', authorName: ignacio.guardianName, text: 'Hoy Ignacio lleva colación extra para el recreo largo por el control de las 10.', at: at(0, 7, 12) },
        { id: 'm5', from: 'STAFF', authorName: 'Silvia Romero', text: 'Recibido, ya le avisé a la docente y a enfermería.', at: at(0, 7, 40) },
      ],
    },
    {
      id: 't-4', staffId: 'u-doc2', studentId: s('Agustín', 'Molina').id, subject: 'Evaluación de fracciones', unread: false,
      messages: [
        { id: 'm6', from: 'FAMILIA', authorName: 'Paola Molina', text: '¿La evaluación del jueves incluye ángulos?', at: at(-3, 18, 0) },
        { id: 'm7', from: 'STAFF', authorName: 'Pablo Sosa', text: 'Sí, fracciones y ángulos. El repaso está en Archivos.', at: at(-2, 8, 0) },
      ],
    },
  ];
}

function buildEvaluations(): Evaluation[] {
  const d = (n: number) => isoDate(addDays(new Date(), n));
  return [
    { id: 'e-1', assignmentId: 'a-2', date: d(2), title: 'Evaluación escrita: La famiglia', kind: 'Examen' },
    { id: 'e-2', assignmentId: 'a-3', date: d(4), title: 'Oral: Tradizioni italiane', kind: 'Oral' },
    { id: 'e-3', assignmentId: 'a-4', date: d(3), title: 'Fracciones y ángulos', kind: 'Examen' },
    { id: 'e-4', assignmentId: 'a-5', date: d(7), title: 'TP funciones lineales', kind: 'Trabajo práctico' },
    { id: 'e-5', assignmentId: 'a-3', date: d(11), title: 'Entrega de cuaderno', kind: 'Entrega' },
  ];
}

function buildObservations(students: Student[]): Observation[] {
  const s = (first: string) => students.find((x) => x.firstName === first)!.id;
  const d = (n: number) => isoDate(addDays(new Date(), n));
  return [
    { id: 'o-1', studentId: s('Sofía'), authorId: 'u-doc1', date: d(-3), text: 'Excelente participación oral en clase. Ayuda a sus compañeros con la pronunciación.', kind: 'Logro', visibleToFamily: true },
    { id: 'o-2', studentId: s('Nicolás'), authorId: 'u-doc1', date: d(-1), text: 'No trajo la tarea por tercera vez en el mes.', kind: 'Desempeño', visibleToFamily: true },
  ];
}

/** Nivel "base" de cada alumno (entre 5 y 9,5), estable para que sus notas sean coherentes entre trimestres. */
function baseLevel(studentId: string): number {
  let h = 0;
  for (const ch of studentId) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return 5 + (h % 10) * 0.5;
}
/** Variación chica y estable por alumno e instancia, para que no todas las notas sean iguales. */
function jitter(seed: string): number {
  let h = 7;
  for (const ch of seed) h = (h * 17 + ch.charCodeAt(0)) % 101;
  return (h % 5) - 2; // -2 … +2
}
const clampGrade = (n: number) => Math.max(1, Math.min(10, Math.round(n)));

/** Clases con nota numérica (Primaria y Secundaria). Jardín usa informe descriptivo. */
const NUMERIC_CLASSES = ['a-2', 'a-3', 'a-4', 'a-5'];

/** Notas de cierre de trimestre: 1° y 2° completos; el 3° (abierto) todavía sin cierre. */
function buildGrades(students: Student[]): DataState['grades'] {
  const grades: DataState['grades'] = {};
  const now = new Date().toISOString();
  for (const a of ASSIGNMENTS) {
    const st = students.filter((s) => s.courseId === a.courseId);
    for (const s of st) {
      if (NUMERIC_CLASSES.includes(a.id)) {
        for (const p of ['p-1', 'p-2']) {
          const key = `${p}|${a.id}|${s.id}`;
          grades[key] = { key, value: String(clampGrade(baseLevel(s.id) + jitter(p + a.id + s.id) * 0.5)), updatedAt: now };
        }
      } else {
        for (const p of ['p-1', 'p-2']) {
          const key = `${p}|${a.id}|${s.id}`;
          grades[key] = { key, value: 'Participa en canciones y juegos en italiano. Reconoce saludos, colores y números del 1 al 10.', updatedAt: now };
        }
      }
    }
  }
  const mateo = students.find((s) => s.firstName === 'Mateo')!;
  const k = `p-3|a-1|${mateo.id}`;
  grades[k] = { key: k, value: 'Reconoce y nombra colores y miembros de la familia en italiano. Participa con entusiasmo en canciones.', updatedAt: now };
  return grades;
}

/** Instancias parciales del 3° trimestre (escritos, orales, TPs) en las clases con nota numérica. */
const INSTANCES: GradeInstance[] = [
  { id: 'i-1', assignmentId: 'a-2', periodId: 'p-3', title: 'La famiglia', kind: 'Escrito', date: isoDate(addDays(new Date(), -24)), weight: 1 },
  { id: 'i-2', assignmentId: 'a-2', periodId: 'p-3', title: 'Presentación personal', kind: 'Oral', date: isoDate(addDays(new Date(), -15)), weight: 1 },
  { id: 'i-3', assignmentId: 'a-2', periodId: 'p-3', title: 'Árbol genealógico', kind: 'Trabajo práctico', date: isoDate(addDays(new Date(), -6)), weight: 1 },
  { id: 'i-4', assignmentId: 'a-4', periodId: 'p-3', title: 'Fracciones', kind: 'Escrito', date: isoDate(addDays(new Date(), -20)), weight: 2 },
  { id: 'i-5', assignmentId: 'a-4', periodId: 'p-3', title: 'Cuerpos geométricos', kind: 'Trabajo práctico', date: isoDate(addDays(new Date(), -10)), weight: 1 },
  { id: 'i-6', assignmentId: 'a-4', periodId: 'p-3', title: 'Problemas (oral + pizarrón)', kind: 'Mixta', date: isoDate(addDays(new Date(), -3)), weight: 1 },
  { id: 'i-7', assignmentId: 'a-5', periodId: 'p-3', title: 'Funciones lineales', kind: 'Escrito', date: isoDate(addDays(new Date(), -12)), weight: 2 },
  { id: 'i-8', assignmentId: 'a-3', periodId: 'p-3', title: 'Verbi al presente', kind: 'Escrito', date: isoDate(addDays(new Date(), -8)), weight: 1 },
];

function buildPartials(students: Student[]): DataState['partials'] {
  const partials: DataState['partials'] = {};
  const now = new Date().toISOString();
  for (const inst of INSTANCES) {
    const courseId = ASSIGNMENTS.find((a) => a.id === inst.assignmentId)!.courseId;
    const st = students.filter((s) => s.courseId === courseId);
    // El último TP de 4° B está a medio corregir: faltan algunas notas.
    const graded = inst.id === 'i-3' ? st.slice(0, 5) : st;
    for (const s of graded) {
      const key = `${inst.id}|${s.id}`;
      partials[key] = { key, value: String(clampGrade(baseLevel(s.id) + jitter(inst.id + s.id))), updatedAt: now };
    }
  }
  return partials;
}

/** Asistencia de hoy ya tomada en algunos cursos; otros quedan pendientes. */
function buildTodayAttendance(students: Student[]): DataState['attendance'] {
  const date = todayISO();
  const sheets: DataState['attendance'] = {};
  const special: Record<string, Mark> = { 'Mateo López': 'T', 'Bruno Duarte': 'A', 'Lucía Benítez': 'A', 'Thiago Godoy': 'A', 'Nicolás Rossi': 'A', 'Valentina Paz': 'R', 'Malena Castro': 'T' };
  const take = (courseId: string, by: string, h: number, m: number) => {
    const at = new Date();
    at.setHours(h, m, 0, 0);
    const marks: Record<string, Mark> = {};
    students.filter((s) => s.courseId === courseId).forEach((s) => {
      marks[s.id] = special[`${s.firstName} ${s.lastName}`] ?? 'P';
    });
    const key = `${courseId}|${date}|diaria`;
    sheets[key] = { key, courseId, date, takenBy: by, takenAt: at.toISOString(), marks };
  };
  take('c-4b', 'u-pre1', 7, 52);
  take('c-1a', 'u-pre2', 7, 58);
  take('c-s4', 'u-pre2', 13, 20);
  return sheets;
}

export function buildInitialState(): DataState {
  const students = buildStudents();
  return {
    students,
    attendance: buildTodayAttendance(students),
    justifications: buildJustifications(students),
    periods: PERIODS.map((p) => ({ ...p })),
    grades: buildGrades(students),
    instances: INSTANCES.map((i) => ({ ...i })),
    partials: buildPartials(students),
    communications: buildCommunications(),
    threads: buildThreads(students),
    evaluations: buildEvaluations(),
    observations: buildObservations(students),
    pickupLogs: [],
    familyRead: [],
    familySigned: [],
    audit: [],
  };
}
