import { describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../../services/jwt.service";

describe("jwt service", () => {
  it("lanza error si JWT_SECRET no esta definido", () => {
    const previous = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    expect(() => verifyToken("token-cualquiera")).toThrow(
      "JWT_SECRET no está definido en las variables de entorno"
    );

    process.env.JWT_SECRET = previous;
  });

  it("lanza error si payload no cumple el esquema", () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign({ id: "abc", role: "Docente" }, process.env.JWT_SECRET);

    expect(() => verifyToken(token)).toThrow(
      "El token no contiene un payload válido para un docente"
    );
  });

  it("retorna payload cuando token es valido", () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jwt.sign(
      { id: 15, email: "docente@colegio.cl", role: "Docente" },
      process.env.JWT_SECRET
    );

    const payload = verifyToken(token);

    expect(payload.id).toBe(15);
    expect(payload.role).toBe("Docente");
  });
});
