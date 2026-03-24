export type FetchLike = (
  input: URL | RequestInfo,
  init?: RequestInit,
) => Promise<Response>;

export type ApiKeyKind = "project_admin" | "project_read" | "client_runtime";

export type FlagifyScope =
  | "*"
  | "projects:read"
  | "projects:write"
  | "flags:read"
  | "flags:write"
  | "clients:read"
  | "clients:write"
  | "overrides:read"
  | "overrides:write"
  | "keys:read"
  | "keys:write"
  | "runtime:read"
  | "runtime:read_any";

export interface AuthContext {
  apiKey: string;
  projectId?: string;
}

export interface FlagifyClientOptions extends AuthContext {
  baseUrl: string;
  fetch?: FetchLike;
  validateResponses?: boolean;
  userAgent?: string;
}
