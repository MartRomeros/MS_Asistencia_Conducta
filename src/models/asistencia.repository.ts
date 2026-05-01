import pool from "../config/database";

export interface AsistenciaRegistro {
  cad_id: number;
  fecha: string;
  asistencias: {
    estudiante_id: number;
    estado: string;
    tipo_asistencia: string;
  }[];
}

export async function saveAsistencia(data: AsistenciaRegistro): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Eliminar asistencia existente para este cad_id y fecha
    const deleteQuery = `
      DELETE FROM asistencia
      WHERE cad_id = $1 AND fecha = $2
    `;
    await client.query(deleteQuery, [data.cad_id, data.fecha]);

    // Insertar la nueva asistencia
    const insertQuery = `
      INSERT INTO asistencia (estudiante_id, cad_id, fecha, estado, tipo_asistencia)
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    for (const asis of data.asistencias) {
      await client.query(insertQuery, [
        asis.estudiante_id,
        data.cad_id,
        data.fecha,
        asis.estado,
        asis.tipo_asistencia
      ]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
