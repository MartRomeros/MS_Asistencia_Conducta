import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../../models/anotaciones.repository");

import * as repo from "../../../models/anotaciones.repository";
import { registrarAnotacion, listarAnotaciones } from "../../../services/anotaciones.service";
import type { ListarAnotacionesQuery } from "../../../schemas/anotaciones.schema";

const payloadBase = {
  estudiante_id: 10,
  tipo: "positiva" as const,
  descripcion: "Excelente participación en clases",
};

const filtrosBase: ListarAnotacionesQuery = { page: 1, limit: 20 };

describe("anotaciones.service", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("registrarAnotacion", () => {
    it("lanza error 404 si el estudiante no existe o está inactivo", async () => {
      vi.mocked(repo.existeEstudianteActivo).mockResolvedValue(false);
      await expect(registrarAnotacion(1, payloadBase)).rejects.toMatchObject({ status: 404 });
      expect(repo.docentePuedeAnotarEstudiante).not.toHaveBeenCalled();
    });

    it("lanza error 403 si el docente no puede anotar al estudiante", async () => {
      vi.mocked(repo.existeEstudianteActivo).mockResolvedValue(true);
      vi.mocked(repo.docentePuedeAnotarEstudiante).mockResolvedValue(false);
      await expect(registrarAnotacion(1, payloadBase)).rejects.toMatchObject({ status: 403 });
      expect(repo.crearAnotacion).not.toHaveBeenCalled();
    });

    it("crea y retorna la anotación cuando pasan ambas validaciones", async () => {
      const anotacionCreada: repo.AnotacionCreada = {
        anotacion_id: 1,
        estudiante_id: 10,
        docente_id: 1,
        tipo: "positiva",
        descripcion: "Excelente participación en clases",
        fecha_registro: "2026-06-12T00:00:00Z",
      };
      vi.mocked(repo.existeEstudianteActivo).mockResolvedValue(true);
      vi.mocked(repo.docentePuedeAnotarEstudiante).mockResolvedValue(true);
      vi.mocked(repo.crearAnotacion).mockResolvedValue(anotacionCreada);
      const result = await registrarAnotacion(1, payloadBase);
      expect(repo.crearAnotacion).toHaveBeenCalledWith(10, 1, "positiva", "Excelente participación en clases");
      expect(result).toBe(anotacionCreada);
    });
  });

  describe("listarAnotaciones", () => {
    it("retorna data y meta con total_pages calculado", async () => {
      const data = [{ anotacion_id: 1 }] as repo.AnotacionListado[];
      vi.mocked(repo.listarAnotacionesPorDocente).mockResolvedValue(data);
      vi.mocked(repo.contarAnotacionesPorDocente).mockResolvedValue(45);
      const result = await listarAnotaciones(1, filtrosBase);
      expect(result.data).toBe(data);
      expect(result.meta).toEqual({ page: 1, limit: 20, total: 45, total_pages: 3 });
    });

    it("retorna total_pages = 1 cuando total es 0", async () => {
      vi.mocked(repo.listarAnotacionesPorDocente).mockResolvedValue([]);
      vi.mocked(repo.contarAnotacionesPorDocente).mockResolvedValue(0);
      const result = await listarAnotaciones(1, filtrosBase);
      expect(result.meta.total_pages).toBe(1);
    });

    it("llama a ambas queries del repositorio en la misma invocación", async () => {
      vi.mocked(repo.listarAnotacionesPorDocente).mockResolvedValue([]);
      vi.mocked(repo.contarAnotacionesPorDocente).mockResolvedValue(0);
      await listarAnotaciones(2, filtrosBase);
      expect(repo.listarAnotacionesPorDocente).toHaveBeenCalledWith(2, filtrosBase);
      expect(repo.contarAnotacionesPorDocente).toHaveBeenCalledWith(2, filtrosBase);
    });
  });
});
