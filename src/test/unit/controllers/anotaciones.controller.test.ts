import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../../services/anotaciones.service");
vi.mock("../../../services/jwt.service");

import type { Request, Response } from "express";
import * as anotacionesService from "../../../services/anotaciones.service";
import * as jwtService from "../../../services/jwt.service";
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
    it("responde 201 con la anotación creada cuando el token es válido", async () => {
      vi.mocked(jwtService.verifyToken).mockReturnValue(docentePayload);
      const anotacion = { anotacion_id: 1, tipo: "positiva" };
      vi.mocked(anotacionesService.registrarAnotacion).mockResolvedValue(anotacion as never);
      const req = makeReq({
        headers: { authorization: "Bearer valid.token" },
        body: { estudiante_id: 10, tipo: "positiva", descripcion: "Excelente trabajo" },
      });
      const res = makeRes();

      await registrarAnotacionHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Anotacion registrada correctamente",
        data: anotacion,
      });
    });

    it("lanza error con status 401 cuando no hay header de autorización", async () => {
      const req = makeReq({ headers: {} });
      const res = makeRes();

      await expect(registrarAnotacionHandler(req, res)).rejects.toMatchObject({ status: 401 });
    });

    it("lanza error con status 403 cuando el role no es Docente", async () => {
      vi.mocked(jwtService.verifyToken).mockReturnValue({
        id: 1,
        email: "est@test.com",
        role: "Estudiante",
      });
      const req = makeReq({ headers: { authorization: "Bearer token" } });
      const res = makeRes();

      await expect(registrarAnotacionHandler(req, res)).rejects.toMatchObject({ status: 403 });
    });
  });

  describe("listarAnotacionesHandler", () => {
    it("responde 200 con data y meta cuando el token es válido", async () => {
      vi.mocked(jwtService.verifyToken).mockReturnValue(docentePayload);
      const resultado = {
        data: [],
        meta: { page: 1, limit: 20, total: 0, total_pages: 1 },
      };
      vi.mocked(anotacionesService.listarAnotaciones).mockResolvedValue(resultado as never);
      const req = makeReq({
        headers: { authorization: "Bearer valid.token" },
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

    it("lanza error con status 401 cuando no hay header de autorización", async () => {
      const req = makeReq({ headers: {} });
      const res = makeRes();

      await expect(listarAnotacionesHandler(req, res)).rejects.toMatchObject({ status: 401 });
    });
  });
});
