import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../../app";

const describeSocket =
  process.env.RUN_SOCKET_TESTS === "true" ? describe : describe.skip;

describeSocket("anotaciones routes", () => {
  it("POST /api/anotaciones retorna 401 sin token", async () => {
    const res = await request(app).post("/api/anotaciones").send({
      estudiante_id: 100,
      tipo: "negativa",
      descripcion: "Descripcion valida para anotacion.",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/anotaciones retorna 401 sin token", async () => {
    const res = await request(app).get("/api/anotaciones");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
