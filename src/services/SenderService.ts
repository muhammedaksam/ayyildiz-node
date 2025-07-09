import { SenderResponse } from '../responses/SenderResponse';
import { IHttpClient } from '../IHttpClient';

export class SenderService {
  constructor(
    private httpClient: IHttpClient,
    private username: string,
    private password: string,
    private companyCode: string
  ) {}

  /**
   * Query available originators/senders
   */
  public async getOriginators(): Promise<SenderResponse> {
    const xmlData = `<?xml version='1.0' encoding='UTF-8'?>
<OriginMain>
    <UserName>${this.escapeXml(this.username)}</UserName>
    <PassWord>${this.escapeXml(this.password)}</PassWord>
    <CompanyCode>${this.escapeXml(this.companyCode)}</CompanyCode>
    <User>User</User>
    <Originator>DENEME</Originator>
</OriginMain>`;

    const response = await this.httpClient.post('QueryOrigin.aspx', xmlData);
    return new SenderResponse(response.getBody(), response.getStatusCode());
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
