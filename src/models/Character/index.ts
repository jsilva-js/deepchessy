import { Ability } from '../action/Ability'

export class Character {
  private strength: number
  private dexterity: number
  private intellect: number
  private hp: number
  private mp: number
  private stamina: number

  constructor(strength: number, dexterity: number, intellect: number) {
    this.strength = strength
    this.dexterity = dexterity
    this.intellect = intellect
    this.hp = strength * 10 // Adjust the multiplier as needed
    this.mp = intellect * 5 // Adjust the multiplier as needed
    this.stamina = dexterity * 2 // Adjust the multiplier as needed
  }

  // Getters and setters for attributes
  // ...

  attack(target: Character): void {
    // Implement attack logic
  }

  move(position: { x: number; y: number }): void {
    // Implement move logic
  }

  useAbility(ability: Ability): void {
    // Implement ability usage logic
  }
}
