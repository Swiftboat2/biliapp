export enum GradingScaleType {
  CONCEPTUAL_NARRATIVA = 'CONCEPTUAL_NARRATIVA', // Nivel Inicial
  NUMERICA_PRIMARIA = 'NUMERICA_PRIMARIA',       // 1 - 10
  NUMERICA_PONDERADA = 'NUMERICA_PONDERADA'      // Secundaria con rúbricas y promedios
}

export enum PeriodStatus {
  OPEN = 'OPEN',
  CLOSING = 'CLOSING',
  LOCKED = 'LOCKED'
}

export interface AcademicGradeDTO {
  id: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  numericGrade?: number;
  conceptualGrade?: string;
  observations?: string;
  isUnlockedException: boolean;
}

