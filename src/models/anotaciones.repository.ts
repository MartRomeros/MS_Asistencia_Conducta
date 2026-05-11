import pool from "../config/database";
import { AnotacionTipoSchema, ListarAnotacionesQuery } from "../schemas/anotaciones.schema";
import { z } from "zod";

type AnotacionTipo = z.infer<typeof AnotacionTipoSchema>;

export interface AnotacionCreada {
  anotacion_id: number;
  estudiante_id: number;
  docente_id: number;
  tipo: AnotacionTipo;
  descripcion: string;
  fecha_registro: string;
}

export interface AnotacionListado extends AnotacionCreada {
  estudiante_nombre: string;
  estudiante_apellido_paterno: string;
  estudiante_apellido_materno: string | null;
}

export async function existeEstudianteActivo(estudianteId: number): Promise<boolean> {
  const query = `
    SELECT 1
    FROM estudiantes e
    INNER JOIN usuarios u ON u.usuario_id = e.estudiante_id
    WHERE e.estudiante_id = $1
      AND u.activo = true
    LIMIT 1
  `;
  const result = await pool.query(query, [estudianteId]);
  return (result.rowCount ?? 0) > 0;
}

export async function docentePuedeAnotarEstudiante(
  docenteId: number,
  estudianteId: number
): Promise<boolean> {
  const query = `
    SELECT 1
    FROM estudiantes e
    INNER JOIN curso_asignatura_docente cad ON cad.curso_id = e.curso_id
    WHERE e.estudiante_id = $1
      AND cad.docente_id = $2
    LIMIT 1
  `;
  const result = await pool.query(query, [estudianteId, docenteId]);
  return (result.rowCount ?? 0) > 0;
}

export async function crearAnotacion(
  estudianteId: number,
  docenteId: number,
  tipo: AnotacionTipo,
  descripcion: string
): Promise<AnotacionCreada> {
  const query = `
    INSERT INTO anotaciones (estudiante_id, docente_id, tipo, descripcion)
    VALUES ($1, $2, $3, $4)
    RETURNING anotacion_id, estudiante_id, docente_id, tipo, descripcion, fecha_registro
  `;

  const result = await pool.query<AnotacionCreada>(query, [
    estudianteId,
    docenteId,
    tipo,
    descripcion,
  ]);
  return result.rows[0] as AnotacionCreada;
}

function buildFiltros(
  docenteId: number,
  filtros: ListarAnotacionesQuery
): { whereSql: string; params: Array<number | string> } {
  const params: Array<number | string> = [docenteId];
  const where: string[] = ["an.docente_id = $1"];

  if (filtros.estudiante_id) {
    params.push(filtros.estudiante_id);
    where.push(`an.estudiante_id = $${params.length}`);
  }

  if (filtros.curso_id) {
    params.push(filtros.curso_id);
    where.push(`
      EXISTS (
        SELECT 1
        FROM estudiantes e
        WHERE e.estudiante_id = an.estudiante_id
          AND e.curso_id = $${params.length}
      )
    `);
  }

  if (filtros.tipo) {
    params.push(filtros.tipo);
    where.push(`an.tipo = $${params.length}`);
  }

  if (filtros.fecha_desde) {
    params.push(filtros.fecha_desde);
    where.push(`an.fecha_registro::date >= $${params.length}::date`);
  }

  if (filtros.fecha_hasta) {
    params.push(filtros.fecha_hasta);
    where.push(`an.fecha_registro::date <= $${params.length}::date`);
  }

  return { whereSql: where.join(" AND "), params };
}

export async function listarAnotacionesPorDocente(
  docenteId: number,
  filtros: ListarAnotacionesQuery
): Promise<AnotacionListado[]> {
  const { whereSql, params } = buildFiltros(docenteId, filtros);
  const offset = (filtros.page - 1) * filtros.limit;

  const listParams = [...params, filtros.limit, offset];
  const query = `
    SELECT
      an.anotacion_id,
      an.estudiante_id,
      u.nombre AS estudiante_nombre,
      u.apellido_paterno AS estudiante_apellido_paterno,
      u.apellido_materno AS estudiante_apellido_materno,
      an.docente_id,
      an.tipo,
      an.descripcion,
      an.fecha_registro
    FROM anotaciones an
    INNER JOIN estudiantes e ON e.estudiante_id = an.estudiante_id
    INNER JOIN usuarios u ON u.usuario_id = e.estudiante_id
    WHERE ${whereSql}
    ORDER BY an.fecha_registro DESC
    LIMIT $${listParams.length - 1} OFFSET $${listParams.length}
  `;

  const result = await pool.query<AnotacionListado>(query, listParams);
  return result.rows;
}

export async function contarAnotacionesPorDocente(
  docenteId: number,
  filtros: ListarAnotacionesQuery
): Promise<number> {
  const { whereSql, params } = buildFiltros(docenteId, filtros);
  const query = `
    SELECT COUNT(*)::int AS total
    FROM anotaciones an
    WHERE ${whereSql}
  `;

  const result = await pool.query<{ total: number }>(query, params);
  return result.rows[0]?.total ?? 0;
}
