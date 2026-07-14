import { Router } from "express";
import { getAlumnosCurso } from "../controllers/cursos.controller";
import { authenticate, requireRole } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @openapi
 * /api/cursos/{id}/alumnos:
 *   get:
 *     summary: Obtiene los alumnos pertenecientes a un curso en específico
 *     description: >
 *       Retorna una lista de los estudiantes que están matriculados en el curso,
 *       requiere un token JWT de un Docente en el header `Authorization`.
 *     tags:
 *       - Cursos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de alumnos del curso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 curso_id:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Alumno'
 *       400:
 *         description: ID de curso inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token ausente o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: No tiene permisos (requiere rol Docente)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     Alumno:
 *       type: object
 *       properties:
 *         estudiante_id:
 *           type: integer
 *           example: 1
 *         rut:
 *           type: string
 *           example: "20.123.456-7"
 *         nombre:
 *           type: string
 *           example: "Juan"
 *         apellido_paterno:
 *           type: string
 *           example: "Pérez"
 *         apellido_materno:
 *           type: string
 *           nullable: true
 *           example: "Gómez"
 *         email:
 *           type: string
 *           example: "juan.perez@alumnos.cl"
 */
router.get("/:id/alumnos", authenticate, requireRole("Docente"), getAlumnosCurso);

export default router;
