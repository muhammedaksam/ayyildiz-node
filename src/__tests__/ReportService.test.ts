import { ReportService } from '../services/ReportService';
import { IHttpClient } from '../IHttpClient';
import { ReportResponse } from '../responses/ReportResponse';

describe('ReportService', () => {
  let reportService: ReportService;
  let mockHttpClient: jest.Mocked<IHttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      post: jest.fn(),
      get: jest.fn(),
      getBody: jest.fn(),
      getStatusCode: jest.fn(),
      getPayload: jest.fn()
    };

    reportService = new ReportService(mockHttpClient, 'testuser', 'testpass', 'testcompany');
  });

  describe('getByDateRange', () => {
    it('should make POST request to ReportList.aspx with correct XML', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('report data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      const result = await reportService.getByDateRange('20240101', '20240131');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining("<?xml version='1.0' encoding='ISO-8859-9'?>")
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<UserName>testuser</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<PassWord>testpass</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<CompanyCode>testcompany</CompanyCode>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<SDate>20240101</SDate>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<EDate>20240131</EDate>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<Type>2</Type>')
      );
      expect(result).toBeInstanceOf(ReportResponse);
    });

    it('should use default delimiter when not provided', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('report data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await reportService.getByDateRange('20240101', '20240131');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<Delm>||</Delm>')
      );
    });

    it('should use custom delimiter when provided', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('report data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await reportService.getByDateRange('20240101', '20240131', ';;');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<Delm>;;</Delm>')
      );
    });

    it('should escape XML characters in credentials', async () => {
      const serviceWithSpecialChars = new ReportService(
        mockHttpClient,
        'user&name',
        'pass<word>',
        'company"code'
      );

      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('report data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await serviceWithSpecialChars.getByDateRange('20240101', '20240131');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<UserName>user&amp;name</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<PassWord>pass&lt;word&gt;</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<CompanyCode>company&quot;code</CompanyCode>')
      );
    });

    it('should handle HTTP client errors', async () => {
      const error = new Error('Network error');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(reportService.getByDateRange('20240101', '20240131')).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('getDetailedReport', () => {
    it('should make POST request to DetailReport.aspx with message GUID', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('detailed report data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      const result = await reportService.getDetailedReport('test-guid-123');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'DetailReport.aspx',
        expect.stringContaining('<?xml version="1.0" encoding="ISO-8859-9"?>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'DetailReport.aspx',
        expect.stringContaining('<UserName>testuser</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'DetailReport.aspx',
        expect.stringContaining('<PassWord>testpass</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'DetailReport.aspx',
        expect.stringContaining('<CompanyCode>testcompany</CompanyCode>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'DetailReport.aspx',
        expect.stringContaining('<strGuid>test-guid-123</strGuid>')
      );
      expect(result).toBeInstanceOf(ReportResponse);
    });

    it('should escape XML characters in message GUID', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('detailed report data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await reportService.getDetailedReport('guid&with<special>chars');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'DetailReport.aspx',
        expect.stringContaining('<strGuid>guid&amp;with&lt;special&gt;chars</strGuid>')
      );
    });

    it('should handle HTTP client errors', async () => {
      const error = new Error('Network error');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(reportService.getDetailedReport('test-guid')).rejects.toThrow('Network error');
    });
  });

  describe('getByMessageId', () => {
    it('should make POST request to Report.aspx with message ID', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('message report data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      const result = await reportService.getByMessageId('test-msg-123');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'Report.aspx',
        expect.stringContaining('<?xml version="1.0" encoding="ISO-8859-9"?>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'Report.aspx',
        expect.stringContaining('<UserName>testuser</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'Report.aspx',
        expect.stringContaining('<PassWord>testpass</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'Report.aspx',
        expect.stringContaining('<CompanyCode>testcompany</CompanyCode>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'Report.aspx',
        expect.stringContaining('<Msgid>test-msg-123</Msgid>')
      );
      expect(result).toBeInstanceOf(ReportResponse);
    });

    it('should include report type when provided', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('message report data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await reportService.getByMessageId('test-msg-123', 1);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'Report.aspx',
        expect.stringContaining('<Type>1</Type>')
      );
    });

    it('should handle HTTP client errors', async () => {
      const error = new Error('Network error');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(reportService.getByMessageId('test-msg')).rejects.toThrow('Network error');
    });
  });

  describe('getXmlReport', () => {
    it('should make POST request to Reportnew.aspx with message ID', async () => {
      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('xml report data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      const result = await reportService.getXmlReport('test-msg-123');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'Reportnew.aspx',
        expect.stringContaining('<?xml version="1.0" encoding="UTF-8"?>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'Reportnew.aspx',
        expect.stringContaining('<UserName>testuser</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'Reportnew.aspx',
        expect.stringContaining('<PassWord>testpass</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'Reportnew.aspx',
        expect.stringContaining('<CompanyCode>testcompany</CompanyCode>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'Reportnew.aspx',
        expect.stringContaining('<Msgid>test-msg-123</Msgid>')
      );
      expect(result).toBeInstanceOf(ReportResponse);
    });

    it('should handle HTTP client errors', async () => {
      const error = new Error('Network error');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(reportService.getXmlReport('test-msg')).rejects.toThrow('Network error');
    });
  });

  describe('XML escaping', () => {
    it('should escape all XML special characters', async () => {
      const serviceWithAllSpecialChars = new ReportService(
        mockHttpClient,
        'user&<>"\'',
        'pass&<>"\'',
        'company&<>"\''
      );

      mockHttpClient.post.mockResolvedValue(mockHttpClient);
      mockHttpClient.getBody.mockReturnValue('report data');
      mockHttpClient.getStatusCode.mockReturnValue(200);

      await serviceWithAllSpecialChars.getByDateRange('20240101', '20240131');

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<UserName>user&amp;&lt;&gt;&quot;&apos;</UserName>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<PassWord>pass&amp;&lt;&gt;&quot;&apos;</PassWord>')
      );
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'ReportList.aspx',
        expect.stringContaining('<CompanyCode>company&amp;&lt;&gt;&quot;&apos;</CompanyCode>')
      );
    });
  });
});
