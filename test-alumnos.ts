import pool from "./src/config/database";

async function test() {
  try {
    const res = await pool.query(`SELECT * FROM estudiantes`);
    console.log("Estudiantes:", res.rows);
    
    const res2 = await pool.query(`SELECT usuario_id, rut, nombre, activo FROM usuarios WHERE rol_id = 3`);
    console.log("Usuarios (Estudiantes):", res2.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();

