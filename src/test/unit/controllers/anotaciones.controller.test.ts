import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../../services/anotaciones.service");

import type { Request, Response } from "express";
import * as anotacionesService from "../../../services/anotaciones.service";
import {
  registrarAnotacionHandler,
  listarAnotacionesHandler,
} from "../../../controllers/anotaciones.controller";
import type { JwtPayload } from "../../../services/jwt.service";

function makeRes(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

function makeReq(overrides: Partial<Request> = {}): Request {
  return { body: {}, params: {}, headers: {}, query: {}, ...overrides } as unknown as Request;
}

const docentePayload: JwtPayload = { id: 5, email: "doc@test.com", role: "Docente" };

describe("anotaciones.controller", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("registrarAnotacionHandler", () => {
    it("responde 201 con la anotación creada para el docente autenticado", async () => {
      const anotacion = { anotacion_id: 1, tipo: "positiva" };
      vi.mocked(anotacionesService.registrarAnotacion).mockResolvedValue(anotacion as never);
      const req = makeReq({
        docente: docentePayload,
        body: { estudiante_id: 10, tipo: "positiva", descripcion: "Excelente trabajo" },
      });
      const res = makeRes();

      await registrarAnotacionHandler(req, res);

      expect(anotacionesService.registrarAnotacion).toHaveBeenCalledWith(5, req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Anotacion registrada correctamente",
        data: anotacion,
      });
    });
  });

  describe("listarAnotacionesHandler", () => {
    it("responde 200 con data y meta para el docente autenticado", async () => {
      const resultado = {
        data: [],
        meta: { page: 1, limit: 20, total: 0, total_pages: 1 },
      };
      vi.mocked(anotacionesService.listarAnotaciones).mockResolvedValue(resultado as never);
      const req = makeReq({
        docente: docentePayload,
        query: {},
      });
      const res = makeRes();

      await listarAnotacionesHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: resultado.data,
        meta: resultado.meta,
      });
    });
  });
});
