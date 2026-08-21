import { JsonLdIri, JsonLdType } from "@/jsonLDItem"

export function getLdTypeFromUri(uri: JsonLdIri): JsonLdType | undefined {
  // Split the URI on "/" …
  const segments = uri.split("/")
  // … then drop the last segment (the id) and rebuild the URI
  return segments.slice(0, -1).join("/")
}
