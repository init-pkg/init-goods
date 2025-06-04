import { FetchError, FetchResponse } from "./response";

type RequestInterceptor<T> = (input: T) => T | Promise<T>;

type ResponseInterceptor<T> = (input: T, req: Request) => T | Promise<T>;

interface FetchOptions extends RequestInit {
  baseUrl?: string;
}
export type FetchReturn<T> = Promise<FetchResponse<T>>;

class Fetch {
  private baseUrl: string;
  private requestInterceptor?: RequestInterceptor<RequestInit>;
  private responseInterceptor?: ResponseInterceptor<Response>;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  setRequestInterceptor(interceptor: RequestInterceptor<RequestInit>) {
    this.requestInterceptor = interceptor;
  }

  setResponseInterceptor(interceptor: ResponseInterceptor<Response>) {
    this.responseInterceptor = interceptor;
  }

  private async request<T>(
    url: string,
    options: FetchOptions
  ): Promise<FetchResponse<T>> {
    let reqOptions = { ...options };

    if (this.requestInterceptor) {
      reqOptions = await this.requestInterceptor(reqOptions);
    }

    const req = new Request(`${this.baseUrl}${url}`, reqOptions);

    let res: Response;

    try {
      res = await fetch(req);
    } catch (error) {
      throw new FetchError("Network Error", new Response(), error);
    }

    if (this.responseInterceptor) {
      res = await this.responseInterceptor(res, req);
    }

    let responseData: any;

    if (!res.ok) {
      try {
        responseData = await res.json();
      } catch {
        responseData = await res.text();
      }
      throw new FetchError(
        `Request failed with status ${res.status}`,
        res,
        responseData
      );
    }
    return new FetchResponse(await res.json(), res);
  }

  get<T>(url: string, options?: FetchOptions): FetchReturn<T> {
    return this.request<T>(url, { method: "GET", ...options });
  }

  post<T>(url: string, body?: any, options?: FetchOptions): FetchReturn<T> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
  }

  put<T>(url: string, body?: any, options?: FetchOptions): FetchReturn<T> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
  }

  patch<T>(url: string, body?: any, options?: FetchOptions): FetchReturn<T> {
    return this.request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
  }

  delete<T>(url: string, options?: FetchOptions): FetchReturn<T> {
    return this.request<T>(url, { method: "DELETE", ...options });
  }
}

export default Fetch;
