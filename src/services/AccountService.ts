import { AccountResponse } from '../responses/AccountResponse';
import { IHttpClient } from '../IHttpClient';

export class AccountService {
  constructor(
    private httpClient: IHttpClient,
    private username: string,
    private password: string,
    private companyCode: string
  ) {}

  /**
   * Query SMS credit balance
   */
  public async getCredit(): Promise<AccountResponse> {
    const xmlData = `<?xml version='1.0' encoding='ISO-8859-9'?>
<Main>
    <UserName>${this.escapeXml(this.username)}</UserName>
    <PassWord>${this.escapeXml(this.password)}</PassWord>
    <CompanyCode>${this.escapeXml(this.companyCode)}</CompanyCode>
</Main>`;

    const response = await this.httpClient.post('QueryCredit.aspx', xmlData);
    return new AccountResponse(response.getBody(), response.getStatusCode());
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
