import { auth } from "@/lib/auth";
import { UnauthorizedException } from "@/lib";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { USER_ROLE, type User } from "@z3/types";

declare global {
  namespace Express {
    interface Request {
      user: User;
      session?: typeof auth.$Infer.Session.session;
    }
  }
}

type ProtectedRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;

function isUserRole(role: unknown): role is USER_ROLE {
  return Object.values(USER_ROLE).includes(role as USER_ROLE);
}

function protectedRoute(
  handler: ProtectedRouteHandler,
  options?: {
    resource?: string;
    action?: "read" | "write" | "delete";
  },
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        throw new UnauthorizedException();
      }

      if (!isUserRole(session.user.role)) {
        throw new UnauthorizedException();
      }

      req.user = {
        ...session.user,
        role: session.user.role,
      };
      req.session = session.session;

      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default protectedRoute;
