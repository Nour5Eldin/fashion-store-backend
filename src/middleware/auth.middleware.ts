import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { userRepository } from "../repositories";
import { ApiError } from "../utils/ApiError";
import { UserRole } from "../types/enum";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role:   UserRole;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No token provided.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwt.secret) as {
      userId: string;
      role:   UserRole;
    };
    const user = await userRepository.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized("Account not found or deactivated.");
    }
    req.user = { userId: decoded.userId, role: decoded.role };
    next();

  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized("Invalid or expired token."));
    }
  }
};
export const authorizeAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    next(ApiError.forbidden("Admin access required."));
    return;
  }
  next();
};
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next(); 
    }

    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwt.secret) as {
      userId: string;
      role:   UserRole;
    };

    req.user = { userId: decoded.userId, role: decoded.role };
    next();

  } catch {
    next(); 
  }
};