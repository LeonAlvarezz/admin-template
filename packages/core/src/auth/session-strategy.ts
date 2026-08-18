import type { UserProfile } from "../types";
import type { AuthStrategy } from "./type";

export interface SessionStrategyOptions {
  meEndpoint?: string;
  loginEndpoint?: string;
  logoutEndpoint?: string;
  csrfHeaderName?: string;
  getCsrfToken?: () => string | null;
}

export class SessionAuthStrategy implements AuthStrategy {
  type = "session" as const;
  private meEndpoint: string;
  private loginEndpoint: string;
  private logoutEndpoint: string;
  private csrfHeaderName: string;
  private getCsrfToken?: () => string | null;

  constructor(options: SessionStrategyOptions = {}) {
    this.meEndpoint = options.meEndpoint ?? "/api/auth/me";
    this.loginEndpoint = options.loginEndpoint ?? "/api/auth/login";
    this.logoutEndpoint = options.logoutEndpoint ?? "/api/auth/logout";
    this.csrfHeaderName = options.csrfHeaderName ?? "X-CSRF-Token";
    this.getCsrfToken = options.getCsrfToken;
  }

  async initialize(): Promise<UserProfile | null> {
    try {
      const response = await fetch(this.meEndpoint, {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) return null;
      const data = await response.json();
      return data.user ?? data;
    } catch {
      return null;
    }
  }

  async login(credentials: Record<string, any>): Promise<UserProfile> {
    const response = await fetch(this.loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to log in");
    }

    const data = await response.json();
    return data.user ?? data;
  }

  async logout(): Promise<void> {
    try {
      await fetch(this.logoutEndpoint, {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });
    } catch {
      // Ignore logout errors
    }
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.getCsrfToken) {
      const token = this.getCsrfToken();
      if (token) {
        headers[this.csrfHeaderName] = token;
      }
    }
    return headers;
  }
}
