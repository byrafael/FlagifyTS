export const normalizeBaseUrl = (value: string) => {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error("Flagify baseUrl is required.");
  }

  return normalized.endsWith("/") ? normalized : `${normalized}/`;
};
