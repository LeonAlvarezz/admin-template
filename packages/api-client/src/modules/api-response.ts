export enum ErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INVALID_COOKIE = 420,
  RATE_LIMIT = 429,
  INTERNAL_SERVER = 500,
  INVALID_CREDENTIAL = 401,
}

export enum DefaultErrorMessage {
  BAD_REQUEST = "Bad Request",
  UNAUTHORIZED = "Unauthorized",
  INVALID_CREDENTIAL = "Invalid Credential",
  FORBIDDEN = "Forbidden",
  NOT_FOUND = "Not Found",
  RATE_LIMIT = "Too many requests",
  CONFLICT = "Conflict",
  INTERNAL_SERVER = "Internal Server",
  NETWORK_ERROR = "Network Error",
  REQUEST_TIMEOUT = "Request timeout",
  INVALID_COOKIE = "Invalid Cookie",
  VALIDATION = "Validation Error",
  ENDPOINT_NOT_FOUND = "Endpoint Not Found",
}

export type DefaultErrorMessageKey = keyof typeof DefaultErrorMessage;
export type ErrorCodeKey = keyof typeof ErrorCode;
export type ApiErrorCode = DefaultErrorMessageKey | (string & {});

export type ApiErrorPayload = {
  status?: number;
  code: ApiErrorCode;
  message: string;
  metadata?: Record<string, unknown>;
};

export type ApiSuccess<TData = unknown> = {
  code: number;
  data: TData;
  message?: string;
  success?: true;
};

export type ApiFail<TError extends ApiErrorPayload = ApiErrorPayload> = {
  code?: number;
  data?: never;
  error: TError;
  message?: string;
  success?: false;
};

export type ApiResponse<
  TData = unknown,
  TError extends ApiErrorPayload = ApiErrorPayload,
> = ApiSuccess<TData> | ApiFail<TError>;

export type CustomError = ApiErrorPayload;

export type ErrorParams = {
  error?: unknown;
  message?: string;
  options?: Record<string, unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.message === "string" &&
    (value.status === undefined || typeof value.status === "number")
  );
}

export function isApiFail(value: unknown): value is ApiFail {
  return isRecord(value) && isApiErrorPayload(value.error);
}

export function isApiSuccess<TData = unknown>(
  value: unknown,
): value is ApiSuccess<TData> {
  return (
    isRecord(value) &&
    typeof value.code === "number" &&
    value.code === 0 &&
    "data" in value
  );
}

export function getApiRequestUrl(error: unknown): string | undefined {
  if (!isRecord(error) || !isRecord(error.config)) {
    return undefined;
  }

  return typeof error.config.url === "string" ? error.config.url : undefined;
}

export function getApiResponseStatus(error: unknown): number | undefined {
  if (!isRecord(error) || !isRecord(error.response)) {
    return undefined;
  }

  return typeof error.response.status === "number"
    ? error.response.status
    : undefined;
}

export function getApiErrorPayload(error: unknown): ApiErrorPayload | undefined {
  if (isApiFail(error)) {
    return error.error;
  }

  if (isApiErrorPayload(error)) {
    return error;
  }

  if (!isRecord(error)) {
    return undefined;
  }

  const response = error.response;
  if (!isRecord(response)) {
    return undefined;
  }

  const responseData = response.data;
  if (isApiFail(responseData)) {
    return responseData.error;
  }

  if (isApiErrorPayload(responseData)) {
    return responseData;
  }

  return undefined;
}

export function isUnauthorizedApiError(error: unknown): boolean {
  return (
    getApiResponseStatus(error) === ErrorCode.UNAUTHORIZED ||
    getApiErrorPayload(error)?.code === "UNAUTHORIZED"
  );
}
