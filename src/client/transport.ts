import { ZodError } from "zod";
import { FlagifyError } from "../errors/flagify-error";
import type { SnapshotResponse } from "../types/api";
import type { FetchLike, FlagifyClientOptions } from "../types/auth";
import { mergeHeaders } from "../utils/headers";
import { applyQueryParams } from "../utils/query";
import { normalizeBaseUrl } from "../utils/url";
import type { SnapshotTransportRequest, TransportRequest } from "./request";

export class FlagifyTransport {
  readonly #baseUrl: string;
  readonly #apiKey: string;
  readonly #fetchImpl: FetchLike;
  readonly #validateResponses: boolean;
  readonly #userAgent: string | undefined;

  public constructor(options: FlagifyClientOptions) {
    this.#baseUrl = normalizeBaseUrl(options.baseUrl);
    this.#apiKey = options.apiKey;
    this.#fetchImpl = options.fetch ?? fetch;
    this.#validateResponses = options.validateResponses ?? true;
    this.#userAgent = options.userAgent;
  }

  public async request<T>(request: TransportRequest<T>): Promise<T> {
    const response = await this.fetch(request);
    if (response.status === 204) {
      return undefined as T;
    }

    const payload = await this.parseResponseBody(response);
    if (!response.ok) {
      throw this.toError(response, request.method, payload);
    }

    return this.validatePayload(request, payload);
  }

  public async requestSnapshot<T>(
    request: SnapshotTransportRequest<T>,
  ): Promise<SnapshotResponse<T>> {
    const response = await this.fetch({
      ...request,
      headers: mergeHeaders(
        request.headers,
        request.ifNoneMatch
          ? { "If-None-Match": request.ifNoneMatch }
          : undefined,
      ),
    });

    if (response.status === 304) {
      return {
        data: null,
        etag: response.headers.get("etag"),
        notModified: true,
      };
    }

    const payload = await this.parseResponseBody(response);
    if (!response.ok) {
      throw this.toError(response, request.method, payload);
    }

    return {
      data: this.validatePayload(request, payload),
      etag: response.headers.get("etag"),
      notModified: false,
    };
  }

  private async fetch<T>(request: TransportRequest<T>): Promise<Response> {
    const url = applyQueryParams(
      new URL(request.path, this.#baseUrl),
      request.query,
    );
    const hasBody = request.body !== undefined;
    const headers = mergeHeaders(
      {
        Accept: "application/json",
        Authorization: `Bearer ${this.#apiKey}`,
      },
      hasBody ? { "Content-Type": "application/json" } : undefined,
      this.#userAgent ? { "User-Agent": this.#userAgent } : undefined,
      request.headers,
    );

    const init: RequestInit = {
      method: request.method,
      headers,
    };

    if (hasBody) {
      init.body = JSON.stringify(request.body);
    }

    if (request.signal) {
      init.signal = request.signal;
    }

    return this.#fetchImpl(url, init);
  }

  private async parseResponseBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (text.length === 0) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  private validatePayload<T>(
    request: TransportRequest<T>,
    payload: unknown,
  ): T {
    const shouldValidate = request.validateResponse ?? this.#validateResponses;
    if (!request.schema || !shouldValidate) {
      return payload as T;
    }

    try {
      return request.schema.parse(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Flagify response validation failed: ${error.message}`);
      }

      throw error;
    }
  }

  private toError(
    response: Response,
    method: string,
    body: unknown,
  ): FlagifyError {
    const jsonBody =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>)
        : null;
    const nestedError =
      jsonBody && typeof jsonBody.error === "object" && jsonBody.error !== null
        ? (jsonBody.error as Record<string, unknown>)
        : null;
    const code =
      typeof jsonBody?.code === "string"
        ? jsonBody.code
        : typeof nestedError?.code === "string"
          ? nestedError.code
          : typeof jsonBody?.error === "string"
            ? jsonBody.error
            : null;
    const message =
      typeof jsonBody?.message === "string"
        ? jsonBody.message
        : typeof nestedError?.message === "string"
          ? nestedError.message
          : typeof jsonBody?.error === "string"
            ? jsonBody.error
            : `Flagify request failed with status ${response.status}`;
    const details =
      jsonBody &&
      typeof jsonBody.details === "object" &&
      jsonBody.details !== null
        ? (jsonBody.details as Record<string, unknown>)
        : null;

    return new FlagifyError(message, {
      status: response.status,
      code,
      details,
      requestId: response.headers.get("x-request-id"),
      url: response.url,
      method,
      body,
      rawBody: typeof jsonBody?.raw === "string" ? jsonBody.raw : null,
    });
  }
}
