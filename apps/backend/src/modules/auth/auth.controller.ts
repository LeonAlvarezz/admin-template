import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { AuthService } from "./auth.service";
import {
  ChangePasswordSchema,
  DisableTwoFactorSchema,
  EnableTwoFactorSchema,
  SignInEmailSchema,
  UpdateUserInfoSchema,
  VerifyTotpSchema,
} from "@admin/types";
import * as v from "valibot";
import { UnauthorizedException } from "@/lib";

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signInEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = v.parse(SignInEmailSchema, req.body);
      const headers = fromNodeHeaders(req.headers);
      const { data, cookies } = await this.authService.signInEmail(
        payload,
        headers,
      );
      cookies.forEach((cookie: string) => res.append("Set-Cookie", cookie));
      res.success(data);
    } catch (error) {
      next(error);
    }
  };

  logOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = fromNodeHeaders(req.headers);
      const { data, cookies } = await this.authService.logOut(headers);

      cookies.forEach((cookie: string) => res.append("Set-Cookie", cookie));

      res.success(data);
    } catch (error) {
      next(error);
    }
  };

  getSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = fromNodeHeaders(req.headers);
      const result = await this.authService.getSession(headers);
      if (!result) throw new UnauthorizedException();
      res.success(result);
    } catch (error) {
      next(error);
    }
  };

  updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = fromNodeHeaders(req.headers);
      const payload = v.parse(UpdateUserInfoSchema, req.body);
      const result = await this.authService.updateUserInfo(payload, headers);
      if (!result) throw new UnauthorizedException();
      res.success(result);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = fromNodeHeaders(req.headers);
      const payload = v.parse(ChangePasswordSchema, req.body);
      const result = await this.authService.changePassword(payload, headers);
      if (!result) throw new UnauthorizedException();
      res.success(result);
    } catch (error) {
      next(error);
    }
  };

  enableTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = fromNodeHeaders(req.headers);
      const payload = v.parse(EnableTwoFactorSchema, req.body);
      const result = await this.authService.enableTwoFactor(payload, headers);
      if (!result) throw new UnauthorizedException();
      res.success(result);
    } catch (error) {
      next(error);
    }
  };

  verifyTOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = fromNodeHeaders(req.headers);
      const payload = v.parse(VerifyTotpSchema, req.body);
      const result = await this.authService.verifyTOTP(payload, headers);
      if (!result) throw new UnauthorizedException();
      res.success(result);
    } catch (error) {
      next(error);
    }
  };

  disableTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = fromNodeHeaders(req.headers);
      const payload = v.parse(DisableTwoFactorSchema, req.body);
      const result = await this.authService.disableTwoFactor(payload, headers);
      if (!result) throw new UnauthorizedException();
      res.success(result);
    } catch (error) {
      next(error);
    }
  };
}
