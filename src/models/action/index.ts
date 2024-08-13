import { Character } from '../Character'

export abstract class Action {
  protected character: Character
  protected precedence: number

  constructor(character: Character, precedence: number) {
    this.character = character
    this.precedence = precedence
  }

  abstract execute(): void
}
