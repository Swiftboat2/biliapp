import { z } from 'zod';

export const LoginSchema = z.object({
  identifier: z.string().min(3, 'DNI o correo electrónico requerido'),
  password: z.string().min(4, 'Contraseña o PIN requerido'),
});

export const GuardianPinAuthSchema = z.object({
  guardianId: z.string().uuid(),
  pin: z.string().length(6, 'El PIN debe contener exactamente 6 dígitos'),
});

export const RegisterUserSchema = z.object({
  dni: z.string().min(7).max(10),
  email: z.string().email().optional(),
  password: z.string().min(6),
  pin: z.string().length(6).optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum([
    'SUPERADMIN',
    'DIRECTIVO',
    'ADMINISTRACION',
    'PRECEPTOR',
    'DOCENTE',
    'TUTOR',
    'ALUMNO',
    'MANTENIMIENTO'
  ]),
  phone: z.string().optional()
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type GuardianPinAuthInput = z.infer<typeof GuardianPinAuthSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

