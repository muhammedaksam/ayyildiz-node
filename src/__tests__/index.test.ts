import {
  AyyildizClient,
  AccountService,
  ReportService,
  SenderService,
  SmsService,
  SmsType,
  AccountResponse,
  BaseResponse,
  ReportResponse,
  SenderResponse,
  SmsResponse,
  VersionInfo
} from '../index';

describe('Index exports', () => {
  it('should export AyyildizClient', () => {
    expect(AyyildizClient).toBeDefined();
    expect(typeof AyyildizClient).toBe('function');
  });

  it('should export all service classes', () => {
    expect(AccountService).toBeDefined();
    expect(ReportService).toBeDefined();
    expect(SenderService).toBeDefined();
    expect(SmsService).toBeDefined();
    expect(typeof AccountService).toBe('function');
    expect(typeof ReportService).toBe('function');
    expect(typeof SenderService).toBe('function');
    expect(typeof SmsService).toBe('function');
  });

  it('should export SmsType enum', () => {
    expect(SmsType).toBeDefined();
    expect(typeof SmsType).toBe('object');
    expect(SmsType.STANDARD).toBe(1);
    expect(SmsType.LONG).toBe(5);
    expect(SmsType.TURKISH_SHORT).toBe(6);
    expect(SmsType.INTERNATIONAL).toBe(13);
  });

  it('should export all response classes', () => {
    expect(AccountResponse).toBeDefined();
    expect(BaseResponse).toBeDefined();
    expect(ReportResponse).toBeDefined();
    expect(SenderResponse).toBeDefined();
    expect(SmsResponse).toBeDefined();
    expect(typeof AccountResponse).toBe('function');
    expect(typeof BaseResponse).toBe('function');
    expect(typeof ReportResponse).toBe('function');
    expect(typeof SenderResponse).toBe('function');
    expect(typeof SmsResponse).toBe('function');
  });

  it('should export VersionInfo', () => {
    expect(VersionInfo).toBeDefined();
    expect(typeof VersionInfo).toBe('function');
    expect(typeof VersionInfo.string).toBe('function');
    expect(typeof VersionInfo.toJSON).toBe('function');
  });

  it('should allow creating instances of exported classes', () => {
    // Test that we can actually instantiate the exported classes
    const baseResponse = new BaseResponse('test', 200);
    expect(baseResponse).toBeInstanceOf(BaseResponse);

    const smsResponse = new SmsResponse('ID:123', 200);
    expect(smsResponse).toBeInstanceOf(SmsResponse);

    const accountResponse = new AccountResponse('1000', 200);
    expect(accountResponse).toBeInstanceOf(AccountResponse);

    const reportResponse = new ReportResponse('test', 200);
    expect(reportResponse).toBeInstanceOf(ReportResponse);

    const senderResponse = new SenderResponse('OK\nSENDER1', 200);
    expect(senderResponse).toBeInstanceOf(SenderResponse);
  });

  it('should allow creating instances of service classes', () => {
    const mockHttpClient = {
      post: jest.fn(),
      get: jest.fn(),
      getBody: jest.fn(),
      getStatusCode: jest.fn(),
      getPayload: jest.fn()
    };

    const accountService = new AccountService(mockHttpClient, 'user', 'pass', 'company');
    expect(accountService).toBeInstanceOf(AccountService);

    const reportService = new ReportService(mockHttpClient, 'user', 'pass', 'company');
    expect(reportService).toBeInstanceOf(ReportService);

    const senderService = new SenderService(mockHttpClient, 'user', 'pass', 'company');
    expect(senderService).toBeInstanceOf(SenderService);

    const smsService = new SmsService(mockHttpClient, 'user', 'pass', 'company');
    expect(smsService).toBeInstanceOf(SmsService);
  });
});
