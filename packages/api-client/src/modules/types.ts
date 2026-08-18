/* eslint-disable @typescript-eslint/no-explicit-any */

export type ParamsSerializerFormat =
  | "brackets"
  | "comma"
  | "indices"
  | "repeat"
  | ((params: Record<string, any>) => string);

export interface ExtendOptions {
  paramsSerializer?: ParamsSerializerFormat;
  responseReturn?: "body" | "data" | "raw";
  responseType?: "blob" | "text" | "json";
  timeout?: number;
  params?: Record<string, any>;
  data?: any;
  __isRetryRequest?: boolean;
}

export type RequestClientConfig = Omit<RequestInit, "body"> & ExtendOptions;

export interface FetchResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: RequestClientConfig & { url: string };
  ok: boolean;
}

export type RequestContentType =
  | "application/json;charset=utf-8"
  | "application/octet-stream;charset=utf-8"
  | "application/x-www-form-urlencoded;charset=utf-8"
  | "multipart/form-data;charset=utf-8";

export interface RequestClientOptions extends RequestClientConfig {
  baseURL?: string;
  timeout?: number;
}

export interface RequestInterceptorConfig {
  fulfilled?: (
    config: RequestClientConfig & { url: string; headers: Headers }
  ) =>
    | (RequestClientConfig & { url: string; headers: Headers })
    | Promise<RequestClientConfig & { url: string; headers: Headers }>;
  rejected?: (error: any) => any;
}

export interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (
    response: FetchResponse<T>
  ) => Promise<FetchResponse<T> | any> | FetchResponse<T> | any;
  rejected?: (error: any) => any;
}

export type MakeErrorMessageFn = (message: string, error: any) => void;

export interface HttpResponse<T = any> {
  code: number;
  data: T;
  message: string;
}
