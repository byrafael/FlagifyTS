import type { FlagifyErrorData } from "../types/errors";

export class FlagifyError extends Error implements FlagifyErrorData {
  readonly status: number;
  readonly code: string | null;
  readonly details: Record<string, unknown> | null;
  readonly requestId: string | null;
  readonly url: string;
  readonly method: string;
  readonly body: unknown;
  readonly rawBody: string | null;

  public constructor(message: string, data: FlagifyErrorData) {
    super(message);
    this.name = "FlagifyError";
    this.status = data.status;
    this.code = data.code;
    this.details = data.details;
    this.requestId = data.requestId;
    this.url = data.url;
    this.method = data.method;
    this.body = data.body;
    this.rawBody = data.rawBody;
  }
}
