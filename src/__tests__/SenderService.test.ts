import { SenderService } from '../services/SenderService';
import { IHttpClient } from '../IHttpClient';
import { SenderResponse } from '../responses/SenderResponse';

describe('SenderService', () => {
  let senderService: SenderService;
  let mockHttpClient: jest.Mocked<IHttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      post: jest.fn(),
      get: jest.fn(),
      getBody: jest.fn(),
      getStatusCode: jest.fn(),
      getPayload: jest.fn()
    };

    senderService = new SenderService(mockHttpClient, 'testuser', 'testpass', 'testcompany');
  });

  describe('getOriginators', () => {
    it('should make POST request to QueryOrigin.aspx with correct XML', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('originator data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      const result = await senderService.getOriginators();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining("<?xml version='1.0' encoding='UTF-8'?>")
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<UserName>testuser</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<PassWord>testpass</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<CompanyCode>testcompany</CompanyCode>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<User>User</User>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<Originator>DENEME</Originator>')
      );
      expect(result).toBeInstanceOf(SenderResponse);
    });

    it('should escape XML characters in credentials', async () => {
      const serviceWithSpecialChars = new SenderService(
        mockHttpClient,
        'user&name',
        'pass<word>',
        'company"code'
      );

      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('originator data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await serviceWithSpecialChars.getOriginators();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<UserName>user&amp;name</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<PassWord>pass&lt;word&gt;</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<CompanyCode>company&quot;code</CompanyCode>')
      );
    });

    it('should handle successful response', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('SENDER1||SENDER2||SENDER3');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      const result = await senderService.getOriginators();

      expect(result).toBeInstanceOf(SenderResponse);
    });

    it('should handle error response', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('01');
      mockHttpClient.getStatusCode.mockReturnValue(401);

      const result = await senderService.getOriginators();

      expect(result).toBeInstanceOf(SenderResponse);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockHttpClient.post.mockRejectedValue(networkError);

      await expect(senderService.getOriginators()).rejects.toThrow('Network error');
    });
  });

  describe('XML escaping', () => {
    it('should escape all XML special characters', async () => {
      const serviceWithAllSpecialChars = new SenderService(
        mockHttpClient,
        'user&<>"\'',
        'pass&<>"\'',
        'company&<>"\''
      );

      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('originator data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await serviceWithAllSpecialChars.getOriginators();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<UserName>user&amp;&lt;&gt;&quot;&apos;</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<PassWord>pass&amp;&lt;&gt;&quot;&apos;</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<CompanyCode>company&amp;&lt;&gt;&quot;&apos;</CompanyCode>')
      );
    });

    it('should handle empty strings', async () => {
      const serviceWithEmptyStrings = new SenderService(mockHttpClient, '', '', '');

      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('originator data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await serviceWithEmptyStrings.getOriginators();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<UserName></UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<PassWord></PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryOrigin.aspx',
        expect.stringContaining('<CompanyCode></CompanyCode>')
      );
    });
  });
});
