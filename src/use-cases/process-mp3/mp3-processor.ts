import { Mp3FrameHeader } from "./frame-reader"
import { getDataOffset } from "./id3-header"

export const getFrameCount = (rawData: Buffer): number => {
  let index = getDataOffset(rawData)
  let numFrames = 0

  while (index < rawData.length) {
    const nextFrame = Mp3FrameHeader.fromBuffer(rawData, index)
    numFrames++
    index += nextFrame.frameLengthInBytes
  }

  return numFrames
}
