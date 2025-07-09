import { AxiosHttpClient } from './AxiosHttpClient';
import { IHttpClient } from './IHttpClient';
import { SmsService } from './services/SmsService';
import { ReportService } from './services/ReportService';
import { SenderService } from './services/SenderService';
import { AccountService } from './services/AccountService';
import { SmsConfig } from './models/SmsConfig';

export class AyyildizClient {
  private readonly httpClient: IHttpClient;
  private readonly username: string;
  private readonly password: string;
  private readonly companyCode: string;
  private readonly defaultOriginator?: string;

  constructor(_config: SmsConfig);
  constructor(username: string, password: string, companyCode: string, defaultOriginator?: string);
  constructor(
    configOrUsername: SmsConfig | string,
    password?: string,
    companyCode?: string,
    defaultOriginator?: string
  ) {
    if (typeof configOrUsername === 'object') {
      this.username = configOrUsername.username;
      this.password = configOrUsername.password;
      this.companyCode = configOrUsername.companyCode;
      this.defaultOriginator = configOrUsername.defaultOriginator;
    } else {
      this.username = configOrUsername;
      this.password = password!;
      this.companyCode = companyCode!;
      this.defaultOriginator = defaultOriginator;
    }

    this.httpClient = new AxiosHttpClient();
  }

  /**
   * SMS operations
   */
  public sms(): SmsService {
    return new SmsService(
      this.httpClient,
      this.username,
      this.password,
      this.companyCode,
      this.defaultOriginator
    );
  }

  /**
   * Report operations
   */
  public reports(): ReportService {
    return new ReportService(this.httpClient, this.username, this.password, this.companyCode);
  }

  /**
   * Sender/Originator operations
   */
  public senders(): SenderService {
    return new SenderService(this.httpClient, this.username, this.password, this.companyCode);
  }

  /**
   * Account operations
   */
  public account(): AccountService {
    return new AccountService(this.httpClient, this.username, this.password, this.companyCode);
  }

  /**
   * Get debug information about the last request and response
   */
  public debug(): string {
    return JSON.stringify(
      {
        payload: this.httpClient.getPayload(),
        response: this.httpClient.getBody(),
        status: this.httpClient.getStatusCode()
      },
      null,
      2
    );
  }
}
