import { z } from 'zod';

export const AttendanceEntrySchema = z.object({
  studentId: z.string().uuid(),
  state: z.enum([
    'PRESENTE',
    'AUSENTE_INJUSTIFICADO',
    'AUSENTE_JUSTIFICADO',
    'TARDANZA_CUARTO',
    'RETIRO_MEDIO'
  ]),
  justificationNotes: z.string().optional()
});

export const TakeAttendanceSchema = z.object({
  courseDivisionId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  shift: z.enum(['MANANA', 'TARDE', 'DOBLE', 'CONTRATURNO']),
  subjectId: z.string().uuid().optional(),
  clientSyncId: z.string().optional(),
  entries: z.array(AttendanceEntrySchema).min(1, 'Debe registrar al menos un alumno')
});

export const JustificationApprovalSchema = z.object({
  detailId: z.string().uuid(),
  status: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().optional()
});

export type TakeAttendanceInput = z.infer<typeof TakeAttendanceSchema>;
export type JustificationApprovalInput = z.infer<typeof JustificationApprovalSchema>;

