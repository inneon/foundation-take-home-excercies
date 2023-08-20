export const getDataOffset = (rawData: Buffer): number => {
  const strategies = [id3v2Strategy, notID3OffsetStrategy]

  for (const strategy of strategies) {
    const strategyResult = strategy(rawData)
    if (strategyResult !== null) {
      return strategyResult
    }
  }

  return 0
}

type ID3OffsetStrategy = (rawData: Buffer) => number | null

const notID3OffsetStrategy: ID3OffsetStrategy = () => 0

const offsetIndexes = [6, 7, 8, 9]
const id3DataStart = 10
const id3v2Strategy: ID3OffsetStrategy = (rawData: Buffer) => {
  const id3HeaderCandidate = rawData.toString("ascii", 0, 3)
  if (id3HeaderCandidate !== "ID3") {
    // not an ID3 header
    return null
  }

  // Note: I think I might have been able to use `readIntBigEndianHere` instead, but I've done this now...
  const id3DataLength = offsetIndexes.reduce((accumulator, index) => {
    const byte = rawData[index]
    return accumulator * 0x100 + byte
  }, 0)

  return id3DataLength + id3DataStart
}

// TODO: other strategies
