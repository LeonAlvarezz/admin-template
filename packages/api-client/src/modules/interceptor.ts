/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FetchResponse,
  RequestInterceptorConfig,
  ResponseInterceptorConfig,
} from "./types";

const defaultRequestInterceptorConfig: RequestInterceptorConfig = {
  fulfilled: (config) => config,
  rejected: (error) => Promise.reject(error),
};

const defaultResponseInterceptorConfig: ResponseInterceptorConfig = {
  fulfilled: (response: FetchResponse) => response,
  rejected: (error) => Promise.reject(error),
};

class InterceptorManager {
  public requestInterceptors: RequestInterceptorConfig[] = [];
  public responseInterceptors: ResponseInterceptorConfig[] = [];

  addRequestInterceptor(interceptor: RequestInterceptorConfig = defaultRequestInterceptorConfig) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor<T = any>(interceptor: ResponseInterceptorConfig<T> = defaultResponseInterceptorConfig) {
    this.responseInterceptors.push(interceptor);
  }
}

export { InterceptorManager };
