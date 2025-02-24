import { z } from 'zod';

export const profileSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Dirección de correo electrónico inválida'),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, 'Número de teléfono inválido')
      .optional(),
    currentPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .optional(),
    newPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .optional(),
    confirmPassword: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword']
    }
  );

export type ProfileFormData = z.infer<typeof profileSchema>;
