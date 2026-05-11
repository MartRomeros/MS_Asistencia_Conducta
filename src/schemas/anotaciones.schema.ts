import { z } from "zod";

export const AnotacionTipoSchema = z.enum([
  "positiva",
  "negativa",
  "informativa",
]);

export const CrearAnotacionBodySchema = z
  .object({
    estudiante_id: z.number().int().positive(),
    tipo: AnotacionTipoSchema,
    descripcion: z.string().trim().min(5).max(1000),
  })
  .strict();

export const CrearAnotacionSchema = z.object({
  body: CrearAnotacionBodySchema,
});

export const ListarAnotacionesQuerySchema = z
  .object({
    estudiante_id: z.coerce.number().int().positive().optional(),
    curso_id: z.coerce.number().int().positive().optional(),
    tipo: AnotacionTipoSchema.optional(),
    fecha_desde: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    fecha_hasta: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  })
  .superRefine((data, ctx) => {
    if (
      data.fecha_desde &&
      data.fecha_hasta &&
      data.fecha_desde > data.fecha_hasta
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fecha_desde"],
        message: "fecha_desde no puede ser mayor que fecha_hasta",
      });
    }
  });

export const ListarAnotacionesSchema = z.object({
  query: ListarAnotacionesQuerySchema,
});

export type CrearAnotacionBody = z.infer<typeof CrearAnotacionBodySchema>;
export type ListarAnotacionesQuery = z.infer<
  typeof ListarAnotacionesQuerySchema
>;
