import type { UserProfile } from "../types";
import type { AuthStrategy } from "./type";

export interface TokenStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export interface JwtStrategyOptions {
  meEndpoint?: string;
  loginEndpoint?: string;
  logoutEndpoint?: string;
  refreshEndpoint?: string;
  tokenKey?: string;
  storage?: TokenStorage;
}

export class JwtAuthStrategy implements AuthStrategy {
  type = "jwt" as const;
  private token: string | null = null;
  private meEndpoint: string;
  private loginEndpoint: string;
  private logoutEndpoint: string;
  private refreshEndpoint?: string;
  private tokenKey: string;
  private storage?: TokenStorage;

  constructor(options: JwtStrategyOptions = {}) {
    this.meEndpoint = options.meEndpoint ?? "/api/auth/me";
    this.loginEndpoint = options.loginEndpoint ?? "/api/auth/login";
    this.logoutEndpoint = options.logoutEndpoint ?? "/api/auth/logout";
    this.refreshEndpoint = options.refreshEndpoint ?? "/api/auth/refresh";
    this.tokenKey = options.tokenKey ?? "auth_token";
    this.storage = options.storage ?? (typeof window !== "undefined" ? localStorage : undefined);

    if (this.storage) {
      this.token = this.storage.getItem(this.tokenKey);
    }
  }

  setToken(token: string | null): void {
    this.token = token;
    if (this.storage) {
      if (token) {
        this.storage.setItem(this.tokenKey, token);
      } else {
        this.storage.removeItem(this.tokenKey);
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async initialize(): Promise<UserProfile | null> {
    if (!this.token && this.refreshEndpoint) {
      try {
        const refreshRes = await fetch(this.refreshEndpoint, {
          method: "POST",
          credentials: "include",
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          if (data.token) {
            this.setToken(data.token);
          }
        }
      } catch {
        // Refresh failed
      }
    }

    if (!this.token) return null;

    try {
      const response = await fetch(this.meEndpoint, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
        }
        return null;
      }

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
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to log in");
    }

    const data = await response.json();
    const token = data.token ?? data.accessToken;
    if (token) {
      this.setToken(token);
    }

    return data.user ?? data;
  }

  async logout(): Promise<void> {
    if (this.logoutEndpoint) {
      try {
        await fetch(this.logoutEndpoint, {
          method: "POST",
          headers: this.getAuthHeaders(),
          credentials: "include",
        });
      } catch {
        // Ignore logout error
      }
    }
    this.setToken(null);
  }
}
