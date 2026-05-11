import { beforeEach, describe, expect, it, vi } from "vitest";
import * as service from "../../../services/anotaciones.service";
import * as repo from "../../../models/anotaciones.repository";

vi.mock("../../../models/anotaciones.repository", () => ({
  existeEstudianteActivo: vi.fn(),
  docentePuedeAnotarEstudiante: vi.fn(),
  crearAnotacion: vi.fn(),
  listarAnotacionesPorDocente: vi.fn(),
  contarAnotacionesPorDocente: vi.fn(),
}));

describe("anotaciones service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lanza 404 si estudiante no existe o inactivo", async () => {
    vi.mocked(repo.existeEstudianteActivo).mockResolvedValue(false);

    await expect(
      service.registrarAnotacion(5, {
        estudiante_id: 100,
        tipo: "negativa",
        descripcion: "Conducta reiterada en clases.",
      }),
    ).rejects.toMatchObject({ status: 404 });
  });

  it("lanza 403 si docente no puede anotar al estudiante", async () => {
    vi.mocked(repo.existeEstudianteActivo).mockResolvedValue(true);
    vi.mocked(repo.docentePuedeAnotarEstudiante).mockResolvedValue(false);

    await expect(
      service.registrarAnotacion(5, {
        estudiante_id: 100,
        tipo: "negativa",
        descripcion: "Conducta reiterada en clases.",
      }),
    ).rejects.toMatchObject({ status: 403 });
  });

  it("registra anotacion cuando validaciones pasan", async () => {
    vi.mocked(repo.existeEstudianteActivo).mockResolvedValue(true);
    vi.mocked(repo.docentePuedeAnotarEstudiante).mockResolvedValue(true);
    vi.mocked(repo.crearAnotacion).mockResolvedValue({
      anotacion_id: 1,
      estudiante_id: 100,
      docente_id: 5,
      tipo: "negativa",
      descripcion: "Conducta reiterada en clases.",
      fecha_registro: "2026-05-10T00:00:00.000Z",
    });

    const result = await service.registrarAnotacion(5, {
      estudiante_id: 100,
      tipo: "negativa",
      descripcion: "Conducta reiterada en clases.",
    });

    expect(result.docente_id).toBe(5);
    expect(repo.crearAnotacion).toHaveBeenCalledWith(
      100,
      5,
      "negativa",
      "Conducta reiterada en clases.",
    );
  });

  it("lista y pagina resultados", async () => {
    vi.mocked(repo.listarAnotacionesPorDocente).mockResolvedValue([]);
    vi.mocked(repo.contarAnotacionesPorDocente).mockResolvedValue(0);

    const result = await service.listarAnotaciones(5, {
      page: 1,
      limit: 20,
    });

    expect(result.meta.total).toBe(0);
    expect(result.meta.total_pages).toBe(1);
  });
});
