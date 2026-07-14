import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../../services/jwt.service");

import type { Request, Response, NextFunction } from "express";
import * as jwtService from "../../../services/jwt.service";
import { authenticate, requireRole } from "../../../middlewares/auth.middleware";
import type { JwtPayload } from "../../../services/jwt.service";

function makeRes(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

function makeReq(overrides: Partial<Request> = {}): Request {
  return { headers: {}, ...overrides } as unknown as Request;
}

const docentePayload: JwtPayload = { id: 5, email: "doc@test.com", role: "Docente" };

describe("auth.middleware — authenticate", () => {
  beforeEach(() => vi.clearAllMocks());

  it("responde 401 cuando no hay header de autorización", () => {
    const req = makeReq();
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Token de autorización requerido" }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("responde 401 cuando el header no tiene el prefijo Bearer", () => {
    const req = makeReq({ headers: { authorization: "Token abc" } });
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("adjunta el payload a req.docente y llama next() cuando el token es válido", () => {
    vi.mocked(jwtService.verifyToken).mockReturnValue(docentePayload);
    const req = makeReq({ headers: { authorization: "Bearer valid.token" } });
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next as NextFunction);

    expect(jwtService.verifyToken).toHaveBeenCalledWith("valid.token");
    expect(req.docente).toEqual(docentePayload);
    expect(next).toHaveBeenCalledWith();
  });

  it("propaga el error a next() con status 401 cuando verifyToken lanza un error genérico", () => {
    vi.mocked(jwtService.verifyToken).mockImplementation(() => {
      throw new Error("El token no contiene un payload válido para un docente");
    });
    const req = makeReq({ headers: { authorization: "Bearer bad.token" } });
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next as NextFunction);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
  });

  it("preserva el status del error si verifyToken ya lo definió", () => {
    const customError = Object.assign(new Error("Token expirado"), { status: 401, name: "TokenExpiredError" });
    vi.mocked(jwtService.verifyToken).mockImplementation(() => {
      throw customError;
    });
    const req = makeReq({ headers: { authorization: "Bearer expired.token" } });
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next as NextFunction);

    expect(next).toHaveBeenCalledWith(customError);
  });
});

describe("auth.middleware — requireRole", () => {
  beforeEach(() => vi.clearAllMocks());

  it("responde 403 cuando el role no coincide", () => {
    const req = makeReq({ docente: { id: 1, email: "e@test.com", role: "Estudiante" } });
    const res = makeRes();
    const next = vi.fn();

    requireRole("Docente")(req, res, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("llama next() cuando el role coincide", () => {
    const req = makeReq({ docente: docentePayload });
    const res = makeRes();
    const next = vi.fn();

    requireRole("Docente")(req, res, next as NextFunction);

    expect(next).toHaveBeenCalledWith();
  });
});
