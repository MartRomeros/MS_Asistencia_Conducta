import { Request, Response } from "express";
import { getCursosParaDocente, getAlumnosDelCurso } from "../services/cursos.service";

/**
 * GET /api/docentes/cursos
 *
 * Extrae el docente_id del JWT enviado en el header Authorization,
 * consulta sus cursos y los retorna.
 */
export async function getCursosDocente(
  req: Request,
  res: Response
): Promise<void> {
  const docenteId = req.docente!.id;

  const cursos = await getCursosParaDocente(docenteId);

  res.status(200).json({
    success: true,
    docente_id: docenteId,
    data: cursos,
  });
}

/**
 * GET /api/cursos/:id/alumnos
 *
 * Obtiene los alumnos correspondientes a un curso específico.
 */
export async function getAlumnosCurso(req: Request, res: Response): Promise<void> {
  const docenteId = req.docente!.id;

  const cursoId = parseInt(req.params.id as string, 10);
  
  if (isNaN(cursoId)) {
    res.status(400).json({
      success: false,
      message: "ID de curso inválido",
    });
    return;
  }

  const alumnos = await getAlumnosDelCurso(cursoId);

  res.status(200).json({
    success: true,
    docente_id: docenteId,
    curso_id: cursoId,
    data: alumnos,
  });
}
