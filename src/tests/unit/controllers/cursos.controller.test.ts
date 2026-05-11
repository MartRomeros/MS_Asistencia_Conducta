import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { getAlumnosCurso, getCursosDocente } from "../../../controllers/cursos.controller";
import { verifyToken } from "../../../services/jwt.service";
import * as cursosService from "../../../services/cursos.service";

vi.mock("../../../services/jwt.service", () => ({
  verifyToken: vi.fn(),
}));

vi.mock("../../../services/cursos.service", () => ({
  getCursosParaDocente: vi.fn(),
  getAlumnosDelCurso: vi.fn(),
}));

function createRes(): Response {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("cursos controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 401 si falta token en getCursosDocente", async () => {
    const req = { headers: {} } as Request;
    const res = createRes();

    await getCursosDocente(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("retorna 403 si rol no es Docente en getCursosDocente", async () => {
    vi.mocked(verifyToken).mockReturnValue({
      id: 1,
      email: "a@b.com",
      role: "Apoderado",
    });
    const req = { headers: { authorization: "Bearer token" } } as Request;
    const res = createRes();

    await getCursosDocente(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("retorna 400 si id de curso es invalido", async () => {
    vi.mocked(verifyToken).mockReturnValue({
      id: 1,
      email: "docente@colegio.cl",
      role: "Docente",
    });
    const req = {
      headers: { authorization: "Bearer token" },
      params: { id: "abc" },
    } as unknown as Request;
    const res = createRes();

    await getAlumnosCurso(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(cursosService.getAlumnosDelCurso).not.toHaveBeenCalled();
  });

  it("retorna 200 y alumnos cuando token y curso id son validos", async () => {
    vi.mocked(verifyToken).mockReturnValue({
      id: 1,
      email: "docente@colegio.cl",
      role: "Docente",
    });
    vi.mocked(cursosService.getAlumnosDelCurso).mockResolvedValue([
      {
        estudiante_id: 10,
        rut: "11.111.111-1",
        nombre: "Ana",
        apellido_paterno: "Perez",
        apellido_materno: null,
        email: "ana@alumnos.cl",
      },
    ]);
    const req = {
      headers: { authorization: "Bearer token" },
      params: { id: "12" },
    } as unknown as Request;
    const res = createRes();

    await getAlumnosCurso(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(cursosService.getAlumnosDelCurso).toHaveBeenCalledWith(12);
  });
});
