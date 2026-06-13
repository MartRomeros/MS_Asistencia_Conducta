import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../../services/cursos.service");
vi.mock("../../../services/jwt.service");

import type { Request, Response } from "express";
import * as cursosService from "../../../services/cursos.service";
import * as jwtService from "../../../services/jwt.service";
import { getCursosDocente, getAlumnosCurso } from "../../../controllers/cursos.controller";
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

describe("cursos.controller", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("getCursosDocente", () => {
    it("responde 200 con los cursos cuando el token es válido", async () => {
      vi.mocked(jwtService.verifyToken).mockReturnValue(docentePayload);
      const cursos = [{ cad_id: 10, nivel: "1° Medio" }] as never;
      vi.mocked(cursosService.getCursosParaDocente).mockResolvedValue(cursos);
      const req = makeReq({ headers: { authorization: "Bearer valid.token" } });
      const res = makeRes();

      await getCursosDocente(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, docente_id: 5, data: cursos });
    });

    it("responde 401 cuando no hay header de autorización", async () => {
      const req = makeReq({ headers: {} });
      const res = makeRes();

      await getCursosDocente(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: "Token de autorización requerido" }),
      );
    });

    it("responde 403 cuando el role no es Docente", async () => {
      vi.mocked(jwtService.verifyToken).mockReturnValue({
        id: 1,
        email: "est@test.com",
        role: "Estudiante",
      });
      const req = makeReq({ headers: { authorization: "Bearer token" } });
      const res = makeRes();

      await getCursosDocente(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe("getAlumnosCurso", () => {
    it("responde 200 con los alumnos del curso", async () => {
      vi.mocked(jwtService.verifyToken).mockReturnValue(docentePayload);
      const alumnos = [{ estudiante_id: 20 }] as never;
      vi.mocked(cursosService.getAlumnosDelCurso).mockResolvedValue(alumnos);
      const req = makeReq({
        headers: { authorization: "Bearer valid.token" },
        params: { id: "5" },
      });
      const res = makeRes();

      await getAlumnosCurso(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        docente_id: 5,
        curso_id: 5,
        data: alumnos,
      });
    });

    it("responde 401 cuando no hay header de autorización", async () => {
      const req = makeReq({ headers: {} });
      const res = makeRes();

      await getAlumnosCurso(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("responde 400 cuando el id de curso no es numérico", async () => {
      vi.mocked(jwtService.verifyToken).mockReturnValue(docentePayload);
      const req = makeReq({
        headers: { authorization: "Bearer valid.token" },
        params: { id: "abc" },
      });
      const res = makeRes();

      await getAlumnosCurso(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "ID de curso inválido" });
    });
  });
});
