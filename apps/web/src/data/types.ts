import type { EducationalLevel, SchoolShift, UserRole } from '@biliapp/shared-types';

/** Roles que usan el panel institucional. */
export type StaffRole = UserRole.DIRECTIVO | UserRole.PRECEPTOR | UserRole.DOCENTE;

export interface StaffUser {
  id: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  title: string;
  /** Cursos a cargo (preceptoría). */
  courseIds?: string[];
}

export interface Course {
  id: string;
  name: string;
  level: EducationalLevel;
  shift: SchoolShift;
  preceptorId?: string;
}

export interface Subject {
  id: string;
  name: string;
}

/** Docente ↔ materia ↔ curso. */
export interface Assignment {
  id: string;
  teacherId: string;
  subjectId: string;
  courseId: string;
  /** Días y horario, solo para mostrar. */
  schedule: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  courseId: string;
  /** Faltas acumuladas antes de hoy (en fracciones). */
  absences: number;
  guardianName: string;
  guardianPhone: string;
  health: {
    allergies: string[];
    conditions: string[];
    medication: string[];
    physicalExamUntil: string; // YYYY-MM-DD
  };
  legalAlert?: { severity: 'CRITICA' | 'MODERADA'; text: string };
  /** Actas del equipo de orientación (DOE): solo Dirección. */
  doeReports: { date: string; text: string }[];
  pickup: PickupPerson[];
}

export interface PickupPerson {
  id: string;
  fullName: string;
  dni: string;
  relationship: string;
  permanent: boolean;
  /** Para permisos eventuales: fecha YYYY-MM-DD. */
  validOn?: string;
  createdBy?: string;
}

/** P presente · A ausente (1) · T tarde (¼) · R retiro anticipado (½). */
export type Mark = 'P' | 'A' | 'T' | 'R';

export interface AttendanceSheet {
  /** `${courseId}|${fecha}|${subjectId ?? 'diaria'}` */
  key: string;
  courseId: string;
  date: string;
  subjectId?: string;
  takenBy: string;
  takenAt: string;
  marks: Record<string, Mark>;
  /** Motivo y horarios de cada ausencia, tardanza o retiro. */
  details?: Record<string, MarkDetail>;
  /** Observaciones de Preceptoría por alumno. */
  notes?: Record<string, string>;
}

export interface MarkDetail {
  reason?: string;
  /** Tarde: hora de llegada. Retiro: hora de salida. */
  time?: string;
  /** Retiro: si vuelve más tarde a clases y a qué hora. */
  returns?: boolean;
  returnTime?: string;
}

/** Firma de un docente en una hora del acta del día. */
export interface HourSignature {
  key: string; // `${courseId}|${fecha}|${hora}`
  courseId: string;
  date: string;
  hour: number;
  teacherName: string;
  at: string;
  note?: string;
}

export type JustStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export interface Justification {
  id: string;
  /** Fecha de la falta que se justifica (para mostrarla en la app de la familia). */
  forDate?: string;
  studentId: string;
  dates: string;
  reason: string;
  fileName: string;
  sentAt: string;
  status: JustStatus;
  reviewedBy?: string;
}

export interface GradingPeriod {
  id: string;
  name: string;
  status: 'ABIERTO' | 'CERRADO';
  closesOn: string;
}

/** Instancia de evaluación parcial dentro de un trimestre (una columna de la planilla). */
export type InstanceKind = 'Escrito' | 'Oral' | 'Trabajo práctico' | 'Mixta';

export interface GradeInstance {
  id: string;
  assignmentId: string;
  periodId: string;
  title: string;
  kind: InstanceKind;
  date: string;
  /** Peso en el promedio: 1 normal, 2 vale doble. */
  weight: 1 | 2;
}

/**
 * Una nota por clave. Se usa para:
 * - nota del trimestre: `${periodId}|${assignmentId}|${studentId}`
 * - nota parcial: `${instanceId}|${studentId}`
 */
export interface GradeEntry {
  key: string; // `${periodId}|${assignmentId}|${studentId}`
  value: string; // número 1-10 o texto cualitativo (Jardín)
  updatedAt: string;
}

export type Audience = { kind: 'TODOS' } | { kind: 'NIVEL'; level: EducationalLevel } | { kind: 'CURSO'; courseId: string };

export interface Communication {
  id: string;
  title: string;
  body: string;
  audience: Audience;
  requiresSignature: boolean;
  sentBy: string;
  sentAt: string;
  recipients: number;
  read: number;
  signed: number;
}

export interface Message {
  id: string;
  from: 'FAMILIA' | 'STAFF';
  authorName: string;
  text: string;
  at: string; // ISO
}

export interface Thread {
  id: string;
  staffId: string;
  studentId: string;
  subject: string;
  messages: Message[];
  /** Sin leer por el personal. */
  unread: boolean;
  /** Sin leer por la familia (respuesta nueva del colegio). */
  familyUnread?: boolean;
}

export interface Evaluation {
  id: string;
  assignmentId: string;
  date: string;
  title: string;
  kind: 'Examen' | 'Trabajo práctico' | 'Oral' | 'Entrega';
}

/** Tipos de evento del calendario escolar. */
export type EventKind = 'Acto' | 'Reunión' | 'Salida' | 'Institucional' | 'Feriado';

/** Evento del calendario que carga Dirección o Preceptoría. */
export interface SchoolEvent {
  id: string;
  title: string;
  kind: EventKind;
  date: string; // YYYY-MM-DD
  /** Último día, para eventos de varios días (receso, semana de muestras). */
  endDate?: string;
  time?: string; // HH:MM
  detail?: string;
  audience: Audience;
  createdBy: string;
}

export interface Observation {
  id: string;
  studentId: string;
  authorId: string;
  date: string;
  text: string;
  kind: 'Conducta' | 'Desempeño' | 'Logro';
  visibleToFamily: boolean;
}

export interface PickupLog {
  id: string;
  studentId: string;
  personId: string;
  at: string;
  verifiedBy: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  userId: string;
  action: string;
}

export interface DataState {
  attendance: Record<string, AttendanceSheet>;
  justifications: Justification[];
  periods: GradingPeriod[];
  /** Notas del trimestre (cierre oficial que carga el docente). */
  grades: Record<string, GradeEntry>;
  /** Instancias parciales (escritos, orales, TPs) y sus notas. */
  instances: GradeInstance[];
  partials: Record<string, GradeEntry>;
  communications: Communication[];
  threads: Thread[];
  evaluations: Evaluation[];
  /** Calendario escolar: actos, reuniones, salidas, feriados y fechas institucionales. */
  events: SchoolEvent[];
  observations: Observation[];
  pickupLogs: PickupLog[];
  /** Firmas de los docentes en el acta de cada día. */
  signatures: Record<string, HourSignature>;
  /** Lo que hizo la familia de ejemplo en la app: comunicados leídos y firmados. */
  familyRead: string[];
  familySigned: string[];
  students: Student[];
  audit: AuditEntry[];
}
