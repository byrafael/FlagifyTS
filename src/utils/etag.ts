export const getEtag = (response: Response) => response.headers.get("etag");
