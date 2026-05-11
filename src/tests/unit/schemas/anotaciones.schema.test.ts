import { describe, expect, it } from "vitest";
import {
  CrearAnotacionBodySchema,
  ListarAnotacionesQuerySchema,
} from "../../../schemas/anotaciones.schema";

describe("anotaciones schema", () => {
  it("acepta body valido", () => {
    const result = CrearAnotacionBodySchema.parse({
      estudiante_id: 10,
      tipo: "negativa",
      descripcion: "Descripcion valida para anotacion.",
    });

    expect(result.estudiante_id).toBe(10);
  });

  it("rechaza body con docente_id extra", () => {
    expect(() =>
      CrearAnotacionBodySchema.parse({
        estudiante_id: 10,
        tipo: "positiva",
        descripcion: "Descripcion valida para anotacion.",
        docente_id: 5,
      }),
    ).toThrow();
  });

  it("rechaza tipo invalido", () => {
    expect(() =>
      CrearAnotacionBodySchema.parse({
        estudiante_id: 10,
        tipo: "disciplinaria",
        descripcion: "Descripcion valida para anotacion.",
      }),
    ).toThrow();
  });

  it("aplica defaults de paginacion", () => {
    const parsed = ListarAnotacionesQuerySchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.limit).toBe(20);
  });

  it("acepta curso_id en filtros", () => {
    const parsed = ListarAnotacionesQuerySchema.parse({
      curso_id: "12",
    });

    expect(parsed.curso_id).toBe(12);
  });

  it("rechaza fecha_desde mayor que fecha_hasta", () => {
    expect(() =>
      ListarAnotacionesQuerySchema.parse({
        fecha_desde: "2026-05-10",
        fecha_hasta: "2026-05-01",
      }),
    ).toThrow();
  });
});
