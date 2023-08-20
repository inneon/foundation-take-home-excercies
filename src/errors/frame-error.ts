import { DomainError } from "./domain-error"

export class FrameError extends DomainError {
  private readonly _field
  constructor(field: string) {
    super()
    this._field = field
  }

  get httpCode(): number {
    return 400
  }
}
