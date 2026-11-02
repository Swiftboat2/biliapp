import { z } from 'zod';

export const DiaperLogEntrySchema = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:mm requerido'),
  type: z.enum(['LIMPIO', 'HUMEDO', 'DEPOSICION']),
  notes: z.string().optional()
});

export const DailyKindergartenLogSchema = z.object({
  studentId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  mood: z.enum(['ALEGRE', 'TRANQUILO', 'CANSADO', 'CON_LLANTO']),
  snackIntake: z.enum(['NADA', 'POCO', 'MITAD', 'TODO']),
  lunchIntake: z.enum(['NADA', 'POCO', 'MITAD', 'TODO']).optional(),
  napStart: z.string().optional(),
  napEnd: z.string().optional(),
  diaperLogs: z.array(DiaperLogEntrySchema).default([]),
  observations: z.string().optional()
});

export type DailyKindergartenLogInput = z.infer<typeof DailyKindergartenLogSchema>;

