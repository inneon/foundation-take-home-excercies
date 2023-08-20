import { FrameError } from "../../errors/frame-error"

type Version = "2.5" | "2" | "1"
const toVersion = (bits: number): Version => {
  switch (bits) {
    case 0b00000000:
      return "2.5"
    case 0b00010000:
      return "2"
    case 0b00011000:
      return "1"
  }
  throw new FrameError("version")
}

type Layer = "LayerIII" | "LayerII" | "LayerI"
const toLayer = (bits: number): Layer => {
  switch (bits) {
    case 0b00000010:
      return "LayerIII"
    case 0b00000100:
      return "LayerII"
    case 0b00000110:
      return "LayerI"
  }
  throw new FrameError("layer")
}

const toBitrate = (bits: number, version: Version, layer: Layer): number => {
  switch (version) {
    case "1":
      switch (layer) {
        case "LayerI":
          return bits * 2
        case "LayerII":
          switch (bits) {
            case 0b00010000:
              return 32
            case 0b00100000:
              return 48
            case 0b00110000:
              return 56
            case 0b01000000:
              return 64
            case 0b01010000:
              return 80
            case 0b01100000:
              return 96
            case 0b01110000:
              return 112
            case 0b10000000:
              return 128
            case 0b10010000:
              return 160
            case 0b10100000:
              return 192
            case 0b10110000:
              return 224
            case 0b11000000:
              return 256
            case 0b11010000:
              return 320
            case 0b11100000:
              return 384
          }
        case "LayerIII":
          switch (bits) {
            case 0b00010000:
              return 32
            case 0b00100000:
              return 40
            case 0b00110000:
              return 48
            case 0b01000000:
              return 56
            case 0b01010000:
              return 64
            case 0b01100000:
              return 80
            case 0b01110000:
              return 96
            case 0b10000000:
              return 112
            case 0b10010000:
              return 128
            case 0b10100000:
              return 160
            case 0b10110000:
              return 192
            case 0b11000000:
              return 224
            case 0b11010000:
              return 256
            case 0b11100000:
              return 320
          }
      }
    case "2":
    case "2.5":
      switch (layer) {
        case "LayerI":
          switch (bits) {
            case 0b00010000:
              return 32
            case 0b00100000:
              return 48
            case 0b00110000:
              return 56
            case 0b01000000:
              return 64
            case 0b01010000:
              return 80
            case 0b01100000:
              return 96
            case 0b01110000:
              return 112
            case 0b10000000:
              return 128
            case 0b10010000:
              return 144
            case 0b10100000:
              return 160
            case 0b10110000:
              return 176
            case 0b11000000:
              return 192
            case 0b11010000:
              return 224
            case 0b11100000:
              return 256
          }
        case "LayerII":
        case "LayerIII":
          switch (bits) {
            case 0b00010000:
              return 8
            case 0b00100000:
              return 16
            case 0b00110000:
              return 24
            case 0b01000000:
              return 32
            case 0b01010000:
              return 40
            case 0b01100000:
              return 48
            case 0b01110000:
              return 56
            case 0b10000000:
              return 64
            case 0b10010000:
              return 80
            case 0b10100000:
              return 96
            case 0b10110000:
              return 112
            case 0b11000000:
              return 128
            case 0b11010000:
              return 144
            case 0b11100000:
              return 160
          }
      }
  }
  throw new FrameError("bitrate")
}

const toFrequency = (bits: number, version: Version): number => {
  switch (version) {
    case "1":
      switch (bits) {
        case 0b0000:
          return 44100
        case 0b0100:
          return 48000
        case 0b1000:
          return 32000
      }

    case "2":
      switch (bits) {
        case 0b0000:
          return 22050
        case 0b0100:
          return 24000
        case 0b1000:
          return 16000
      }

    case "2.5":
      switch (bits) {
        case 0b0000:
          return 11025
        case 0b0100:
          return 12000
        case 0b1000:
          return 8000
      }
  }
  throw new FrameError("frequency")
}

const toPadding = (bits: number): boolean => {
  return bits === 0b00000010
}

export class Mp3FrameHeader {
  private readonly _version: Version
  private readonly _layer: Layer
  private readonly _bitrate: number
  private readonly _frequency: number
  private readonly _padding: boolean

  public get version(): Version {
    return this._version
  }
  public get layer(): Layer {
    return this._layer
  }
  public get bitrate(): number {
    return this._bitrate
  }
  public get frequency(): number {
    return this._frequency
  }
  public get padding(): boolean {
    return this._padding
  }

  public get samplesPerFrame(): number {
    if (this.version === "1") {
      return this.layer === "LayerI" ? 284 : 1152
    }
    switch (this.layer) {
      case "LayerI":
        return 384
      case "LayerII":
        return 1152
      case "LayerIII":
        return 576
    }
  }
  public get frameLengthInBytes(): number {
    const paddingSize = this.layer === "LayerI" ? 4 : 1
    return (
      (((this.bitrate * 1000) / 8) * this.samplesPerFrame) / this.frequency +
      (this.padding ? paddingSize : 0)
    )
  }

  private constructor(
    version: Version,
    layer: Layer,
    bitrate: number,
    frequency: number,
    padding: boolean,
  ) {
    this._version = version
    this._layer = layer
    this._bitrate = bitrate
    this._frequency = frequency
    this._padding = padding
  }

  public static fromBuffer(rawData: Buffer, offset: number): Mp3FrameHeader {
    // See http://www.mp3-tech.org/programmer/frame_header.html

    // Frames must start with frame sync 11111111 111xxxxx
    if (rawData[offset] !== 0xff) {
      throw new FrameError("framesyncI")
    }
    if ((rawData[offset + 1] & 0b11100000) !== 0b11100000) {
      throw new FrameError("framesyncII")
    }

    const version = toVersion(rawData[offset + 1] & 0b00011000)
    const layer = toLayer(rawData[offset + 1] & 0b00000110)
    const bitrate = toBitrate(rawData[offset + 2] & 0b11110000, version, layer)
    const frequency = toFrequency(rawData[offset + 2] & 0b00001100, version)
    const padding = toPadding(rawData[offset + 2] & 0b00000010)

    return new Mp3FrameHeader(version, layer, bitrate, frequency, padding)
  }
}
