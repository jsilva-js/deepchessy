import { PlayerActions } from '../Player/Actions'
import { Round } from './Round'

// Match.ts
class Match {
  private rounds: Round[]
  private playerA: PlayerActions
  private playerB: PlayerActions

  constructor() {
    this.rounds = []
    this.playerA = new PlayerActions()
    this.playerB = new PlayerActions()
  }

  addRound(): void {
    const round = new Round(this.playerA, this.playerB)
    this.rounds.push(round)
  }

  // Methods to manage player actions, characters, etc.
  // ...
}
