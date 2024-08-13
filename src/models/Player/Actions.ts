import { Action } from '../action'

// PlayerActions.ts
export class PlayerActions {
  private actions: Action[]

  constructor() {
    this.actions = []
  }

  addAction(action: Action): void {
    this.actions.push(action)
  }
}
