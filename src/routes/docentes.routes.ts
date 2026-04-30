import { Router } from "express";
import { getCursosDocente } from "../controllers/cursos.controller";

const router = Router();

/**
 * @openapi
 * /api/docentes/cursos:
 *   get:
 *     summary: Obtiene los cursos asignados al docente autenticado
 *     description: >
 *       Decodifica el JWT presente en el header `Authorization` para extraer el
 *       `docente_id` y retorna todos los cursos (con asignatura) que ese docente
 *       tiene asignados en la tabla `curso_asignatura_docente`.
 *     tags:
 *       - Docentes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos del docente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 docente_id:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CursoDocente'
 *       401:
 *         description: Token ausente o inválido
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
 *     CursoDocente:
 *       type: object
 *       properties:
 *         curso_id:
 *           type: integer
 *           example: 1
 *         nivel:
 *           type: string
 *           example: "1° Medio"
 *         letra:
 *           type: string
 *           example: "A"
 *         anio_academico:
 *           type: integer
 *           example: 2025
 *         asignatura_id:
 *           type: integer
 *           example: 3
 *         asignatura_nombre:
 *           type: string
 *           example: "Matemáticas"
 *         asignatura_siglas:
 *           type: string
 *           nullable: true
 *           example: "MAT"
 *         cad_id:
 *           type: integer
 *           example: 10
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Token de autorización requerido"
 */
router.get("/cursos", getCursosDocente);

export default router;
