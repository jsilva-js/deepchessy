import { PlayerActions } from '@/models/Player/Actions'

export class Turn {
  private player: PlayerActions

  constructor(player: PlayerActions) {
    this.player = player
  }
}
