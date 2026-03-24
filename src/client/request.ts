import type { ZodType } from "zod";
import type { QueryParams, RequestOptions } from "../types/api";

export interface TransportRequest<T> extends RequestOptions {
  method: string;
  path: string;
  query?: QueryParams;
  body?: unknown;
  schema?: ZodType<T>;
}

export interface SnapshotTransportRequest<T> extends TransportRequest<T> {
  ifNoneMatch?: string;
}
