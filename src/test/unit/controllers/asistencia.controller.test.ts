import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../../services/asistencia.service");

import type { Request, Response } from "express";
import * as asistenciaService from "../../../services/asistencia.service";
import {
  registrarAsistenciaHandler,
  getResumenAsistenciaAlumnoHandler,
} from "../../../controllers/asistencia.controller";

function makeRes(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

function makeReq(overrides: Partial<Request> = {}): Request {
  return { body: {}, params: {}, headers: {}, query: {}, ...overrides } as unknown as Request;
}

describe("asistencia.controller", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("registrarAsistenciaHandler", () => {
    it("llama al service con req.body y responde 200", async () => {
      vi.mocked(asistenciaService.registrarAsistencia).mockResolvedValue(undefined);
      const reqBody = { cad_id: 1, fecha: "2026-04-30", asistencias: [] };
      const req = makeReq({ body: reqBody });
      const res = makeRes();

      await registrarAsistenciaHandler(req, res);

      expect(asistenciaService.registrarAsistencia).toHaveBeenCalledWith(reqBody);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Asistencia registrada correctamente",
      });
    });
  });

  describe("getResumenAsistenciaAlumnoHandler", () => {
    it("parsea el param como Number y responde 200 con el resumen", async () => {
      const resumen = [{ asignaturaNombre: "Matemáticas", clasesAsistidas: "10" }];
      vi.mocked(asistenciaService.getResumenAsistenciaAlumno).mockResolvedValue(resumen);
      const req = makeReq({ params: { estudiante_id: "7" } });
      const res = makeRes();

      await getResumenAsistenciaAlumnoHandler(req, res);

      expect(asistenciaService.getResumenAsistenciaAlumno).toHaveBeenCalledWith(7);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: resumen });
    });
  });
});
