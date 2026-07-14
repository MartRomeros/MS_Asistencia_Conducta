import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { authenticate, requireRole } from "../middlewares/auth.middleware";
import {
  registrarAnotacionHandler,
  listarAnotacionesHandler,
} from "../controllers/anotaciones.controller";
import { CrearAnotacionSchema, ListarAnotacionesSchema } from "../schemas/anotaciones.schema";

const router = Router();

/**
 * @openapi
 * /api/anotaciones:
 *   post:
 *     summary: Registra una anotacion para un estudiante
 *     tags:
 *       - Anotaciones
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estudiante_id:
 *                 type: integer
 *                 example: 104
 *               tipo:
 *                 type: string
 *                 enum: [positiva, negativa, observacion]
 *               descripcion:
 *                 type: string
 *                 example: "Interrumpe reiteradamente la clase pese a advertencias previas."
 *             required: [estudiante_id, tipo, descripcion]
 *     responses:
 *       201:
 *         description: Anotacion registrada correctamente
 *       400:
 *         description: Datos de entrada invalidos
 *       401:
 *         description: Token ausente, invalido o expirado
 *       403:
 *         description: Usuario sin permisos
 *       404:
 *         description: Estudiante no encontrado o inactivo
 */
router.post(
  "/",
  authenticate,
  requireRole("Docente"),
  validate(CrearAnotacionSchema),
  registrarAnotacionHandler,
);

/**
 * @openapi
 * /api/anotaciones:
 *   get:
 *     summary: Lista anotaciones creadas por el docente autenticado
 *     tags:
 *       - Anotaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estudiante_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [positiva, negativa, observacion]
 *       - in: query
 *         name: fecha_desde
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_hasta
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Listado obtenido correctamente
 *       400:
 *         description: Query invalida
 *       401:
 *         description: Token ausente, invalido o expirado
 *       403:
 *         description: Usuario sin permisos
 */
router.get(
  "/",
  authenticate,
  requireRole("Docente"),
  validate(ListarAnotacionesSchema),
  listarAnotacionesHandler,
);

export default router;
