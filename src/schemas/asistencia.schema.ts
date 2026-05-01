import { z } from "zod";

export const AsistenciaEstudianteSchema = z.object({
  estudiante_id: z.number().int().positive(),
  estado: z.string().min(1, "El estado es requerido"),
  tipo_asistencia: z.string().min(1, "El tipo de asistencia es requerido")
});

export const RegistrarAsistenciaSchema = z.object({
  body: z.object({
    cad_id: z.number().int().positive(),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido. Use YYYY-MM-DD"),
    asistencias: z.array(AsistenciaEstudianteSchema).min(1, "Debe enviar al menos una asistencia")
  })
});

export type RegistrarAsistenciaType = z.infer<typeof RegistrarAsistenciaSchema>["body"];
