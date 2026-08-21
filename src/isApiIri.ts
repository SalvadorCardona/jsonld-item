/**
 * Is this string an IRI served by the API?
 *
 * Distinguishes a relation pointing at the API (`/api/articles/42`) from any
 * other value: external URL, application path, data URI…
 *
 * @param prefix Prefix of the API routes. Defaults to `/api/`, the
 *   API Platform convention.
 */
export default function isApiIri(uri: string | unknown, prefix = "/api/"): boolean {
  if (typeof uri !== "string") return false

  return uri.startsWith(prefix)
}
