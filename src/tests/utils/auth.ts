import jwt from "jsonwebtoken"

export const crearDocenteToken = () => {

    return jwt.sign(
        {
            "id": 2,
            "email": "c.rodriguez@colegio.cl",
            "role": "Docente"
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "2h" }
    )

}