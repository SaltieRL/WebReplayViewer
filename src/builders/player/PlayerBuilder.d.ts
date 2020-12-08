import { Scene } from "three"

import PlayerManager from "../../managers/models/PlayerManager"
import { ExtendedPlayer } from "../../models/ReplayMetadata"

export default interface PlayerBuilder {
  buildPlayers(
    scene: Scene,
    playerInfo: ExtendedPlayer[]
  ): Promise<PlayerManager[]>
}
