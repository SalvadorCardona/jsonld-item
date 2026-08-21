import { JsonLdIri } from "@/jsonLDItem"

export function getIdFromIri(id: JsonLdIri | string): string {
  const parts = id.split("/")
  return parts[parts.length - 1] as string
}
