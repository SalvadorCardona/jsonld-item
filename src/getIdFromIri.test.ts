import { describe, expect, it } from "vitest"
import { getIdFromIri } from "@/getIdFromIri"

describe("getIdFromIri (sans mocks)", () => {
  it("returns the string unchanged when it is not an API IRI", () => {
    const input = "not-an-api-iri"
    const result = getIdFromIri(input)
    expect(result).toBe(input)
  })

  it("returns the last segment after the slash for a regular API IRI", () => {
    const input = "https://api.example.com/resource/12345"
    const result = getIdFromIri(input)
    expect(result).toBe("12345")
  })

  it("handles an API IRI with a trailing slash", () => {
    const input = "https://api.example.com/resource/12345/"
    const result = getIdFromIri(input)
    // With the current behaviour the last segment is "" when the string ends
    // with '/'. Change the function and these expectations together if empty
    // segments should be skipped instead.
    expect(result).toBe("")
  })

  it("returns the final segment including the query string when present", () => {
    const input = "https://api.example.com/resource/12345?foo=bar"
    const result = getIdFromIri(input)
    expect(result).toBe("12345?foo=bar")
  })

  it("fonctionne avec des IRIs relatives courantes (ex: /api/..)", () => {
    const input = "/api/workspaces/abcd-ef12-3456"
    const result = getIdFromIri(input)
    expect(result).toBe("abcd-ef12-3456")
  })
})
