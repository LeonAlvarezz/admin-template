import { auth, ForbiddenException, UnauthorizedException } from "@/lib";
import type {
  ChangePassword,
  DisableTwoFactor,
  EnableTwoFactor,
  SignInEmail,
  SignInEmailResponse,
  UpdateUserInfo,
  VerifyBackupCode,
  VerifyTotp,
} from "@admin/types";

export class AuthService {
  async signInEmail(payload: SignInEmail, headers?: HeadersInit) {
    const response = await auth.api.signInEmail({
      body: payload,
      asResponse: true,
      ...(headers ? { headers } : {}),
    });

    if (!response.ok)
      throw new UnauthorizedException({
        message: "Invalid Credential",
      });

    const data = (await response.json()) as SignInEmailResponse;
    const cookies = response.headers.getSetCookie();

    return { data, cookies };
  }

  async logOut(headers: HeadersInit) {
    const response = await auth.api.signOut({
      headers,
      asResponse: true,
    });

    const data = await response.json();
    const cookies = response.headers.getSetCookie();

    return { data, cookies };
  }

  async getSession(headers: HeadersInit) {
    return await auth.api.getSession({
      headers,
    });
  }

  async updateUserInfo(payload: UpdateUserInfo, headers: HeadersInit) {
    return await auth.api.updateUser({
      body: payload,
      headers,
    });
  }

  async changePassword(payload: ChangePassword, headers: HeadersInit) {
    return await auth.api.changePassword({
      body: payload,
      headers,
    });
  }

  async enableTwoFactor(payload: EnableTwoFactor, headers: HeadersInit) {
    return await auth.api.enableTwoFactor({
      body: payload,
      headers,
    });
  }

  async verifyTOTP(payload: VerifyTotp, headers: HeadersInit) {
    const response = await auth.api.verifyTOTP({
      body: payload,
      headers,
      asResponse: true,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new UnauthorizedException({
        message: err.message || "Invalid verification code",
      });
    }

    const data = await response.json();
    const cookies = response.headers.getSetCookie();

    return { data, cookies };
  }

  async verifyBackupCode(payload: VerifyBackupCode, headers: HeadersInit) {
    const response = await auth.api.verifyBackupCode({
      body: payload,
      headers,
      asResponse: true,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new UnauthorizedException({
        message: err.message || "Invalid backup code",
      });
    }

    const data = await response.json();
    const cookies = response.headers.getSetCookie();

    return { data, cookies };
  }

  async disableTwoFactor(payload: DisableTwoFactor, headers: HeadersInit) {
    const response = await auth.api.disableTwoFactor({
      body: payload,
      headers,
      asResponse: true,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new UnauthorizedException({
        message: err.message || "Failed to disable two-factor authentication",
      });
    }

    const data = await response.json();
    const cookies = response.headers.getSetCookie();

    return { data, cookies };
  }
}
