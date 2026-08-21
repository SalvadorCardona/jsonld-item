import createUniqId from "@/createUniqId"
import { JsonLdIri, JsonLdType } from "@/jsonLDItem"

export function createJsonLdIri(baseType: JsonLdType, id?: string): JsonLdIri {
  return baseType + "/" + (id ?? createUniqId())
}
