import * as anotacionesRepo from "../models/anotaciones.repository";
import { CrearAnotacionBody, ListarAnotacionesQuery } from "../schemas/anotaciones.schema";

interface HttpError extends Error {
  status?: number;
}

function createHttpError(status: number, message: string): HttpError {
  const err = new Error(message) as HttpError;
  err.status = status;
  return err;
}

export async function registrarAnotacion(
  docenteId: number,
  payload: CrearAnotacionBody
) {
  const existeEstudiante = await anotacionesRepo.existeEstudianteActivo(payload.estudiante_id);
  if (!existeEstudiante) {
    throw createHttpError(404, "Estudiante no encontrado o inactivo");
  }

  const autorizado = await anotacionesRepo.docentePuedeAnotarEstudiante(
    docenteId,
    payload.estudiante_id
  );
  if (!autorizado) {
    throw createHttpError(403, "No tienes permisos para anotar a este estudiante");
  }

  return anotacionesRepo.crearAnotacion(
    payload.estudiante_id,
    docenteId,
    payload.tipo,
    payload.descripcion
  );
}

export async function listarAnotaciones(docenteId: number, filtros: ListarAnotacionesQuery) {
  const [data, total] = await Promise.all([
    anotacionesRepo.listarAnotacionesPorDocente(docenteId, filtros),
    anotacionesRepo.contarAnotacionesPorDocente(docenteId, filtros),
  ]);

  return {
    data,
    meta: {
      page: filtros.page,
      limit: filtros.limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / filtros.limit)),
    },
  };
}
