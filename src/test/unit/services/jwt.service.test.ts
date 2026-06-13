import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

vi.mock("jsonwebtoken");

import jwt from "jsonwebtoken";
import { verifyToken } from "../../../services/jwt.service";

const validPayload = { id: 1, email: "docente@test.com", role: "Docente", iat: 1000, exp: 9999 };

describe("jwt.service — verifyToken", () => {
  const originalSecret = process.env["JWT_SECRET"];

  beforeEach(() => {
    process.env["JWT_SECRET"] = "test-secret";
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env["JWT_SECRET"];
    } else {
      process.env["JWT_SECRET"] = originalSecret;
    }
  });

  it("retorna el payload cuando el token es válido", () => {
    vi.mocked(jwt.verify).mockReturnValue(validPayload as unknown as string);
    const result = verifyToken("valid.token.here");
    expect(result).toMatchObject({ id: 1, email: "docente@test.com", role: "Docente" });
  });

  it("lanza error si JWT_SECRET no está definido en el entorno", () => {
    delete process.env["JWT_SECRET"];
    expect(() => verifyToken("any.token")).toThrow("JWT_SECRET");
  });

  it("propaga el error cuando jwt.verify lanza una excepción", () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error("invalid signature");
    });
    expect(() => verifyToken("bad.token")).toThrow("invalid signature");
  });

  it("lanza error si el payload no cumple el schema (id no es número)", () => {
    vi.mocked(jwt.verify).mockReturnValue(
      { id: "no-es-numero", email: "x@x.com", role: "Docente" } as unknown as string,
    );
    expect(() => verifyToken("token")).toThrow("payload válido");
  });
});
