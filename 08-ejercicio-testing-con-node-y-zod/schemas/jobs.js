import { z } from 'zod'

// Schema con la estructura y reglas de un job válido.
const jobSchema = z.object({
  titulo: z
    .string({ message: 'El título debe ser un string' })
    .min(3, { message: 'El título debe tener al menos 3 caracteres' })
    .max(100, { message: 'El título no puede exceder los 100 caracteres' }),
  empresa: z.string(),
  ubicacion: z.string(),

  // Campos opcionales, no obligamos a que vengan siempre
  descripcion: z.string().optional(),
  content: z
    .object({
      description: z.string().optional(),
      responsibilities: z.string().optional(),
      requirements: z.string().optional(),
      about: z.string().optional(),
    })
    .optional(),

  // Si viene data, technology debe ser un array de strings
  data: z
    .object({
      technology: z.array(z.string()),
      modalidad: z.string().optional(),
      nivel: z.string().optional(),
    })
    .optional(),
})

// Válida un job completo (para POST y PUT).
export const validateJob = (input) => jobSchema.safeParse(input)

// Válida un job parcial (para PATCH).
export const validatePartialJob = (input) => jobSchema.partial().safeParse(input)
