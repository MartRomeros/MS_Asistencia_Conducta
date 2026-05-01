import { Router } from "express";
import { registrarAsistenciaHandler } from "../controllers/asistencia.controller";
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

export default router;
