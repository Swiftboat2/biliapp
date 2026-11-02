export enum AttendanceState {
  PRESENTE = 'PRESENTE',
  AUSENTE_INJUSTIFICADO = 'AUSENTE_INJUSTIFICADO',
  AUSENTE_JUSTIFICADO = 'AUSENTE_JUSTIFICADO',
  TARDANZA_CUARTO = 'TARDANZA_CUARTO',      // 0.25 falta
  RETIRO_MEDIO = 'RETIRO_MEDIO'             // 0.5 falta
}

export enum JustificationStatus {
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface AttendanceEntry {
  studentId: string;
  state: AttendanceState;
  justificationStatus?: JustificationStatus;
  notes?: string;
}

export interface OfflineAttendancePayload {
  syncId: string;
  courseDivisionId: string;
  date: string; // YYYY-MM-DD
  shift: string;
  subjectId?: string; // Optional for Secondary
  takenByUserId: string;
  clientTimestamp: number;
  entries: AttendanceEntry[];
}

