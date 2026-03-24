export type Nullable<T> = T | null;

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | { [key: string]: JsonValue }
  | JsonValue[];

export type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ReadonlyArray<string | number | boolean>;

export type QueryParams = Record<string, QueryValue>;

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface RequestOptions {
  headers?: HeadersInit;
  signal?: AbortSignal;
  validateResponse?: boolean;
}

export interface SnapshotRequestOptions extends RequestOptions {
  ifNoneMatch?: string;
}

export interface SnapshotResponse<T> {
  data: T | null;
  etag: string | null;
  notModified: boolean;
}
