import { Request, Response } from "express";
import * as anotacionesService from "../services/anotaciones.service";
import { ListarAnotacionesQuerySchema } from "../schemas/anotaciones.schema";

export async function registrarAnotacionHandler(req: Request, res: Response): Promise<void> {
  const docenteId = req.docente!.id;
  const anotacion = await anotacionesService.registrarAnotacion(docenteId, req.body);

  res.status(201).json({
    success: true,
    message: "Anotacion registrada correctamente",
    data: anotacion,
  });
}

export async function listarAnotacionesHandler(req: Request, res: Response): Promise<void> {
  const docenteId = req.docente!.id;
  const filtros = ListarAnotacionesQuerySchema.parse(req.query);
  const resultado = await anotacionesService.listarAnotaciones(docenteId, filtros);

  res.status(200).json({
    success: true,
    data: resultado.data,
    meta: resultado.meta,
  });
}
