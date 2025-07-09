import axios, { AxiosInstance } from 'axios';
import { IHttpClient } from './IHttpClient';
import { VersionInfo } from './VersionInfo';

export class AxiosHttpClient implements IHttpClient {
  private baseUrl = 'http://sms.ayyildiz.net/';
  private client: AxiosInstance;
  private lastResponseBody: any;
  private lastResponseStatusCode: number = 0;
  private lastPayload: string = '';

  constructor() {
    this.client = axios.create({
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        'User-Agent': `Ayyildiz-Node/${VersionInfo.string()}`
      },
      validateStatus(status) {
        return status < 500;
      }
    });
  }

  public async post(url: string, options: any): Promise<any> {
    const xmlData = this.buildXml(options);
    const response = await this.client.post(`${this.baseUrl}${url}`, xmlData);

    this.lastPayload = xmlData;
    this.lastResponseBody = response.data;
    this.lastResponseStatusCode = response.status;

    return this;
  }

  public async get(url: string, options?: any): Promise<any> {
    const response = await this.client.get(`${this.baseUrl}${url}`, { params: options });

    this.lastPayload = JSON.stringify(options || {});
    this.lastResponseBody = response.data;
    this.lastResponseStatusCode = response.status;

    return this;
  }

  private buildXml(data: any): string {
    if (typeof data === 'string') {
      return data;
    }

    // For XML API calls, data should already be formatted as XML string
    return JSON.stringify(data);
  }

  public getBody(): any {
    return this.lastResponseBody;
  }

  public getStatusCode(): number {
    return this.lastResponseStatusCode;
  }

  public getPayload(): string {
    return this.lastPayload;
  }
}
