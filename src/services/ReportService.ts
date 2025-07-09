import { ReportResponse } from '../responses/ReportResponse';
import { IHttpClient } from '../IHttpClient';

export class ReportService {
  constructor(
    private httpClient: IHttpClient,
    private username: string,
    private password: string,
    private companyCode: string
  ) {}

  /**
   * Get reports by date range
   * @param startDate Format: YYYYMMDD
   * @param endDate Format: YYYYMMDD
   * @param delimiter Delimiter for parsing response (default: ||)
   */
  public async getByDateRange(
    startDate: string,
    endDate: string,
    delimiter: string = '||'
  ): Promise<ReportResponse> {
    const xmlData = `<?xml version='1.0' encoding='ISO-8859-9'?>
<MainmsgBody>
    <UserName>${this.escapeXml(this.username)}</UserName>
    <PassWord>${this.escapeXml(this.password)}</PassWord>
    <CompanyCode>${this.escapeXml(this.companyCode)}</CompanyCode>
    <Delm>${this.escapeXml(delimiter)}</Delm>
    <SDate>${startDate}</SDate>
    <EDate>${endDate}</EDate>
    <Type>2</Type>
</MainmsgBody>`;

    const response = await this.httpClient.post('ReportList.aspx', xmlData);
    return new ReportResponse(response.getBody(), response.getStatusCode());
  }

  /**
   * Get detailed report by message GUID
   * @param messageGuid Message GUID from report list
   * @param delimiter Delimiter for parsing response (default: ||)
   */
  public async getDetailedReport(
    messageGuid: string,
    delimiter: string = '||'
  ): Promise<ReportResponse> {
    const xmlData = `<?xml version="1.0" encoding="ISO-8859-9"?>
<Main>
    <UserName>${this.escapeXml(this.username)}</UserName>
    <PassWord>${this.escapeXml(this.password)}</PassWord>
    <CompanyCode>${this.escapeXml(this.companyCode)}</CompanyCode>
    <strGuid>${this.escapeXml(messageGuid)}</strGuid>
    <Delm>${this.escapeXml(delimiter)}</Delm>
    <Type></Type>
</Main>`;

    const response = await this.httpClient.post('DetailReport.aspx', xmlData);
    return new ReportResponse(response.getBody(), response.getStatusCode());
  }

  /**
   * Get report by message ID
   * @param messageId Message ID
   * @param reportType Report type (1: Delivered, 2: Pending, 3: Failed, 4: Timeout)
   * @param delimiter Delimiter for parsing response (default: ||)
   */
  public async getByMessageId(
    messageId: string,
    reportType?: number,
    delimiter: string = '||'
  ): Promise<ReportResponse> {
    const xmlData = `<?xml version="1.0" encoding="ISO-8859-9"?>
<ReportMain>
    <UserName>${this.escapeXml(this.username)}</UserName>
    <PassWord>${this.escapeXml(this.password)}</PassWord>
    <CompanyCode>${this.escapeXml(this.companyCode)}</CompanyCode>
    <Msgid>${this.escapeXml(messageId)}</Msgid>
    <Delm>${this.escapeXml(delimiter)}</Delm>
    <Type>${reportType || ''}</Type>
</ReportMain>`;

    const response = await this.httpClient.post('Report.aspx', xmlData);
    return new ReportResponse(response.getBody(), response.getStatusCode());
  }

  /**
   * Get report in XML format (v2)
   * @param messageId Message ID
   */
  public async getXmlReport(messageId: string): Promise<ReportResponse> {
    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<ReportMain>
    <UserName>${this.escapeXml(this.username)}</UserName>
    <PassWord>${this.escapeXml(this.password)}</PassWord>
    <CompanyCode>${this.escapeXml(this.companyCode)}</CompanyCode>
    <Msgid>${this.escapeXml(messageId)}</Msgid>
</ReportMain>`;

    const response = await this.httpClient.post('Reportnew.aspx', xmlData);
    return new ReportResponse(response.getBody(), response.getStatusCode());
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
