import { PlayerActions } from '@/models/Player/Actions'
import { Turn } from './Turn'

// Round.ts
export class Round {
  private turns: Turn[]

  constructor(playerA: PlayerActions, playerB: PlayerActions) {
    this.turns = [new Turn(playerA), new Turn(playerB)]
  }
}
