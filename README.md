# jsonld-item

A small toolkit for working with JSON-LD items and collections, as served by
[API Platform](https://api-platform.com) and other Hydra APIs.

A JSON-LD API does not return objects with numeric ids. It returns documents
identified by an IRI, whose relations are themselves IRIs:

```json
{
  "@id": "/api/articles/42",
  "@type": "Article",
  "title": "First article",
  "author": "/api/users/7"
}
```

This package provides the handful of functions you end up needing constantly
against that shape: read an IRI whether you hold the string or the whole object,
extract its id, derive the type from the URI, build items for tests.

```ts
import { getLdIri, getIdFromIri, getLdType } from "jsonld-item"

getLdIri(article) // "/api/articles/42"
getLdIri("/api/articles/42") // "/api/articles/42" — both forms work
getIdFromIri(article["@id"]) // "42"
getLdType(article) // "Article"
```

## Installation

```bash
pnpm add jsonld-item
```

No dependencies and no React: plain TypeScript, usable anywhere — browser or
server.

## API

### Reading

| Function | Purpose |
| --- | --- |
| `getLdIri(item)` | An item's IRI, given either the object or the string |
| `getLdType(item)` | An item's `@type`, same flexibility |
| `getIdFromIri(iri)` | Last segment of an IRI: `/api/articles/42` → `42` |
| `getLdTypeFromUri(iri)` | Path without the id: `/api/articles/42` → `/api/articles` |
| `isJsonLdItem(x)` | Type guard: does the object carry an `@id`? |
| `isJsonLdTypeItem(x)` | Type guard: does the object carry a `@type`? |
| `isApiIri(x, prefix?)` | Is the string an API IRI? Defaults to the `/api/` prefix |

`getLdIri` and `getLdType` accept either an IRI or a full item, which saves you
from writing `typeof x === "string" ? x : x["@id"]` everywhere — a JSON-LD API
returns relations sometimes as an IRI, sometimes as an embedded object.

### Building

```ts
import { createJsonLd, createJsonLdCollection, getItems } from "jsonld-item"

// Builds a complete item: @id, @type, @context and an id derived from the IRI
const article = createJsonLd({ type: "/api/articles", object: { title: "Draft" } })
// → { "@id": "/api/articles/k3f9x2", "@type": "/api/articles", title: "Draft", id: "k3f9x2" }

const collection = createJsonLdCollection({ type: "/api/articles", member: [article] })
getItems(collection) // → [article]
```

When the source object has no `id`, the IRI gets a random one
(`createJsonLdIri`, `createUniqId`) — handy for test fixtures, or for items
created client-side before they are persisted.

### Types

`JsonLDItem<T>` combines your domain type with the JSON-LD shape, and
`JsonLdCollection<T>` does the same for a Hydra collection:

```ts
import type { JsonLDItem, JsonLdCollection } from "jsonld-item"

type Article = JsonLDItem<{ title: string; published: boolean }>
type Articles = JsonLdCollection<{ title: string }>
```

Also exported: `JsonLdIri`, `JsonLdType`, `BaseJsonLdItemInterface`,
`IdAbleInterface`, `JsonLdIriAble`, `JsonLdTypeAble` and
`JsonLdIriContainerInterface`.

## Development

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## License

MIT
