export class FetchResponse<T = any> {
  data: T;
  res: Response;
  constructor(data: any, res: Response) {
    this.data = data;
    this.res = res;
  }
}

export class FetchError<T = any> extends Error {
  response: Response;
  data?: T;
  constructor(message: string, response: Response, data?: T) {
    super(
      `${message}\nResponse: ${
        typeof data === "object" ? JSON.stringify(data) : data
      }`
    );
    this.response = response;
    this.data = data;
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}
