import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../services/jwt.service";

declare global {
  namespace Express {
    interface Request {
      docente?: JwtPayload;
    }
  }
}

/**
 * Middleware global de autenticación.
 * Valida el JWT del header `Authorization: Bearer <token>` en cada petición
 * y adjunta el payload decodificado en `req.docente`.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Token de autorización requerido",
    });
    return;
  }

  const token = authHeader.split(" ")[1] as string;

  try {
    req.docente = verifyToken(token);
    next();
  } catch (error: any) {
    if (!error.status) {
      error.status = 401;
    }
    next(error);
  }
}

/**
 * Middleware de autorización por rol. Debe usarse después de `authenticate`.
 */
export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.docente?.role !== role) {
      res.status(403).json({
        success: false,
        message: "No tienes permisos para acceder a este recurso",
      });
      return;
    }
    next();
  };
}
