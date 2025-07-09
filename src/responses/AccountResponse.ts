import { BaseResponse } from './BaseResponse';

export class AccountResponse extends BaseResponse {
  public getCredit(): number | null {
    if (this.rawResponse && /^\d+$/.test(this.rawResponse.trim())) {
      return parseInt(this.rawResponse.trim(), 10);
    }

    return this.data?.credit || null;
  }

  public getExpiryDate(): string | null {
    // The second line usually contains expiry date in YYYYMMDD format
    const lines = this.rawResponse.split('\n');
    if (lines.length > 1 && /^\d{8}$/.test(lines[1].trim())) {
      return lines[1].trim();
    }

    return this.data?.expiryDate || null;
  }

  public toJSON(): object {
    return {
      success: this.ok(),
      statusCode: this.getStatusCode(),
      message: this.getMessage(),
      credit: this.getCredit(),
      expiryDate: this.getExpiryDate(),
      errorCode: this.getErrorCode()
    };
  }
}
