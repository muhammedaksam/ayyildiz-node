import { IResponse } from './IResponse';

export class BaseResponse implements IResponse {
  protected data: any;
  protected statusCode: number;
  protected rawResponse: string;

  constructor(data: any, statusCode: number) {
    this.rawResponse = typeof data === 'string' ? data : JSON.stringify(data);
    this.statusCode = statusCode;
    this.data = this.parseResponse(data);
    this.customizeData();
  }

  protected parseResponse(data: any): any {
    // Handle different response formats from Ayyıldız API
    if (typeof data === 'string') {
      // Check if it's an ID response like "ID:123456"
      if (data.startsWith('ID:')) {
        return { id: data.substring(3), success: true };
      }

      // Check for numeric error codes
      if (/^\d{2,3}$/.test(data.trim())) {
        return { errorCode: data.trim(), success: false };
      }

      // Try to parse as XML or other format
      return { message: data, success: this.statusCode === 200 };
    }

    return data;
  }

  protected customizeData(): void {
    // Override this method in child classes if needed
  }

  public ok(): boolean {
    return this.statusCode === 200 && !this.hasError();
  }

  public hasError(): boolean {
    return (
      this.data?.errorCode !== undefined ||
      (typeof this.data?.success === 'boolean' && !this.data.success) ||
      /^\d{2,3}$/.test(this.rawResponse.trim())
    );
  }

  public getMessage(): string {
    if (this.hasError()) {
      return this.getErrorMessage();
    }
    return this.data?.message || this.rawResponse || '';
  }

  public getErrorMessage(): string {
    const errorCode = this.getErrorCode();
    const errorMessages: { [key: string]: string } = {
      '00': 'Kullanıcı Bilgileri Boş',
      '01': 'Kullanıcı Bilgileri Hatalı',
      '02': 'Hesap Kapalı',
      '03': 'Kontör Hatası',
      '04': 'Bayi Kodunuz Hatalı',
      '05': 'Originator Bilginiz Hatalı',
      '06': 'Yapılan İşlem İçin Yetkiniz Yok',
      '10': 'Geçersiz IP Adresi',
      '14': 'Mesaj Metni Girilmemiş',
      '15': 'GSM Numarası Girilmemiş',
      '20': 'Rapor Hazır Değil',
      '27': 'Aylık Atım Limitiniz Yetersiz',
      '100': 'XML Hatası'
    };

    return errorMessages[errorCode] || `Bilinmeyen hata kodu: ${errorCode}`;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public getErrorCode(): string {
    if (this.data?.errorCode) {
      return this.data.errorCode;
    }

    // Check if raw response is an error code
    if (/^\d{2,3}$/.test(this.rawResponse.trim())) {
      return this.rawResponse.trim();
    }

    return '';
  }

  public toJSON(): object {
    return {
      success: this.ok(),
      statusCode: this.getStatusCode(),
      message: this.getMessage(),
      errorCode: this.getErrorCode()
    };
  }
}
