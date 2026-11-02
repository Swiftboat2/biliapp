export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  DIRECTIVO = 'DIRECTIVO',
  ADMINISTRACION = 'ADMINISTRACION',
  PRECEPTOR = 'PRECEPTOR',
  DOCENTE = 'DOCENTE',
  TUTOR = 'TUTOR',
  ALUMNO = 'ALUMNO',
  MANTENIMIENTO = 'MANTENIMIENTO'
}

export interface AuthUser {
  id: string;
  dni: string;
  email: string | null;
  role: UserRole;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface GuardianProfile {
  id: string;
  userId: string;
  phone: string;
  students: {
    studentId: string;
    relationship: string;
    isPrimaryContact: boolean;
  }[];
}

