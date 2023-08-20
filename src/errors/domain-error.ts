export abstract class DomainError extends Error {
  abstract get httpCode(): number
}
