import { BaseResponse } from './BaseResponse';

export class SmsResponse extends BaseResponse {
  public getMessageId(): string | null {
    if (this.data?.id) {
      return this.data.id;
    }

    // Parse ID from response like "ID:123456"
    if (this.rawResponse && this.rawResponse.startsWith('ID:')) {
      return this.rawResponse.substring(3);
    }

    return null;
  }

  public toJSON(): object {
    return {
      success: this.ok(),
      statusCode: this.getStatusCode(),
      message: this.getMessage(),
      messageId: this.getMessageId(),
      errorCode: this.getErrorCode()
    };
  }
}
