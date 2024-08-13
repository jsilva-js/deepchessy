import { Character } from '../Character'
import { Action } from '.'

class Attack extends Action {
  private target: Character

  constructor(character: Character, target: Character, precedence: number) {
    super(character, precedence)
    this.target = target
  }

  execute(): void {
    this.character.attack(this.target)
  }
}
