import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Esquema de validación para el payload del JWT
const jwtPayloadSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  role: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

/**
 * Verifica y decodifica un JWT usando la clave JWT_SECRET del .env.
 * Utiliza Zod para asegurar la integridad del payload.
 */
export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
  }

  const decoded = jwt.verify(token, secret);
  
  // Validación con Zod
  const result = jwtPayloadSchema.safeParse(decoded);
  
  if (!result.success) {
    throw new Error("El token no contiene un payload válido para un docente");
  }

  return result.data;
}
