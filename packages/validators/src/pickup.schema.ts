import { z } from 'zod';

export const CreatePickupAuthorizationSchema = z.object({
  studentId: z.string().uuid(),
  dni: z.string().min(6).max(10),
  fullName: z.string().min(3),
  relationship: z.string().min(2),
  phone: z.string().optional(),
  photoUrl: z.string().url().optional(),
  isPermanent: z.boolean().default(true),
  validUntil: z.string().datetime().optional()
});

export const RecordPickupSchema = z.object({
  studentId: z.string().uuid(),
  authorizedPersonId: z.string().uuid().optional(),
  notes: z.string().optional()
});

export type CreatePickupAuthorizationInput = z.infer<typeof CreatePickupAuthorizationSchema>;
export type RecordPickupInput = z.infer<typeof RecordPickupSchema>;

