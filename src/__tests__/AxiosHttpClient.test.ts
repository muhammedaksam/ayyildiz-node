import axios from 'axios';
import { AxiosHttpClient } from '../AxiosHttpClient';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AxiosHttpClient', () => {
  let httpClient: AxiosHttpClient;
  let mockAxiosInstance: jest.Mocked<any>;

  beforeEach(() => {
    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn()
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    httpClient = new AxiosHttpClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with correct configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        headers: {
          'Content-Type': 'application/xml; charset=UTF-8',
          'User-Agent': expect.stringMatching(/^Ayyildiz-Node\//)
        },
        validateStatus: expect.any(Function)
      });
    });

    it('should configure validateStatus to accept status codes under 500', () => {
      const createCall = mockedAxios.create.mock.calls[0][0];
      const validateStatus = createCall?.validateStatus;

      expect(validateStatus!(200)).toBe(true);
      expect(validateStatus!(400)).toBe(true);
      expect(validateStatus!(499)).toBe(true);
      expect(validateStatus!(500)).toBe(false);
      expect(validateStatus!(503)).toBe(false);
    });
  });

  describe('post', () => {
    it('should make POST request with XML data', async () => {
      const mockResponse = {
        data: 'ID:123456',
        status: 200
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await httpClient.post('test-endpoint', 'test-data');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'http://sms.ayyildiz.net/test-endpoint',
        'test-data'
      );
      expect(result).toBe(httpClient);
    });

    it('should store response data and status code', async () => {
      const mockResponse = {
        data: 'ID:123456',
        status: 201
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      await httpClient.post('test-endpoint', 'test-data');

      expect(httpClient.getBody()).toBe('ID:123456');
      expect(httpClient.getStatusCode()).toBe(201);
    });

    it('should handle error responses', async () => {
      const mockResponse = {
        data: 'Error occurred',
        status: 400
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      await httpClient.post('test-endpoint', 'test-data');

      expect(httpClient.getBody()).toBe('Error occurred');
      expect(httpClient.getStatusCode()).toBe(400);
    });
  });

  describe('get', () => {
    it('should make GET request with query parameters', async () => {
      const mockResponse = {
        data: { result: 'success' },
        status: 200
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const options = { param1: 'value1', param2: 'value2' };
      const result = await httpClient.get('test-endpoint', options);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('http://sms.ayyildiz.net/test-endpoint', {
        params: options
      });
      expect(result).toBe(httpClient);
    });

    it('should make GET request without options', async () => {
      const mockResponse = {
        data: { result: 'success' },
        status: 200
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await httpClient.get('test-endpoint');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('http://sms.ayyildiz.net/test-endpoint', {
        params: undefined
      });
    });

    it('should store GET response data', async () => {
      const mockResponse = {
        data: { message: 'test response' },
        status: 200
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await httpClient.get('test-endpoint');

      expect(httpClient.getBody()).toEqual({ message: 'test response' });
      expect(httpClient.getStatusCode()).toBe(200);
    });
  });

  describe('response accessors', () => {
    it('should return correct body and status code', async () => {
      const mockResponse = {
        data: 'test response',
        status: 202
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      await httpClient.post('test', 'data');

      expect(httpClient.getBody()).toBe('test response');
      expect(httpClient.getStatusCode()).toBe(202);
    });

    it('should return payload information', async () => {
      const mockResponse = {
        data: 'response',
        status: 200
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      await httpClient.post('test', 'request-payload');

      expect(httpClient.getPayload()).toBe('request-payload');
    });

    it('should return JSON payload for GET requests', async () => {
      const mockResponse = {
        data: 'response',
        status: 200
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const params = { test: 'value' };
      await httpClient.get('test', params);

      expect(httpClient.getPayload()).toBe(JSON.stringify(params));
    });

    it('should return empty object JSON for GET without params', async () => {
      const mockResponse = {
        data: 'response',
        status: 200
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await httpClient.get('test');

      expect(httpClient.getPayload()).toBe('{}');
    });
  });

  describe('error handling', () => {
    it('should handle non-string data by converting to JSON', async () => {
      const objectData = { key: 'value', number: 123 };
      mockAxiosInstance.post.mockResolvedValue({
        data: 'Success',
        status: 200
      });

      const response = await httpClient.post('test.aspx', objectData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'http://sms.ayyildiz.net/test.aspx',
        JSON.stringify(objectData)
      );
      expect(response).toBe(httpClient);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockAxiosInstance.post.mockRejectedValue(networkError);

      await expect(httpClient.post('test', 'data')).rejects.toThrow('Network Error');
    });

    it('should handle axios request errors', async () => {
      const axiosError = {
        response: {
          data: 'Server Error',
          status: 500
        },
        message: 'Request failed'
      };
      mockAxiosInstance.get.mockRejectedValue(axiosError);

      await expect(httpClient.get('test')).rejects.toEqual(axiosError);
    });
  });
});
