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

export async function getResumenAsistenciaAlumnoHandler(req: Request, res: Response) {
  const { estudiante_id } = req.params;
  const resumen = await asistenciaService.getResumenAsistenciaAlumno(Number(estudiante_id));
  res.status(200).json({
    success: true,
    data: resumen
  });
}
