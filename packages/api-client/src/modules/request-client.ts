/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FetchResponse,
  RequestClientConfig,
  RequestClientOptions,
} from "./types";
import { InterceptorManager } from "./interceptor";
import { FileDownloader } from "./downloader";
import { FileUploader } from "./uploader";
import { isString, stringifyParams } from "./util";

function getParamsSerializer(
  paramsSerializer: RequestClientOptions["paramsSerializer"],
) {
  if (isString(paramsSerializer)) {
    return (params: any) => stringifyParams(params, paramsSerializer);
  }
  return paramsSerializer;
}

class RequestClient {
  public isRefreshing = false;
  public refreshTokenQueue: ((token: string) => void)[] = [];
  public download: FileDownloader["download"];
  public upload: FileUploader["upload"];

  private options: RequestClientOptions;
  private interceptorManager: InterceptorManager;

  constructor(options: RequestClientOptions = {}) {
    this.options = {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      responseReturn: "raw",
      timeout: 10_000,
      ...options,
    };

    this.interceptorManager = new InterceptorManager();
    this.bindMethods(this);

    const fileUploader = new FileUploader(this);
    this.upload = fileUploader.upload.bind(fileUploader);
    const fileDownloader = new FileDownloader(this);
    this.download = fileDownloader.download.bind(fileDownloader);
  }

  public addRequestInterceptor = (
    interceptor: Parameters<InterceptorManager["addRequestInterceptor"]>[0],
  ) => {
    this.interceptorManager.addRequestInterceptor(interceptor);
  };

  public addResponseInterceptor = (
    interceptor: Parameters<InterceptorManager["addResponseInterceptor"]>[0],
  ) => {
    this.interceptorManager.addResponseInterceptor(interceptor);
  };

  public get<T = any>(url: string, config?: RequestClientConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: RequestClientConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: "POST" });
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: RequestClientConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: "PUT" });
  }

  public delete<T = any>(
    url: string,
    config?: RequestClientConfig,
  ): Promise<T> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }

  public async request<T = any>(
    url: string,
    config: RequestClientConfig = {},
  ): Promise<T> {
    const mergedConfig = {
      ...this.options,
      ...config,
    };

    let fullUrl = url;
    if (mergedConfig.baseURL && !url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = `${mergedConfig.baseURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
    }

    if (mergedConfig.params) {
      const serializer = getParamsSerializer(mergedConfig.paramsSerializer);
      const queryString = typeof serializer === "function"
        ? serializer(mergedConfig.params)
        : stringifyParams(mergedConfig.params);
      if (queryString) {
        fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
      }
    }

    const headers = new Headers();
    if (this.options.headers) {
      Object.entries(this.options.headers).forEach(([k, v]) => {
        if (v !== undefined && v !== null) headers.set(k, String(v));
      });
    }
    if (config.headers) {
      const configHeaders = config.headers as any;
      if (configHeaders instanceof Headers) {
        configHeaders.forEach((v, k) => headers.set(k, v));
      } else if (typeof configHeaders === "object") {
        Object.entries(configHeaders).forEach(([k, v]) => {
          if (v !== undefined && v !== null) headers.set(k, String(v));
        });
      }
    }

    let requestCtx: RequestClientConfig & { url: string; headers: Headers } = {
      ...mergedConfig,
      url: fullUrl,
      headers,
    };

    for (const interceptor of this.interceptorManager.requestInterceptors) {
      if (interceptor.fulfilled) {
        try {
          requestCtx = await interceptor.fulfilled(requestCtx);
        } catch (err) {
          if (interceptor.rejected) {
            await interceptor.rejected(err);
          }
          throw err;
        }
      }
    }

    let body: BodyInit | undefined = undefined;
    if (requestCtx.data !== undefined && requestCtx.data !== null) {
      if (
        requestCtx.data instanceof FormData ||
        requestCtx.data instanceof Blob ||
        requestCtx.data instanceof URLSearchParams
      ) {
        body = requestCtx.data;
        if (requestCtx.data instanceof FormData) {
          requestCtx.headers.delete("Content-Type");
        }
      } else if (typeof requestCtx.data === "string") {
        body = requestCtx.data;
      } else {
        body = JSON.stringify(requestCtx.data);
      }
    }

    const controller = new AbortController();
    const timeoutId = requestCtx.timeout
      ? setTimeout(() => controller.abort(), requestCtx.timeout)
      : null;

    try {
      const fetchResponse = await fetch(requestCtx.url, {
        method: requestCtx.method || "GET",
        headers: requestCtx.headers,
        body,
        credentials: requestCtx.credentials,
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      let responseData: any;
      const contentType = fetchResponse.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        responseData = await fetchResponse.json().catch(() => ({}));
      } else if (requestCtx.responseType === "blob") {
        responseData = await fetchResponse.blob();
      } else {
        responseData = await fetchResponse.text();
      }

      let formattedResponse: FetchResponse<T> = {
        data: responseData,
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: fetchResponse.headers,
        config: requestCtx,
        ok: fetchResponse.ok,
      };

      for (const interceptor of this.interceptorManager.responseInterceptors) {
        if (interceptor.fulfilled) {
          try {
            formattedResponse = await interceptor.fulfilled(formattedResponse);
          } catch (err) {
            if (interceptor.rejected) {
              return await interceptor.rejected(err);
            }
            throw err;
          }
        }
      }

      if (!formattedResponse.ok) {
        const errorObj = {
          config: requestCtx,
          response: {
            status: fetchResponse.status,
            statusText: fetchResponse.statusText,
            data: responseData,
            headers: fetchResponse.headers,
          },
          message: `Request failed with status code ${fetchResponse.status}`,
        };

        for (const interceptor of this.interceptorManager.responseInterceptors) {
          if (interceptor.rejected) {
            return await interceptor.rejected(errorObj);
          }
        }
        throw errorObj;
      }

      return formattedResponse as unknown as T;
    } catch (error: any) {
      if (timeoutId) clearTimeout(timeoutId);
      const errorObj = error.response ? error : {
        config: requestCtx,
        message: error.name === "AbortError" ? "Request timeout" : error.message,
        response: undefined,
      };

      for (const interceptor of this.interceptorManager.responseInterceptors) {
        if (interceptor.rejected) {
          return await interceptor.rejected(errorObj);
        }
      }
      throw errorObj;
    }
  }

  private bindMethods<T extends object>(instance: T): void {
    const prototype = Object.getPrototypeOf(instance);
    const propertyNames = Object.getOwnPropertyNames(prototype);

    propertyNames.forEach((propertyName) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        prototype,
        propertyName,
      );
      const propertyValue = instance[propertyName as keyof T];

      if (
        typeof propertyValue === "function" &&
        propertyName !== "constructor" &&
        descriptor &&
        !descriptor.get &&
        !descriptor.set
      ) {
        instance[propertyName as keyof T] = propertyValue.bind(instance);
      }
    });
  }
}

export { RequestClient };
