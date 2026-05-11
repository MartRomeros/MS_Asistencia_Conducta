import { beforeEach, describe, expect, it, vi } from "vitest";
import pool from "../../../config/database";
import { saveAsistencia } from "../../../models/asistencia.repository";

vi.mock("../../../config/database", () => ({
  default: {
    connect: vi.fn(),
  },
}));

describe("asistencia repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hace BEGIN, DELETE, INSERT y COMMIT al guardar asistencia", async () => {
    const client = {
      query: vi.fn(),
      release: vi.fn(),
    };
    vi.mocked(pool.connect).mockResolvedValue(client as any);
    client.query.mockResolvedValue(undefined);

    await saveAsistencia({
      cad_id: 7,
      fecha: "2026-05-10",
      asistencias: [
        { estudiante_id: 1, estado: "Presente", tipo_asistencia: "Presencial" },
        { estudiante_id: 2, estado: "Ausente", tipo_asistencia: "Presencial" },
      ],
    });

    expect(client.query).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(client.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("DELETE FROM asistencia"),
      [7, "2026-05-10"]
    );
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO asistencia"),
      [1, 7, "2026-05-10", "Presente", "Presencial"]
    );
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO asistencia"),
      [2, 7, "2026-05-10", "Ausente", "Presencial"]
    );
    expect(client.query).toHaveBeenLastCalledWith("COMMIT");
    expect(client.release).toHaveBeenCalledTimes(1);
  });

  it("hace ROLLBACK si ocurre error durante insercion", async () => {
    const client = {
      query: vi.fn(),
      release: vi.fn(),
    };
    vi.mocked(pool.connect).mockResolvedValue(client as any);
    client.query
      .mockResolvedValueOnce(undefined) // BEGIN
      .mockResolvedValueOnce(undefined) // DELETE
      .mockRejectedValueOnce(new Error("db error")) // INSERT
      .mockResolvedValueOnce(undefined); // ROLLBACK

    await expect(
      saveAsistencia({
        cad_id: 9,
        fecha: "2026-05-10",
        asistencias: [
          { estudiante_id: 1, estado: "Presente", tipo_asistencia: "Presencial" },
        ],
      })
    ).rejects.toThrow("db error");

    expect(client.query).toHaveBeenCalledWith("ROLLBACK");
    expect(client.release).toHaveBeenCalledTimes(1);
  });
});
