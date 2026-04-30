import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Middleware global para el manejo de errores.
 * Captura errores de validación de Zod y errores genéricos.
 */
export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  // Manejo de errores de validación de Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Error de validación",
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  // Manejo de errores de JWT
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Token inválido",
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token expirado",
    });
    return;
  }

  // Error por defecto
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(status).json({
    success: false,
    message,
  });
}
