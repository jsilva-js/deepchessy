import { Character } from '../Character'
import { Action } from '.'

class Move extends Action {
  private position: { x: number; y: number }

  constructor(character: Character, position: { x: number; y: number }, precedence: number) {
    super(character, precedence)
    this.position = position
  }

  execute(): void {
    this.character.move(this.position)
  }
}
