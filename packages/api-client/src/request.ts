import { defaultResponseInterceptor } from "./preset-interceptor";
import { RequestClient } from "./modules/request-client";
import type { RequestClientOptions } from "./modules/types";

export function createRequestClient(
  baseURL?: string,
  options?: RequestClientOptions,
) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: "code",
      dataField: "data",
      successCode: 0,
    }),
  );

  return client;
}
