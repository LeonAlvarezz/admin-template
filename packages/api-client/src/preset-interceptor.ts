import type { RequestClient } from "./modules/request-client";
import type {
  MakeErrorMessageFn,
  ResponseInterceptorConfig,
} from "./modules/types";
import { DefaultErrorMessage } from "./modules/api-response";
import { isFunction } from "./modules/util";

export const defaultResponseInterceptor = ({
  codeField = "code",
  dataField = "data",
  successCode = 0,
}: {
  codeField: string;
  dataField: ((response: unknown) => unknown) | string;
  successCode: ((code: number) => boolean) | number | string;
}): ResponseInterceptorConfig => {
  return {
    fulfilled: (response) => {
      const { config, data: responseData, status } = response;

      if (config.responseReturn === "raw") {
        return response;
      }

      if (status >= 200 && status < 400) {
        if (config.responseReturn === "body") {
          return responseData;
        } else if (
          isFunction(successCode)
            ? successCode(responseData[codeField])
            : responseData[codeField] === successCode
        ) {
          return isFunction(dataField)
            ? dataField(responseData)
            : responseData[dataField];
        }
      }
      throw Object.assign({}, response, { response });
    },
  };
};

export const authenticateResponseInterceptor = ({
  client,
  doReAuthenticate,
  doRefreshToken,
  enableRefreshToken,
  formatToken,
}: {
  client: RequestClient;
  doReAuthenticate: () => Promise<void>;
  doRefreshToken?: () => Promise<string>;
  enableRefreshToken: boolean;
  formatToken: (token: string) => null | string;
}): ResponseInterceptorConfig => {
  return {
    rejected: async (error) => {
      const { config, response } = error;
      if (response?.status !== 401) {
        throw error;
      }
      if (!enableRefreshToken || config?.__isRetryRequest || !doRefreshToken) {
        await doReAuthenticate();
        throw error;
      }
      if (client.isRefreshing) {
        return new Promise((resolve) => {
          client.refreshTokenQueue.push((newToken: string) => {
            const authHeader = formatToken(newToken);
            if (authHeader) {
              config.headers = config.headers || new Headers();
              if (config.headers instanceof Headers) {
                config.headers.set("Authorization", authHeader);
              } else {
                config.headers["Authorization"] = authHeader;
              }
            }
            resolve(client.request(config.url, { ...config }));
          });
        });
      }

      client.isRefreshing = true;
      if (config) config.__isRetryRequest = true;

      try {
        const newToken = await doRefreshToken();
        client.refreshTokenQueue.forEach((callback) => callback(newToken));
        client.refreshTokenQueue = [];
        return client.request(error.config.url, { ...error.config });
      } catch (refreshError) {
        client.refreshTokenQueue.forEach((callback) => callback(""));
        client.refreshTokenQueue = [];
        await doReAuthenticate();
        throw refreshError;
      } finally {
        client.isRefreshing = false;
      }
    },
  };
};

export const errorMessageResponseInterceptor = (
  makeErrorMessage?: MakeErrorMessageFn,
): ResponseInterceptorConfig => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rejected: (error: any) => {
      const err: string = error?.message ?? error?.toString?.() ?? "";
      let errMsg = "";
      if (err.includes("Failed to fetch") || err.includes("Network Error")) {
        errMsg = DefaultErrorMessage.NETWORK_ERROR;
      } else if (err.includes("timeout") || err.includes("AbortError")) {
        errMsg = DefaultErrorMessage.REQUEST_TIMEOUT;
      }
      if (errMsg) {
        makeErrorMessage?.(errMsg, error);
        return Promise.reject(error);
      }

      let errorMessage = "";
      const status = error?.response?.status;

      switch (status) {
        case 400: {
          errorMessage = DefaultErrorMessage.BAD_REQUEST;
          break;
        }
        case 401: {
          errorMessage = DefaultErrorMessage.UNAUTHORIZED;
          break;
        }
        case 403: {
          errorMessage = DefaultErrorMessage.FORBIDDEN;
          break;
        }
        case 404: {
          errorMessage = DefaultErrorMessage.NOT_FOUND;
          break;
        }
        case 408: {
          errorMessage = DefaultErrorMessage.REQUEST_TIMEOUT;
          break;
        }
        default: {
          errorMessage = DefaultErrorMessage.INTERNAL_SERVER;
        }
      }
      makeErrorMessage?.(errorMessage, error);
      return Promise.reject(error);
    },
  };
};
