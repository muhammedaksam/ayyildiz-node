export interface IHttpClient {
  post(_url: string, _options: any): Promise<any>;
  get?(_url: string, _options?: any): Promise<any>;
  getBody(): any;
  getStatusCode(): number;
  getPayload(): string;
}
