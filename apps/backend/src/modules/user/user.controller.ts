import type { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import {
  type ListUsersQuery,
  ListUsersQuerySchema,
  SetRoleSchema,
  USER_ROLE,
} from "@admin/types";
import * as v from "valibot";
import { ForbiddenException, UnauthorizedException } from "@/lib";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  listUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        req.user.role !== USER_ROLE.ADMIN &&
        req.user.role !== USER_ROLE.SUPER_ADMIN
      ) {
        throw new ForbiddenException({
          message: "You do not have permission to view the user list",
        });
      }
      const query = v.parse(ListUsersQuerySchema, req.query);
      const result = await this.userService.listUsers(query);
      res.success(result);
    } catch (error) {
      next(error);
    }
  };

  setRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = v.parse(SetRoleSchema, req.body);
      const result = await this.userService.setRole(payload, req.user);

      res.success(result);
    } catch (error) {
      next(error);
    }
  };
}
