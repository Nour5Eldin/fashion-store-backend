import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(env.isDev && { stack: err.stack }),
    });
    return;
  }
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0];
    res.status(400).json({
      success: false,
      message: `${field} is already in use.`,
    });
    return;
  }

  if (err.name === "ValidationError") {
    const errors = Object.values((err as any).errors).map((e: any) => ({
      field:   e.path,
      message: e.message,
    }));
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
    return;
  }
  if (err.name === "CastError") {
    res.status(400).json({
      success: false,
      message: "Invalid ID format.",
    });
    return;
  }

  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token has expired.",
    });
    return;
  }

  if (env.isDev) console.error("🔥 Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
    ...(env.isDev && { stack: err.stack }),
  });
};