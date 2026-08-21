import { describe, expect, it } from "vitest"
import { createJsonLd } from "@/createJsonLd"
import { getIdFromIri } from "@/getIdFromIri"

describe("createJsonLd (sans mocks)", () => {
  it("adds @id, @type and @context from the given type", () => {
    const type = "/api/animals"
    const item = createJsonLd({ type, object: { name: "Rex" } })

    expect(item["@type"]).toBe(type)
    expect(item["@context"]).toBe(type)
    expect(item["@id"]).toMatch(new RegExp(`^${type}/`))
  })

  it("keeps the properties of the source object", () => {
    const item = createJsonLd({
      type: "/api/animals",
      object: { name: "Rex", age: 3 },
    })

    expect(item.name).toBe("Rex")
    expect(item.age).toBe(3)
  })

  it("generates an @id with a random identifier when the object has no id", () => {
    const type = "/api/animals"
    const item = createJsonLd({ type, object: { name: "Rex" } })

    // type + "/" + a non-empty identifier
    const segment = item["@id"].slice(`${type}/`.length)
    expect(segment.length).toBeGreaterThan(0)
  })

  it("derives the id property from @id when the source object has none", () => {
    const item = createJsonLd({
      type: "/api/animals",
      object: { name: "Rex" },
    })

    const uri = item["@id"]
    expect(Object.hasOwn(item, "id")).toBe(true)
    expect(getIdFromIri(uri)).toBe(item.id)
  })

  it("utilise l'id de l'objet pour construire le @id", () => {
    const type = "/api/animals"
    const item = createJsonLd({
      type,
      object: { id: "abc-123", name: "Rex" },
    })

    expect(item["@id"]).toBe(`${type}/abc-123`)
  })

  it("derives the id property from @id, consistent with the object id", () => {
    const type = "/api/animals"
    const item = createJsonLd({
      type,
      object: { id: "abc-123", name: "Rex" },
    })

    expect(Object.hasOwn(item, "id")).toBe(true)
    expect(item.id).toBe("abc-123")
    expect(item.id).toBe(getIdFromIri(item["@id"]))
  })

  it("traite un id vide comme absent pour le calcul du @id", () => {
    const type = "/api/animals"
    const item = createJsonLd({
      type,
      object: { id: "", name: "Rex" },
    })

    // falsy id → @id built with a random identifier, not with ""
    expect(item["@id"]).not.toBe(`${type}/`)
    expect(item["@id"].slice(`${type}/`.length).length).toBeGreaterThan(0)
  })

  it("prefixes @id with / when the type does not start with a slash", () => {
    const item = createJsonLd({ type: "animals", object: { name: "Rex" } })

    expect(item["@id"]).toMatch(/^\/animals\//)
  })

  it("does not double the slash when the type already starts with /", () => {
    const item = createJsonLd({
      type: "/api/addresses",
      object: { id: "abc-123" },
    })

    expect(item["@id"]).toBe("/api/addresses/abc-123")
  })

  it("generates different @id values for two calls without an id", () => {
    const type = "/api/animals"
    const a = createJsonLd({ type, object: { name: "Rex" } })
    const b = createJsonLd({ type, object: { name: "Rex" } })

    expect(a["@id"]).not.toBe(b["@id"])
  })
})
