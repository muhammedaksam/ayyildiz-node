export interface IResponse {
  ok(): boolean;
  getMessage(): string;
  getStatusCode(): number;
  getErrorCode(): string;
  toJSON(): object;
}
