export const mergeHeaders = (
  ...headerSets: Array<HeadersInit | undefined>
): Headers => {
  const headers = new Headers();

  for (const headerSet of headerSets) {
    if (!headerSet) {
      continue;
    }

    new Headers(headerSet).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
};
