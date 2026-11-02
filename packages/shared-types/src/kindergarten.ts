export enum MoodState {
  ALEGRE = 'ALEGRE',
  TRANQUILO = 'TRANQUILO',
  CANSADO = 'CANSADO',
  CON_LLANTO = 'CON_LLANTO'
}

export enum IntakeAmount {
  NADA = 'NADA',
  POCO = 'POCO',
  MITAD = 'MITAD',
  TODO = 'TODO'
}

export enum DiaperType {
  LIMPIO = 'LIMPIO',
  HUMEDO = 'HUMEDO',
  DEPOSICION = 'DEPOSICION'
}

export interface KindergartenDailyReport {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  mood: MoodState;
  snackIntake: IntakeAmount;
  lunchIntake?: IntakeAmount;
  napStart?: string; // HH:mm
  napEnd?: string;   // HH:mm
  diaperLogs: {
    time: string;
    type: DiaperType;
    notes?: string;
  }[];
  notes?: string;
}

