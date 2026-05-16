import { Request, Response } from "express";
import { verifyToken } from "../services/jwt.service";
import { getCursosParaDocente, getAlumnosDelCurso } from "../services/cursos.service";

function getAuthenticatedDocenteId(req: Request, res: Response): number | null {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Token de autorización requerido",
    });
    return null;
  }

  const token = authHeader.split(" ")[1] as string;
  const payload = verifyToken(token);

  if (payload.role !== "Docente") {
    res.status(403).json({
      success: false,
      message: "No tienes permisos para acceder a este recurso",
    });
    return null;
  }

  return payload.id;
}

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
  const docenteId = getAuthenticatedDocenteId(req, res);
  if (!docenteId) return;

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
export async function getAlumnosCurso(req: Request,res: Response): Promise<void> {

  const docenteId = getAuthenticatedDocenteId(req, res);
  
  if (!docenteId) return;

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
