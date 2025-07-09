import { AyyildizClient } from '../index';

describe('AyyildizClient', () => {
  let client: AyyildizClient;

  beforeEach(() => {
    client = new AyyildizClient({
      username: 'test-user',
      password: 'test-pass',
      companyCode: 'test-company',
      defaultOriginator: 'TEST'
    });
  });

  test('should initialize with config object', () => {
    expect(client).toBeDefined();
    expect(client.sms).toBeDefined();
    expect(client.account).toBeDefined();
    expect(client.reports).toBeDefined();
    expect(client.senders).toBeDefined();
  });

  test('should initialize with parameters', () => {
    const paramClient = new AyyildizClient('user', 'pass', 'company', 'SENDER');
    expect(paramClient).toBeDefined();
    expect(paramClient.sms).toBeDefined();
  });

  test('should provide access to all services', () => {
    expect(client.sms()).toBeDefined();
    expect(client.account()).toBeDefined();
    expect(client.reports()).toBeDefined();
    expect(client.senders()).toBeDefined();
  });

  test('should provide debug functionality', () => {
    const debugInfo = client.debug();
    expect(typeof debugInfo).toBe('string');
    expect(() => JSON.parse(debugInfo)).not.toThrow();
  });
});
