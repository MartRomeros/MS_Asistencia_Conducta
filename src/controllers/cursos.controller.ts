import { Request, Response } from "express";
import { verifyToken } from "../services/jwt.service";
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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Token de autorización requerido",
    });
    return;
  }

  const token = authHeader.split(" ")[1] as string;
  const payload = verifyToken(token);

  // Verificar que el usuario tenga el rol de Docente
  if (payload.role !== "Docente") {
    res.status(403).json({
      success: false,
      message: "No tienes permisos para acceder a este recurso",
    });
    return;
  }

  const cursos = await getCursosParaDocente(payload.id);

  res.status(200).json({
    success: true,
    docente_id: payload.id,
    data: cursos,
  });
}

/**
 * GET /api/cursos/:id/alumnos
 *
 * Obtiene los alumnos correspondientes a un curso específico.
 */
export async function getAlumnosCurso(
  req: Request,
  res: Response
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Token de autorización requerido",
    });
    return;
  }

  const token = authHeader.split(" ")[1] as string;
  const payload = verifyToken(token);

  // Podríamos validar si el rol es Docente u otro rol con permisos
  if (payload.role !== "Docente") {
    res.status(403).json({
      success: false,
      message: "No tienes permisos para acceder a este recurso",
    });
    return;
  }

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
    curso_id: cursoId,
    data: alumnos,
  });
}
