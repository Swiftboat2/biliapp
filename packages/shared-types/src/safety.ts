export enum LegalAlertSeverity {
  CRITICA = 'CRITICA', // Prohibición total de retiro / restricción perimetral
  MODERADA = 'MODERADA',
  INFORMATIVA = 'INFORMATIVA'
}

export interface MedicalRecordDTO {
  bloodType: string;
  healthInsurance: string;
  allergies: string[];
  foodRestrictions: string[];
  medication: string[];
  physicalExamExpirationDate: string; // YYYY-MM-DD
  isPhysicalExamValid: boolean;
}

export interface PickupAuthorizedDTO {
  id: string;
  studentId: string;
  dni: string;
  fullName: string;
  relationship: string;
  photoUrl?: string;
  isPermanent: boolean;
  validUntil?: string; // For temporary authorizations
}

export interface PickupLogDTO {
  id: string;
  studentId: string;
  authorizedPersonId: string;
  verifiedByUserId: string;
  timestamp: string;
  notes?: string;
}

