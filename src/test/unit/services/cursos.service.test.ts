import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../../models/cursos.repository");

import * as cursosRepo from "../../../models/cursos.repository";
import { getCursosParaDocente, getAlumnosDelCurso } from "../../../services/cursos.service";

const cursoDummy: cursosRepo.Curso = {
  curso_id: 1,
  nivel: "1° Medio",
  letra: "A",
  anio_academico: 2026,
  asignatura_id: 3,
  asignatura_nombre: "Matemáticas",
  asignatura_siglas: "MAT",
  cad_id: 10,
};

const alumnoDummy: cursosRepo.Alumno = {
  estudiante_id: 20,
  rut: "12345678-9",
  nombre: "Juan",
  apellido_paterno: "Pérez",
  apellido_materno: null,
  email: "juan@test.com",
};

describe("cursos.service", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("getCursosParaDocente", () => {
    it("retorna los cursos del docente desde el repositorio", async () => {
      vi.mocked(cursosRepo.getCursosByDocente).mockResolvedValue([cursoDummy]);
      const result = await getCursosParaDocente(5);
      expect(cursosRepo.getCursosByDocente).toHaveBeenCalledWith(5);
      expect(result).toEqual([cursoDummy]);
    });
  });

  describe("getAlumnosDelCurso", () => {
    it("retorna los alumnos del curso desde el repositorio", async () => {
      vi.mocked(cursosRepo.getAlumnosByCurso).mockResolvedValue([alumnoDummy]);
      const result = await getAlumnosDelCurso(1);
      expect(cursosRepo.getAlumnosByCurso).toHaveBeenCalledWith(1);
      expect(result).toEqual([alumnoDummy]);
    });
  });
});
