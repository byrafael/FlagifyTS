export interface FlagifyErrorData {
  status: number;
  code: string | null;
  details: Record<string, unknown> | null;
  requestId: string | null;
  url: string;
  method: string;
  body: unknown;
  rawBody: string | null;
}
