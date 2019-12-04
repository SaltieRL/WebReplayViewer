import { BodyModel } from "rl-loadout-lib"
import { Group, Scene } from "three"

import PlayerManager from "../../managers/models/PlayerManager"
import { ExtendedPlayer } from "../../models/ReplayMetadata"
import { getCarName, getGroupName } from "../utils/playerNameGetters"
import { generateSprite } from "./generateSprite"

export const buildRocketLoadoutGroup = (
  scene: Scene,
  { body, player }: { body: BodyModel; player: ExtendedPlayer }
) => {
  body.scene.name = getCarName(player.name)

  // Build sprite and camera container (for position)
  const group = new Group()
  group.name = getGroupName(player.name)
  group.add(body.scene)
  group.add(generateSprite(player.name, player.isOrange))

  scene.add(group)
  return new PlayerManager(player.name, player.isOrange, group)
}
