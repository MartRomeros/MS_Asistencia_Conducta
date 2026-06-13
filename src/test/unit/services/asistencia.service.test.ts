import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../../models/asistencia.repository");

import * as asistenciaRepo from "../../../models/asistencia.repository";
import {
  registrarAsistencia,
  getResumenAsistenciaAlumno,
} from "../../../services/asistencia.service";

describe("asistencia.service", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("registrarAsistencia", () => {
    it("llama a saveAsistencia con los datos recibidos", async () => {
      vi.mocked(asistenciaRepo.saveAsistencia).mockResolvedValue(undefined);
      const data: asistenciaRepo.AsistenciaRegistro = {
        cad_id: 1,
        fecha: "2026-04-30",
        asistencias: [{ estudiante_id: 10, estado: "Presente", tipo_asistencia: "Presencial" }],
      };
      await registrarAsistencia(data);
      expect(asistenciaRepo.saveAsistencia).toHaveBeenCalledWith(data);
    });
  });

  describe("getResumenAsistenciaAlumno", () => {
    it("retorna el resultado del repositorio", async () => {
      const resumen = [
        {
          asignaturaNombre: "Matemáticas",
          clasesAsistidas: "10",
          clasesAusentes: "2",
          clasesTardanza: "1",
          clasesJustificadas: "0",
        },
      ];
      vi.mocked(asistenciaRepo.getResumenAsistenciaAlumno).mockResolvedValue(resumen);
      const result = await getResumenAsistenciaAlumno(5);
      expect(asistenciaRepo.getResumenAsistenciaAlumno).toHaveBeenCalledWith(5);
      expect(result).toBe(resumen);
    });
  });
});
