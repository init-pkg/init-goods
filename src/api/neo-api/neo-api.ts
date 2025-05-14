import { z } from "zod";
import {
  NeoApiConfig,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from "./types";

// class JsonResponse<T extends object> {
//   data: T;
//   ok: boolean;

//   constructor(data: Response | T) {
//     if (data instanceof Response) {
//       data.json().then((d) => (this.data = d));

//       return;
//     }

//     this.data = data;
//   }
// }

export class NeoApi {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(
    private baseUrl = "",
    private globalConfig?: NeoApiConfig
  ) {}

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  private processReqConfig(cfg?: NeoApiConfig) {
    let result = { ...this.globalConfig, ...cfg };
    this.requestInterceptors.forEach(
      async (interceptor) => (result = await interceptor(result))
    );
    return result;
  }

  async get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    const cfg = this.processReqConfig(config);

    const res = await fetch(this.baseUrl + url, cfg);

    if (!res.ok) {
      return Promise.reject(res.json());
    }

    const parseRes = config?.schema?.safeParse(res.json());

    if (parseRes?.error) {
      return Promise.reject(res.json());
    }

    return res.json();
  }
}

// const b = new JsonResponse({});

// const a = new NeoApi("", {});

// const sc = z.object({ a: z.string() });

// a.get("/", { schema: sc });
