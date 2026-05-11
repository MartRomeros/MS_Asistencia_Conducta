import { Router } from "express";
import { registrarAsistenciaHandler, getResumenAsistenciaAlumnoHandler } from "../controllers/asistencia.controller";
import { validate } from "../middlewares/validate.middleware";
import { RegistrarAsistenciaSchema } from "../schemas/asistencia.schema";

const router = Router();

/**
 * @openapi
 * /api/asistencia:
 *   post:
 *     summary: Registra o actualiza la asistencia de los alumnos para una fecha
 *     description: Guarda el registro de asistencia de los alumnos para un curso-asignatura-docente (cad_id) y fecha específicos. Si ya existe un registro para la misma fecha y cad_id, este se actualizará de forma completa.
 *     tags:
 *       - Asistencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cad_id:
 *                 type: integer
 *                 example: 1
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-30"
 *               asistencias:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     estudiante_id:
 *                       type: integer
 *                       example: 104
 *                     estado:
 *                       type: string
 *                       example: "Tardanza"
 *                     tipo_asistencia:
 *                       type: string
 *                       example: "Presencial"
 *     responses:
 *       200:
 *         description: Asistencia registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Asistencia registrada correctamente"
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", validate(RegistrarAsistenciaSchema), registrarAsistenciaHandler);

/**
 * @openapi
 * /api/asistencia/estudiante/{estudiante_id}:
 *   get:
 *     summary: Obtiene el resumen de asistencia de un estudiante por asignatura
 *     description: Retorna un listado con las asignaturas del estudiante y el conteo de asistencias, inasistencias, tardanzas y justificaciones en cada una.
 *     tags:
 *       - Asistencia
 *     parameters:
 *       - in: path
 *         name: estudiante_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Resumen de asistencia obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       asignaturaNombre:
 *                         type: string
 *                         example: "Matemáticas"
 *                       clasesAsistidas:
 *                         type: string
 *                         example: "15"
 *                       clasesAusentes:
 *                         type: string
 *                         example: "2"
 *                       clasesTardanza:
 *                         type: string
 *                         example: "1"
 *                       clasesJustificadas:
 *                         type: string
 *                         example: "0"
 *       404:
 *         description: Estudiante no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/estudiante/:estudiante_id", getResumenAsistenciaAlumnoHandler);

export default router;
