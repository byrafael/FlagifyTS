# FlagifyTS

TypeScript SDK for the self-hosted Flagify API.

`FlagifyTS` is built with Bun, exports ESM, uses the standard `fetch` API, and supports root, project-scoped, and client runtime keys.

## Installation

```bash
bun add flagifyts
```

## Create a client

```ts
import { FlagifyClient } from "flagifyts";

const client = new FlagifyClient({
  baseUrl: "https://flagify.example.com",
  apiKey: process.env.FLAGIFY_API_KEY!,
});
```

## Root and admin usage

```ts
const projects = await client.projects.list({ limit: 50, offset: 0 });

const created = await client.projects.create({
  name: "Storefront",
  slug: "storefront",
});

const key = await client.keys.create({
  kind: "project_read",
  projectId: created.id,
  name: "frontend read key",
});
```

## Project-scoped usage

```ts
const project = client.project("project_123");

const flags = await project.flags.list({ includeArchived: false });

await project.flags.update({
  flagId: "flag_123",
  data: {
    name: "New checkout",
    status: "active",
  },
});
```

## Runtime usage

```ts
const runtimeClient = new FlagifyClient({
  baseUrl: "https://flagify.example.com",
  apiKey: process.env.FLAGIFY_RUNTIME_KEY!,
});

const config = await runtimeClient.runtime.getBoundConfig({
  environment: "production",
});
```

## Snapshot usage with ETag

```ts
const snapshot = await client.runtime.getEnvironmentSnapshot({
  projectId: "project_123",
  environmentKey: "production",
  ifNoneMatch: previousEtag,
});

if (snapshot.notModified) {
  console.log(snapshot.etag);
} else {
  console.log(snapshot.data.flags);
}
```

## Browser usage

```ts
const browserClient = new FlagifyClient({
  baseUrl: "https://flagify.example.com",
  apiKey: "project-read-key",
  fetch: window.fetch.bind(window),
});
```

## Development

```bash
bun install
bun run check
```
