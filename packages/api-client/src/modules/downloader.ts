import type { RequestClient } from "./request-client";
import type { RequestClientConfig } from "./types";

type DownloadRequestConfig = {
  responseReturn?: "body" | "raw";
} & Omit<RequestClientConfig, "responseReturn">;

class FileDownloader {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async download<T = Blob>(
    url: string,
    config?: DownloadRequestConfig
  ): Promise<T> {
    const finalConfig: DownloadRequestConfig = {
      responseReturn: "body",
      ...config,
    };

    const response = await this.client.get<T>(url, finalConfig);
    return response;
  }
}

export { FileDownloader };
