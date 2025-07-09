import { AyyildizClient } from '../index';
import { AccountService } from '../services/AccountService';
import { SmsService } from '../services/SmsService';
import { ReportService } from '../services/ReportService';
import { SenderService } from '../services/SenderService';

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

  describe('constructor with config object', () => {
    it('should initialize with config object', () => {
      expect(client).toBeDefined();
      expect(client.sms).toBeDefined();
      expect(client.account).toBeDefined();
      expect(client.reports).toBeDefined();
      expect(client.senders).toBeDefined();
    });

    it('should initialize with minimal config', () => {
      const minimalClient = new AyyildizClient({
        username: 'user',
        password: 'pass',
        companyCode: 'company'
      });
      expect(minimalClient).toBeDefined();
    });

    it('should handle config with all fields', () => {
      const fullClient = new AyyildizClient({
        username: 'user',
        password: 'pass',
        companyCode: 'company',
        defaultOriginator: 'SENDER'
      });
      expect(fullClient).toBeDefined();
    });
  });

  describe('constructor with parameters', () => {
    it('should initialize with parameters', () => {
      const paramClient = new AyyildizClient('user', 'pass', 'company', 'SENDER');
      expect(paramClient).toBeDefined();
      expect(paramClient.sms).toBeDefined();
    });

    it('should initialize with minimal parameters', () => {
      const minimalClient = new AyyildizClient('user', 'pass', 'company');
      expect(minimalClient).toBeDefined();
    });
  });

  describe('service access', () => {
    it('should provide access to all services', () => {
      expect(client.sms()).toBeDefined();
      expect(client.account()).toBeDefined();
      expect(client.reports()).toBeDefined();
      expect(client.senders()).toBeDefined();
    });

    it('should return service instances', () => {
      expect(client.sms()).toBeInstanceOf(SmsService);
      expect(client.account()).toBeInstanceOf(AccountService);
      expect(client.reports()).toBeInstanceOf(ReportService);
      expect(client.senders()).toBeInstanceOf(SenderService);
    });

    it('should return new service instances on each call', () => {
      const sms1 = client.sms();
      const sms2 = client.sms();
      expect(sms1).not.toBe(sms2); // New instances created each time

      const account1 = client.account();
      const account2 = client.account();
      expect(account1).not.toBe(account2); // New instances created each time
    });
  });

  describe('debug functionality', () => {
    it('should provide debug functionality', () => {
      const debugInfo = client.debug();
      expect(typeof debugInfo).toBe('string');
      expect(() => JSON.parse(debugInfo)).not.toThrow();
    });

    it('should return valid JSON debug info structure', () => {
      const debugInfo = client.debug();
      const parsed = JSON.parse(debugInfo);
      expect(parsed).toHaveProperty('payload');
      expect(parsed).toHaveProperty('status');
      // Check that we have the expected structure, response might be undefined initially
      expect(typeof parsed.payload).toBe('string');
      expect(typeof parsed.status).toBe('number');
      expect(parsed).not.toHaveProperty('password'); // Should not expose password
    });

    it('should handle debug mode configuration', () => {
      const debugClient = new AyyildizClient({
        username: 'user',
        password: 'pass',
        companyCode: 'company'
      });
      const debugInfo = debugClient.debug();
      expect(typeof debugInfo).toBe('string');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings in config', () => {
      const emptyClient = new AyyildizClient({
        username: '',
        password: '',
        companyCode: ''
      });
      expect(emptyClient).toBeDefined();
    });

    it('should handle special characters in credentials', () => {
      const specialClient = new AyyildizClient({
        username: 'user&name',
        password: 'pass<word>',
        companyCode: 'company"code'
      });
      expect(specialClient).toBeDefined();
    });

    it('should handle unicode characters', () => {
      const unicodeClient = new AyyildizClient({
        username: 'kullanıcı',
        password: 'şifre',
        companyCode: 'şirket'
      });
      expect(unicodeClient).toBeDefined();
    });
  });

  describe('HTTP client integration', () => {
    it('should have HTTP client available in services', () => {
      const smsService = client.sms();
      expect(smsService).toBeDefined();
      // Services should be properly initialized with HTTP client
    });
  });
});
