import { Request, Response } from "express";
import { verifyToken } from "../services/jwt.service";
import * as anotacionesService from "../services/anotaciones.service";
import { ListarAnotacionesQuerySchema } from "../schemas/anotaciones.schema";

function getDocenteIdFromAuthHeader(authHeader?: string): number {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Token de autorización requerido") as Error & { status?: number };
    error.status = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1] as string;
  const payload = verifyToken(token);

  if (payload.role !== "Docente") {
    const error = new Error("No tienes permisos para acceder a este recurso") as Error & {
      status?: number;
    };
    error.status = 403;
    throw error;
  }

  return payload.id;
}

export async function registrarAnotacionHandler(req: Request, res: Response): Promise<void> {
  const docenteId = getDocenteIdFromAuthHeader(req.headers.authorization);
  const anotacion = await anotacionesService.registrarAnotacion(docenteId, req.body);

  res.status(201).json({
    success: true,
    message: "Anotacion registrada correctamente",
    data: anotacion,
  });
}

export async function listarAnotacionesHandler(req: Request, res: Response): Promise<void> {
  const docenteId = getDocenteIdFromAuthHeader(req.headers.authorization);
  const filtros = ListarAnotacionesQuerySchema.parse(req.query);
  const resultado = await anotacionesService.listarAnotaciones(docenteId, filtros);

  res.status(200).json({
    success: true,
    data: resultado.data,
    meta: resultado.meta,
  });
}
