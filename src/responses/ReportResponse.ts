import { BaseResponse } from './BaseResponse';

export class ReportResponse extends BaseResponse {
  public getReports(): any[] {
    if (this.data?.reports) {
      return this.data.reports;
    }

    // Parse delimited report data
    if (this.rawResponse && this.rawResponse.includes('||')) {
      return this.parseDelimitedReport(this.rawResponse);
    }

    return [];
  }

  private parseDelimitedReport(response: string): any[] {
    const lines = response.split('\n').filter(line => line.trim());
    const reports = [];

    for (const line of lines) {
      if (line.includes('||')) {
        const parts = line.split('||');
        if (parts.length >= 14) {
          reports.push({
            messageId: parts[0]?.replace(/"/g, ''),
            messageTime: parts[1]?.replace(/"/g, ''),
            version: parts[2]?.replace(/"/g, ''),
            message: parts[3]?.replace(/"/g, ''),
            total: parseInt(parts[4]?.replace(/"/g, '') || '0'),
            sent: parseInt(parts[5]?.replace(/"/g, '') || '0'),
            pending: parseInt(parts[6]?.replace(/"/g, '') || '0'),
            systemOut: parseInt(parts[7]?.replace(/"/g, '') || '0'),
            timeout: parseInt(parts[8]?.replace(/"/g, '') || '0'),
            type: parts[9]?.replace(/"/g, ''),
            status: parts[10]?.replace(/"/g, ''),
            statusCode: parts[11]?.replace(/"/g, ''),
            startDate: parts[12]?.replace(/"/g, ''),
            endDate: parts[13]?.replace(/"/g, ''),
            originator: parts[14]?.replace(/"/g, '')
          });
        }
      }
    }

    return reports;
  }

  public toJSON(): object {
    return {
      success: this.ok(),
      statusCode: this.getStatusCode(),
      message: this.getMessage(),
      reports: this.getReports(),
      errorCode: this.getErrorCode()
    };
  }
}
