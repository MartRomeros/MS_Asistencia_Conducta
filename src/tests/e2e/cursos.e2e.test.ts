import request from "supertest";
import { describe, expect, it } from "vitest";
import { crearDocenteToken } from "../utils/auth";
import app from "../../app";

describe('Cursos E2E Test', () => {

    it('Debe obtener los cursos disponibles segun el docente', async () => {
        const token = crearDocenteToken()
        await request(app)
            .get("/api/docentes/cursos")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
    })

    it('Debe obtener los alumnos de un curso segun el docente', async () => {
        const token = crearDocenteToken()
        await request(app)
            .get("/api/cursos/1/alumnos")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
    })

    it('No debe obtener los cursos si no esta autenticado', async () => { })

})