import { SmsResponse } from '../responses/SmsResponse';
import { IHttpClient } from '../IHttpClient';
import { VersionInfo } from '../VersionInfo';

export enum SmsType {
  /** 160 character SMS */
  STANDARD = 1,
  /** 918 character SMS */
  LONG = 5,
  /** 70 character Turkish SMS */
  TURKISH_SHORT = 6,
  /** 402 character Turkish SMS */
  TURKISH_LONG = 7,
  /** 155 character Turkish SMS / 894 character Turkish SMS */
  TURKISH_STANDARD = 12,
  /** 402 character International SMS */
  INTERNATIONAL = 13
}

export class SmsService {
  private sendDateTime: string = '';
  private endDateTime: string = '';
  private smsType: SmsType = SmsType.TURKISH_STANDARD;

  constructor(
    private httpClient: IHttpClient,
    private username: string,
    private password: string,
    private companyCode: string,
    private defaultOriginator?: string
  ) {}

  /**
   * Schedule SMS to be sent at specific date/time
   * @param sendDateTime Format: ddmmyyyyhhmm
   */
  public schedule(sendDateTime: string, endDateTime?: string): this {
    this.sendDateTime = sendDateTime;
    if (endDateTime) {
      this.endDateTime = endDateTime;
    }
    return this;
  }

  /**
   * Set SMS type
   * @param type SMS type to use for sending
   */
  public setType(type: SmsType): this {
    this.smsType = type;
    return this;
  }

  /**
   * Send SMS to single or multiple recipients
   * @param recipients Phone number(s) or object with number->message pairs
   * @param message Message text (required if recipients is string or array)
   * @param originator Sender name (3-11 characters, no Turkish chars)
   */
  public async send(
    recipients: string | string[] | Record<string, string>,
    message?: string,
    originator?: string
  ): Promise<SmsResponse> {
    if (Array.isArray(recipients) || typeof recipients === 'string') {
      return this.sendSameMessage(recipients, message!, originator);
    } else {
      return this.sendMultipleMessages(recipients, originator);
    }
  }

  /**
   * Send same message to multiple recipients
   */
  private async sendSameMessage(
    recipients: string | string[],
    message: string,
    originator?: string
  ): Promise<SmsResponse> {
    const numbers = Array.isArray(recipients) ? recipients.join(',') : recipients;
    const senderName = originator || this.defaultOriginator;

    const xmlData = this.buildSingleMessageXml(
      this.username,
      this.password,
      this.companyCode,
      senderName!,
      message,
      numbers,
      this.smsType,
      this.sendDateTime,
      this.endDateTime
    );

    const response = await this.httpClient.post('SendSmsMany.aspx', xmlData);
    return new SmsResponse(response.getBody(), response.getStatusCode());
  }

  /**
   * Send different messages to different recipients
   */
  private async sendMultipleMessages(
    recipients: Record<string, string>,
    originator?: string
  ): Promise<SmsResponse> {
    const senderName = originator || this.defaultOriginator;

    const xmlData = this.buildMultiMessageXml(
      this.username,
      this.password,
      this.companyCode,
      senderName!,
      recipients,
      this.smsType,
      this.sendDateTime,
      this.endDateTime
    );

    const response = await this.httpClient.post('SendSmsMulti.aspx', xmlData);
    return new SmsResponse(response.getBody(), response.getStatusCode());
  }

  /**
   * Send SMS via HTTP GET method
   */
  public async sendViaHttp(
    phoneNumber: string,
    message: string,
    originator?: string,
    tip?: string,
    type?: string
  ): Promise<SmsResponse> {
    const params = {
      user: this.username,
      password: this.password,
      to: phoneNumber,
      text: this.sanitizeMessage(message),
      origin: originator || this.defaultOriginator,
      tip: tip || '',
      type: type || ''
    };

    if (this.httpClient.get) {
      const response = await this.httpClient.get('services/SendSmsGet.aspx', params);
      return new SmsResponse(response.getBody(), response.getStatusCode());
    } else {
      throw new Error('HTTP GET method not supported by this client');
    }
  }

  private buildSingleMessageXml(
    username: string,
    password: string,
    companyCode: string,
    originator: string,
    message: string,
    numbers: string,
    type: SmsType,
    startDate: string,
    endDate: string
  ): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<MainmsgBody>
    <UserName>${this.escapeXml(username)}</UserName>
    <PassWord>${this.escapeXml(password)}</PassWord>
    <CompanyCode>${this.escapeXml(companyCode)}</CompanyCode>
    <Type>${type}</Type>
    <Developer></Developer>
    <Originator><![CDATA[${originator}]]></Originator>
    <Version>ayyildiz-node-${VersionInfo.string()}</Version>
    <Mesgbody><![CDATA[${message}]]></Mesgbody>
    <Numbers>${numbers}</Numbers>
    <SDate>${startDate}</SDate>
    <EDate>${endDate}</EDate>
</MainmsgBody>`;
  }

  private buildMultiMessageXml(
    username: string,
    password: string,
    companyCode: string,
    originator: string,
    recipients: Record<string, string>,
    type: SmsType,
    startDate: string,
    endDate: string
  ): string {
    const messages = Object.entries(recipients)
      .map(
        ([number, message]) => `
                <Message>
                    <Mesgbody><![CDATA[${message}]]></Mesgbody>
                    <Number>${number}</Number>
                    <SDate>${startDate}</SDate>
                    <EDate>${endDate}</EDate>
                </Message>`
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<MainmsgBody>
    <UserName>${this.escapeXml(username)}</UserName>
    <PassWord>${this.escapeXml(password)}</PassWord>
    <CompanyCode>${this.escapeXml(companyCode)}</CompanyCode>
    <Type>${type}</Type>
    <Developer></Developer>
    <Version>ayyildiz-node-${VersionInfo.string()}</Version>
    <Originator><![CDATA[${originator}]]></Originator>
    <Messages>
        ${messages}
    </Messages>
</MainmsgBody>`;
  }

  private sanitizeMessage(message: string): string {
    // Replace Turkish characters for HTTP API
    return message
      .replace(/İ/g, 'I')
      .replace(/ı/g, 'i')
      .replace(/Ğ/g, 'G')
      .replace(/ğ/g, 'g')
      .replace(/Ü/g, 'U')
      .replace(/ü/g, 'u')
      .replace(/Ş/g, 'S')
      .replace(/ş/g, 's')
      .replace(/Ö/g, 'O')
      .replace(/ö/g, 'o')
      .replace(/Ç/g, 'C')
      .replace(/ç/g, 'c');
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
