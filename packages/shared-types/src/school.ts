export enum EducationalLevel {
  INICIAL = 'INICIAL',
  PRIMARIA = 'PRIMARIA',
  SECUNDARIA = 'SECUNDARIA'
}

export enum SchoolShift {
  MANANA = 'MANANA',
  TARDE = 'TARDE',
  DOBLE = 'DOBLE',
  CONTRATURNO = 'CONTRATURNO'
}

export interface CourseDivision {
  id: string;
  level: EducationalLevel;
  yearNumber: number; // e.g. 1 (1st grade), 5 (5th year)
  division: string;   // e.g. "A", "B"
  shift: SchoolShift;
  academicYear: number;
}

