export interface SmsReport {
  messageId: string;
  messageTime: string;
  version: string;
  message: string;
  total: number;
  sent: number;
  pending: number;
  systemOut: number;
  timeout: number;
  type: string;
  status: string;
  statusCode: string;
  startDate: string;
  endDate: string;
  originator: string;
}
