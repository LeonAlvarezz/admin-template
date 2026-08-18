// Core
export { createRequestClient } from "./request";
export { RequestClient } from "./modules/request-client";
export { InterceptorManager } from "./modules/interceptor";

// Types
export type {
  RequestClientOptions,
  RequestClientConfig,
  ResponseInterceptorConfig,
  RequestInterceptorConfig,
  HttpResponse,
  MakeErrorMessageFn,
  RequestContentType,
  FetchResponse,
} from "./modules/types";

export type {
  ApiErrorCode,
  ApiErrorPayload,
  ApiFail,
  ApiResponse,
  ApiSuccess,
  CustomError,
  DefaultErrorMessageKey,
  ErrorCodeKey,
  ErrorParams,
} from "./modules/api-response";

export {
  DefaultErrorMessage,
  ErrorCode,
  getApiErrorPayload,
  getApiRequestUrl,
  getApiResponseStatus,
  isApiErrorPayload,
  isApiFail,
  isApiSuccess,
  isUnauthorizedApiError,
} from "./modules/api-response";

// Interceptors
export {
  defaultResponseInterceptor,
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
} from "./preset-interceptor";
