import { Request, Response } from "express";
import * as asistenciaService from "../services/asistencia.service";

export async function registrarAsistenciaHandler(req: Request, res: Response) {
  const data = req.body;
  await asistenciaService.registrarAsistencia(data);
  res.status(200).json({
    success: true,
    message: "Asistencia registrada correctamente"
  });
}
