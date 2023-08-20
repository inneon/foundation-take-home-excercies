import { getDataOffset } from "./id3-header"

describe("reading ID3 headers", () => {
  describe("getting the data offset", () => {
    it("returns 0 if the header is not present", () => {
      const rawData = Buffer.from("Someother format")

      expect(getDataOffset(rawData)).toBe(0)
    })

    it("reads the offset data from correct bytes", () => {
      const rawData = Buffer.from([
        0x49, 0x44, 0x33, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x22, 0x54,
      ])

      expect(getDataOffset(rawData)).toBe(44)
    })
  })
})
