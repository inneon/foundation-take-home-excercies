import { FrameError } from "../../errors/frame-error"
import { Mp3FrameHeader } from "./frame-reader"

describe("reading a frame", () => {
  describe("sad case", () => {
    it("doesn't accept a frame without frame sync", () => {
      expect(() =>
        Mp3FrameHeader.fromBuffer(Buffer.from([0x00, 0xeb, 0x00, 0x00]), 0),
      ).toThrow(new FrameError("framesyncI"))
      expect(() =>
        Mp3FrameHeader.fromBuffer(Buffer.from([0xff, 0x0b, 0x00, 0x00]), 0),
      ).toThrow(new FrameError("framesyncII"))
    })

    it("parses the version", () => {
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, 0b11111010, 0b00010000, 0x00]),
          0,
        ).version,
      ).toBe("1")
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, 0b11110010, 0b00010000, 0x00]),
          0,
        ).version,
      ).toBe("2")
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, 0b11100010, 0b00010000, 0x00]),
          0,
        ).version,
      ).toBe("2.5")
    })

    it("parses the layer", () => {
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, 0b11100010, 0b00010000, 0x00]),
          0,
        ).layer,
      ).toBe("LayerIII")
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, 0b11100100, 0b00010000, 0x00]),
          0,
        ).layer,
      ).toBe("LayerII")
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, 0b11100110, 0b00010000, 0x00]),
          0,
        ).layer,
      ).toBe("LayerI")
    })

    it("parses the framerate", () => {
      const version1Layer1 = 0b11111110
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, version1Layer1, 0b00010000, 0x00]),
          0,
        ).bitrate,
      ).toBe(32)
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, version1Layer1, 0b00100000, 0x00]),
          0,
        ).bitrate,
      ).toBe(64)
      const version1Layer2 = 0b11111100
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, version1Layer2, 0b01010000, 0x00]),
          0,
        ).bitrate,
      ).toBe(80)
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, version1Layer2, 0b01100000, 0x00]),
          0,
        ).bitrate,
      ).toBe(96)
      const version1Layer3 = 0b11111010
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, version1Layer3, 0b01010000, 0x00]),
          0,
        ).bitrate,
      ).toBe(64)
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, version1Layer3, 0b01100000, 0x00]),
          0,
        ).bitrate,
      ).toBe(80)
    })

    it("parses the frequency", () => {
      const version1Layer1 = 0b11111110
      expect(
        Mp3FrameHeader.fromBuffer(
          Buffer.from([0xff, version1Layer1, 0b00010100, 0x00]),
          0,
        ).frequency,
      ).toBe(48000)
    })
  })
})
