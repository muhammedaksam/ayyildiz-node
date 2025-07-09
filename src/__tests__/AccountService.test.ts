import { AccountService } from '../services/AccountService';
import { IHttpClient } from '../IHttpClient';
import { AccountResponse } from '../responses/AccountResponse';

describe('AccountService', () => {
  let accountService: AccountService;
  let mockHttpClient: jest.Mocked<IHttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      post: jest.fn(),
      get: jest.fn(),
      getBody: jest.fn(),
      getStatusCode: jest.fn(),
      getPayload: jest.fn()
    };

    accountService = new AccountService(mockHttpClient, 'testuser', 'testpass', 'testcompany');
  });

  describe('getCredit', () => {
    it('should make POST request to QueryCredit.aspx', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('1000');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      const result = await accountService.getCredit();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining("<?xml version='1.0' encoding='ISO-8859-9'?>")
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<UserName>testuser</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<PassWord>testpass</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<CompanyCode>testcompany</CompanyCode>')
      );
      expect(result).toBeInstanceOf(AccountResponse);
    });

    it('should escape XML characters in credentials', async () => {
      const serviceWithSpecialChars = new AccountService(
        mockHttpClient,
        'user&name',
        'pass<word>',
        'company"code'
      );

      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('1000');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await serviceWithSpecialChars.getCredit();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<UserName>user&amp;name</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<PassWord>pass&lt;word&gt;</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<CompanyCode>company&quot;code</CompanyCode>')
      );
    });

    it('should handle successful response', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('1000');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      const result = await accountService.getCredit();

      expect(result).toBeInstanceOf(AccountResponse);
    });

    it('should handle error response', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('ERROR:Invalid credentials');
      mockHttpClient.getStatusCode.mockReturnValue(401);

      const result = await accountService.getCredit();

      expect(result).toBeInstanceOf(AccountResponse);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockHttpClient.post.mockRejectedValue(networkError);

      await expect(accountService.getCredit()).rejects.toThrow('Network error');
    });
  });

  describe('XML escaping', () => {
    it('should escape all XML special characters', async () => {
      const serviceWithAllSpecialChars = new AccountService(
        mockHttpClient,
        'user&<>"\'',
        'pass&<>"\'',
        'company&<>"\''
      );

      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('1000');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await serviceWithAllSpecialChars.getCredit();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<UserName>user&amp;&lt;&gt;&quot;&apos;</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<PassWord>pass&amp;&lt;&gt;&quot;&apos;</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<CompanyCode>company&amp;&lt;&gt;&quot;&apos;</CompanyCode>')
      );
    });

    it('should handle empty strings', async () => {
      const serviceWithEmptyStrings = new AccountService(mockHttpClient, '', '', '');

      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('1000');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await serviceWithEmptyStrings.getCredit();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<UserName></UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<PassWord></PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'QueryCredit.aspx',
        expect.stringContaining('<CompanyCode></CompanyCode>')
      );
    });
  });
});
