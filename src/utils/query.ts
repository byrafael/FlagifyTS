import type { QueryParams, QueryValue } from "../types/api";

const appendQueryValue = (
  searchParams: URLSearchParams,
  key: string,
  value: Exclude<QueryValue, undefined | null>,
) => {
  if (Array.isArray(value)) {
    for (const item of value) {
      searchParams.append(key, String(item));
    }
    return;
  }

  searchParams.append(key, String(value));
};

export const applyQueryParams = (url: URL, query?: QueryParams) => {
  if (!query) {
    return url;
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }

    appendQueryValue(url.searchParams, key, value);
  }

  return url;
};
