import pool from "../config/database";

export interface Curso {
  curso_id: number;
  nivel: string;
  letra: string;
  anio_academico: number;
  asignatura_id: number;
  asignatura_nombre: string;
  asignatura_siglas: string | null;
  cad_id: number;
}

export interface Alumno {
  estudiante_id: number;
  rut: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  email: string;
}

/**
 * Obtiene todos los cursos asignados a un docente
 * a través de la tabla curso_asignatura_docente.
 */
export async function getCursosByDocente(docenteId: number): Promise<Curso[]> {
  const query = `
    SELECT
      c.curso_id,
      c.nivel,
      c.letra,
      c.anio_academico,
      a.asignatura_id,
      a.nombre   AS asignatura_nombre,
      a.siglas   AS asignatura_siglas,
      cad.id     AS cad_id
    FROM curso_asignatura_docente cad
    INNER JOIN cursos      c ON cad.curso_id      = c.curso_id
    INNER JOIN asignaturas a ON cad.asignatura_id = a.asignatura_id
    WHERE cad.docente_id = $1
    ORDER BY c.anio_academico DESC, c.nivel, c.letra;
  `;

  const result = await pool.query<Curso>(query, [docenteId]);
  return result.rows;
}

/**
 * Obtiene todos los alumnos pertenecientes a un curso en específico.
 */
export async function getAlumnosByCurso(cursoId: number): Promise<Alumno[]> {
  const query = `
    SELECT
      e.estudiante_id,
      u.rut,
      u.nombre,
      u.apellido_paterno,
      u.apellido_materno,
      u.email
    FROM estudiantes e
    INNER JOIN usuarios u ON e.estudiante_id = u.usuario_id
    WHERE e.curso_id = $1 AND u.activo = true
    ORDER BY u.apellido_paterno ASC, u.apellido_materno ASC, u.nombre ASC;
  `;

  const result = await pool.query<Alumno>(query, [cursoId]);
  return result.rows;
}
