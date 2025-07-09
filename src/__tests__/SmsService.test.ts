import { SmsService, SmsType } from '../services/SmsService';
import { IHttpClient } from '../IHttpClient';
import { SmsResponse } from '../responses/SmsResponse';

describe('SmsService', () => {
  let smsService: SmsService;
  let mockHttpClient: jest.Mocked<IHttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      post: jest.fn(),
      get: jest.fn(),
      getBody: jest.fn(),
      getStatusCode: jest.fn(),
      getPayload: jest.fn()
    };

    smsService = new SmsService(
      mockHttpClient,
      'testuser',
      'testpass',
      'testcompany',
      'TESTSENDER'
    );
  });

  describe('configuration methods', () => {
    it('should allow method chaining for schedule', () => {
      const result = smsService.schedule('010120241400', '010120241500');
      expect(result).toBe(smsService);
    });

    it('should allow method chaining for setType', () => {
      const result = smsService.setType(SmsType.LONG);
      expect(result).toBe(smsService);
    });

    it('should set schedule with only start time', () => {
      const result = smsService.schedule('010120241400');
      expect(result).toBe(smsService);
    });
  });

  describe('send method', () => {
    beforeEach(() => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('ID:123456');
      mockHttpClient.getStatusCode.mockReturnValue(200);
    });

    it('should send SMS to single recipient with string input', async () => {
      const result = await smsService.send('5551234567', 'Test message', 'SENDER');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMany.aspx',
        expect.stringContaining('<Mesgbody><![CDATA[Test message]]></Mesgbody>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMany.aspx',
        expect.stringContaining('<Originator><![CDATA[SENDER]]></Originator>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMany.aspx',
        expect.stringContaining('<Numbers>5551234567</Numbers>')
      );
      expect(result).toBeInstanceOf(SmsResponse);
    });

    it('should send SMS to multiple recipients with array input', async () => {
      const recipients = ['5551234567', '5557654321'];
      const result = await smsService.send(recipients, 'Test message');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMany.aspx',
        expect.stringContaining('<Numbers>5551234567,5557654321</Numbers>')
      );
      expect(result).toBeInstanceOf(SmsResponse);
    });

    it('should use default originator when not provided', async () => {
      await smsService.send('5551234567', 'Test message');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMany.aspx',
        expect.stringContaining('<Originator><![CDATA[TESTSENDER]]></Originator>')
      );
    });

    it('should send different messages to different recipients', async () => {
      const recipients = {
        '5551234567': 'Message 1',
        '5557654321': 'Message 2'
      };

      const result = await smsService.send(recipients, undefined, 'SENDER');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMulti.aspx',
        expect.stringContaining('<Originator><![CDATA[SENDER]]></Originator>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMulti.aspx',
        expect.stringContaining('<Number>5551234567</Number>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMulti.aspx',
        expect.stringContaining('<Mesgbody><![CDATA[Message 1]]></Mesgbody>')
      );
      expect(result).toBeInstanceOf(SmsResponse);
    });

    it('should include schedule information when set', async () => {
      smsService.schedule('010120241400', '010120241500');
      await smsService.send('5551234567', 'Test message');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMany.aspx',
        expect.stringContaining('<SDate>010120241400</SDate>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMany.aspx',
        expect.stringContaining('<EDate>010120241500</EDate>')
      );
    });

    it('should include SMS type when set', async () => {
      smsService.setType(SmsType.LONG);
      await smsService.send('5551234567', 'Test message');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMany.aspx',
        expect.stringContaining('<Type>5</Type>')
      );
    });

    it('should handle messages with special characters using CDATA', async () => {
      await smsService.send('5551234567', 'Test & <message> with "quotes"');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMany.aspx',
        expect.stringContaining('<Mesgbody><![CDATA[Test & <message> with "quotes"]]></Mesgbody>')
      );
    });

    it('should handle originators with special characters using CDATA', async () => {
      await smsService.send('5551234567', 'Test message', 'SEND&ER');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMany.aspx',
        expect.stringContaining('<Originator><![CDATA[SEND&ER]]></Originator>')
      );
    });

    it('should handle multiple recipients with object containing special characters', async () => {
      const recipients = {
        '5551234567': 'Message with & symbols',
        '5557654321': 'Message with <tags>'
      };

      await smsService.send(recipients);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMulti.aspx',
        expect.stringContaining('<Mesgbody><![CDATA[Message with & symbols]]></Mesgbody>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMulti.aspx',
        expect.stringContaining('<Mesgbody><![CDATA[Message with <tags>]]></Mesgbody>')
      );
    });
  });

  describe('SMS types', () => {
    it('should have correct SMS type values', () => {
      expect(SmsType.STANDARD).toBe(1);
      expect(SmsType.LONG).toBe(5);
      expect(SmsType.TURKISH_SHORT).toBe(6);
      expect(SmsType.TURKISH_LONG).toBe(7);
      expect(SmsType.TURKISH_STANDARD).toBe(12);
      expect(SmsType.INTERNATIONAL).toBe(13);
    });
  });

  describe('sendViaHttp method', () => {
    beforeEach(() => {
      mockHttpClient.get = jest.fn().mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('ID:123456');
      mockHttpClient.getStatusCode.mockReturnValue(200);
    });

    it('should send SMS via GET method', async () => {
      const result = await smsService.sendViaHttp('5551234567', 'Test message');

      expect(mockHttpClient.get).toHaveBeenCalledWith('services/SendSmsGet.aspx', {
        user: 'testuser',
        password: 'testpass',
        to: '5551234567',
        text: 'Test message',
        origin: 'TESTSENDER',
        tip: '',
        type: ''
      });
      expect(result).toBeInstanceOf(SmsResponse);
    });

    it('should handle Turkish characters in GET method', async () => {
      await smsService.sendViaHttp('5551234567', 'İçerik: Ğüncel şöyle üstün çift');

      expect(mockHttpClient.get).toHaveBeenCalledWith('services/SendSmsGet.aspx', {
        user: 'testuser',
        password: 'testpass',
        to: '5551234567',
        text: 'Icerik: Guncel soyle ustun cift',
        origin: 'TESTSENDER',
        tip: '',
        type: ''
      });
    });

    it('should use custom parameters in GET method', async () => {
      await smsService.sendViaHttp('5551234567', 'Test', 'CUSTOM', 'flash', 'premium');

      expect(mockHttpClient.get).toHaveBeenCalledWith('services/SendSmsGet.aspx', {
        user: 'testuser',
        password: 'testpass',
        to: '5551234567',
        text: 'Test',
        origin: 'CUSTOM',
        tip: 'flash',
        type: 'premium'
      });
    });

    it('should throw error when GET method not supported', async () => {
      delete mockHttpClient.get;

      await expect(smsService.sendViaHttp('5551234567', 'Test')).rejects.toThrow(
        'HTTP GET method not supported by this client'
      );
    });
  });

  describe('error handling', () => {
    it('should handle HTTP client errors', async () => {
      const error = new Error('Network error');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(smsService.send('5551234567', 'Test')).rejects.toThrow('Network error');
    });

    it('should handle empty recipients array', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('ID:123456');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      const result = await smsService.send([], 'Test message');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'SendSmsMany.aspx',
        expect.stringContaining('<Numbers></Numbers>')
      );
      expect(result).toBeInstanceOf(SmsResponse);
    });

    it('should handle empty recipients object', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('ID:123456');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      const result = await smsService.send({});

      expect(result).toBeInstanceOf(SmsResponse);
    });
  });
});
