import { BaseResponse } from './BaseResponse';

export class SenderResponse extends BaseResponse {
  public getSenders(): string[] {
    const lines = this.rawResponse.split('\n').filter(line => line.trim());

    // First line should be "OK" for success
    if (lines.length > 0 && lines[0].trim() === 'OK') {
      return lines.slice(1);
    }

    return [];
  }

  public toJSON(): object {
    return {
      success: this.ok(),
      statusCode: this.getStatusCode(),
      message: this.getMessage(),
      senders: this.getSenders(),
      errorCode: this.getErrorCode()
    };
  }
}
