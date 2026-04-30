import { getCursosByDocente, Curso, getAlumnosByCurso, Alumno } from "../models/cursos.repository";

/**
 * Orquesta la lógica de negocio para obtener los cursos de un docente.
 */
export async function getCursosParaDocente(docenteId: number): Promise<Curso[]> {
  const cursos = await getCursosByDocente(docenteId);
  return cursos;
}

/**
 * Orquesta la lógica de negocio para obtener los alumnos de un curso.
 */
export async function getAlumnosDelCurso(cursoId: number): Promise<Alumno[]> {
  const alumnos = await getAlumnosByCurso(cursoId);
  return alumnos;
}
