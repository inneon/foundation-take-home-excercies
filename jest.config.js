module.exports = {
  clearMocks: true,
  coverageProvider: "v8",
  modulePathIgnorePatterns: ["lib", "src/integration"],
  setupFiles: ["./src/tests/jest.overrides.ts"],
  testEnvironment: "node",
  preset: "ts-jest",
}
