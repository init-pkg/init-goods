import { ZodObject, ZodRawShape } from "zod";

export interface NeoApiConfig extends Omit<RequestInit, "method"> {
  debug?: boolean;
}

export interface RequestConfig extends NeoApiConfig {
  schema?: ZodObject<ZodRawShape>;
}

export type RequestInterceptor = (
  config: NeoApiConfig
) => Promise<NeoApiConfig>;

export type ResponseInterceptor<T = unknown> = (
  onFulfiled: () => PromiseFulfilledResult<T>,
  onReject: () => PromiseRejectedResult
) => unknown;
