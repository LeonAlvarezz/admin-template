type PrimitiveParam = boolean | number | string;
type ParamValue = PrimitiveParam | PrimitiveParam[] | null | undefined;
type Params = Record<string, ParamValue>;

type ParamsSerializerFormat = "brackets" | "comma" | "indices" | "repeat";
type ResponseReturn = "body" | "data" | "raw";
type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export type ApiServiceBinding = {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

export type ApiClientConfig<TData = unknown> = Omit<RequestInit, "method"> & {
  baseURL?: string;
  data?: TData;
  method?: string;
  params?: Params;
  paramsSerializer?: ParamsSerializerFormat | ((params: Params) => string);
  responseReturn?: ResponseReturn;
  timeout?: number;
};

export type ApiClientOptions = ApiClientConfig & {
  defaultApiPath?: string;
  fetcher?: Fetcher;
  serviceBinding?: ApiServiceBinding;
};

export type ApiClientResponse<T = unknown> = {
  config: ApiClientConfig;
  data: T;
  headers: Headers;
  response: Response;
  status: number;
  statusText: string;
  url: string;
};

export type ApiClientRequestInterceptor = (
  config: ApiClientConfig,
) => ApiClientConfig | Promise<ApiClientConfig>;

export type ApiClientResponseInterceptor<T = unknown> = {
  fulfilled?: (
    response: ApiClientResponse<T>,
  ) => ApiClientResponse | Promise<ApiClientResponse>;
  rejected?: (error: unknown) => unknown;
};

export class ApiClientError<T = unknown> extends Error {
  config: ApiClientConfig;
  data: T | null;
  response?: Response;
  status?: number;
  url: string;

  constructor({
    config,
    data,
    message,
    response,
    url,
  }: {
    config: ApiClientConfig;
    data: T | null;
    message: string;
    response?: Response;
    url: string;
  }) {
    super(message);
    this.name = "ApiClientError";
    this.config = config;
    this.data = data;
    this.response = response;
    this.status = response?.status;
    this.url = url;
  }
}

export function isApiClientNotFoundError(error: unknown) {
  return error instanceof ApiClientError && error.status === 404;
}

const BODYLESS_METHODS = new Set(["GET", "HEAD"]);

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//.test(value);
}

function normalizeBaseUrl(baseURL: string, defaultApiPath: string) {
  const absoluteBaseUrl = isAbsoluteUrl(baseURL)
    ? baseURL
    : `https://${baseURL}`;
  const url = new URL(absoluteBaseUrl);
  const basePath = url.pathname.replace(/\/$/, "");
  const apiPath = defaultApiPath.replace(/^\/?/, "/").replace(/\/$/, "");

  if (apiPath && !basePath.endsWith(apiPath)) {
    url.pathname = `${basePath}${apiPath}`;
  }

  return url;
}

function appendParam(
  searchParams: URLSearchParams,
  key: string,
  value: PrimitiveParam,
) {
  searchParams.append(key, String(value));
}

function serializeParams(
  params: Params,
  paramsSerializer: ApiClientConfig["paramsSerializer"] = "repeat",
) {
  if (typeof paramsSerializer === "function") {
    return paramsSerializer(params);
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;

    if (!Array.isArray(value)) {
      appendParam(searchParams, key, value);
      continue;
    }

    if (paramsSerializer === "comma") {
      searchParams.append(key, value.map(String).join(","));
      continue;
    }

    value.forEach((item, index) => {
      if (paramsSerializer === "brackets") {
        appendParam(searchParams, `${key}[]`, item);
      } else if (paramsSerializer === "indices") {
        appendParam(searchParams, `${key}[${index}]`, item);
      } else {
        appendParam(searchParams, key, item);
      }
    });
  }

  return searchParams.toString();
}

function mergeHeaders(
  defaultHeaders: HeadersInit | undefined,
  requestHeaders: HeadersInit | undefined,
) {
  const headers = new Headers(defaultHeaders);
  new Headers(requestHeaders).forEach((value, key) => {
    headers.set(key, value);
  });
  return headers;
}

function mergeSignals(signal?: AbortSignal, timeout?: number) {
  if (!timeout) return { signal };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  signal?.addEventListener(
    "abort",
    () => {
      controller.abort(signal.reason);
    },
    { once: true },
  );

  return {
    signal: controller.signal,
    timeoutId,
  };
}

async function parseResponseBody(response: Response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export class ApiClient {
  private readonly defaultConfig: ApiClientConfig;
  private readonly defaultApiPath: string;
  private readonly fetcher: Fetcher;
  private readonly requestInterceptors: ApiClientRequestInterceptor[] = [];
  private readonly responseInterceptors: ApiClientResponseInterceptor[] = [];
  private readonly serviceBinding?: ApiServiceBinding;

  constructor(options: ApiClientOptions = {}) {
    const {
      defaultApiPath = "/api",
      fetcher,
      serviceBinding,
      ...defaultConfig
    } = options;

    this.defaultApiPath = defaultApiPath;
    this.defaultConfig = {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        ...(import.meta.env.DEV ? { "Cache-Control": "no-cache" } : {}),
      },
      responseReturn: "body",
      timeout: 10_000,
      ...defaultConfig,
    };
    this.fetcher = fetcher ?? ((input, init) => fetch(input, init));
    this.serviceBinding = serviceBinding;
  }

  addRequestInterceptor(interceptor: ApiClientRequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ApiClientResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  delete<T = unknown>(url: string, config?: ApiClientConfig) {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }

  get<T = unknown>(url: string, config?: ApiClientConfig) {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  patch<T = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: ApiClientConfig<TData>,
  ) {
    return this.request<T>(url, { ...config, data, method: "PATCH" });
  }

  post<T = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: ApiClientConfig<TData>,
  ) {
    return this.request<T>(url, { ...config, data, method: "POST" });
  }

  put<T = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: ApiClientConfig<TData>,
  ) {
    return this.request<T>(url, { ...config, data, method: "PUT" });
  }

  async request<T = unknown>(url: string, config: ApiClientConfig = {}) {
    let requestConfig: ApiClientConfig = this.mergeConfig(config);

    for (const interceptor of this.requestInterceptors) {
      requestConfig = await interceptor(requestConfig);
    }

    const requestUrl = this.resolveUrl(url, requestConfig);
    const response = await this.dispatchRequest<T>(requestUrl, requestConfig);
    const interceptedResponse =
      await this.runFulfilledResponseInterceptors(response);

    if (requestConfig.responseReturn === "raw") {
      return interceptedResponse as T;
    }

    if (requestConfig.responseReturn === "data") {
      const data = interceptedResponse.data;
      if (data && typeof data === "object" && "data" in data) {
        return data.data as T;
      }
    }

    return interceptedResponse.data as T;
  }

  private async dispatchRequest<T>(
    url: string,
    config: ApiClientConfig,
  ): Promise<ApiClientResponse<T>> {
    const method = config.method?.toUpperCase() ?? "GET";
    const headers = new Headers(config.headers);
    const timeoutSignal = mergeSignals(
      config.signal ?? undefined,
      config.timeout,
    );
    const { signal, timeoutId } = timeoutSignal;

    try {
      const response = this.serviceBinding
        ? await this.serviceBinding.fetch(
            new Request(
              url,
              this.toRequestInit(config, method, headers, signal),
            ),
          )
        : await this.fetcher(
            url,
            this.toRequestInit(config, method, headers, signal),
          );

      const data = (await parseResponseBody(response)) as T;
      const apiResponse: ApiClientResponse<T> = {
        config,
        data,
        headers: response.headers,
        response,
        status: response.status,
        statusText: response.statusText,
        url,
      };

      if (!response.ok) {
        throw new ApiClientError({
          config,
          data,
          message: `API request failed: ${response.status}`,
          response,
          url,
        });
      }

      return apiResponse;
    } catch (error) {
      throw await this.runRejectedResponseInterceptors(error);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  private mergeConfig(config: ApiClientConfig) {
    return {
      ...this.defaultConfig,
      ...config,
      headers: mergeHeaders(this.defaultConfig.headers, config.headers),
    };
  }

  private resolveUrl(path: string, config: ApiClientConfig) {
    if (isAbsoluteUrl(path)) {
      const url = new URL(path);
      this.applyParams(url, config);
      return url.href;
    }

    if (!config.baseURL) {
      throw new Error(
        "ApiClient baseURL is required for relative request URLs.",
      );
    }

    const url = normalizeBaseUrl(config.baseURL, this.defaultApiPath);
    const basePath = url.pathname.replace(/\/$/, "");
    url.pathname = `${basePath}/${path.replace(/^\//, "")}`;
    this.applyParams(url, config);
    return url.href;
  }

  private applyParams(url: URL, config: ApiClientConfig) {
    if (!config.params) return;

    const search = serializeParams(config.params, config.paramsSerializer);
    if (!search) return;

    const params = new URLSearchParams(url.search);
    new URLSearchParams(search).forEach((value, key) => {
      params.append(key, value);
    });
    url.search = params.toString();
  }

  private toRequestInit(
    config: ApiClientConfig,
    method: string,
    headers: Headers,
    signal?: AbortSignal,
  ): RequestInit {
    const requestInit = { ...config };
    delete requestInit.baseURL;
    delete requestInit.data;
    delete requestInit.params;
    delete requestInit.paramsSerializer;
    delete requestInit.responseReturn;
    delete requestInit.timeout;

    let body = config.body;

    if (
      !BODYLESS_METHODS.has(method) &&
      body === undefined &&
      config.data !== undefined
    ) {
      body =
        config.data instanceof FormData
          ? config.data
          : JSON.stringify(config.data);

      if (config.data instanceof FormData) {
        headers.delete("Content-Type");
      }
    }

    return {
      ...requestInit,
      body,
      headers,
      method,
      signal,
    };
  }

  private async runFulfilledResponseInterceptors<T>(
    response: ApiClientResponse<T>,
  ) {
    let nextResponse: ApiClientResponse = response;

    for (const interceptor of this.responseInterceptors) {
      if (interceptor.fulfilled) {
        nextResponse = await interceptor.fulfilled(nextResponse);
      }
    }

    return nextResponse;
  }

  private async runRejectedResponseInterceptors(error: unknown) {
    let nextError = error;

    for (const interceptor of this.responseInterceptors) {
      if (!interceptor.rejected) continue;

      try {
        await interceptor.rejected(nextError);
      } catch (interceptorError) {
        nextError = interceptorError;
      }
    }

    return nextError;
  }
}

function createApiClient(options?: ApiClientOptions) {
  return new ApiClient(options);
}

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3333",
  defaultApiPath: "/api",
  credentials: "include",
});
