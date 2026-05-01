import * as asistenciaRepo from "../models/asistencia.repository";
import { AsistenciaRegistro } from "../models/asistencia.repository";

export async function registrarAsistencia(data: AsistenciaRegistro): Promise<void> {
  await asistenciaRepo.saveAsistencia(data);
}
