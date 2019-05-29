import { Group, Scene } from "three"

import GameFieldAssets from "../../loaders/scenes/GameFieldAssets"
import PlayerManager from "../../managers/models/PlayerManager"
import { getCarName, getGroupName } from "../utils/playerNameGetters"
import { generateSprite } from "./generateSprite"
import { positionWheels } from "./positionWheels"

interface Options {
  playerName: string
  isOrangeTeam: boolean
}

export const buildCarGroup = (
  scene: Scene,
  { playerName, isOrangeTeam }: Options
) => {
  const { orangeCar, blueCar, wheel } = GameFieldAssets.getAssets()

  // Build the car with its wheels (for rotation)
  const car = isOrangeTeam ? orangeCar.clone(true) : blueCar.clone(true)
  car.children.forEach(child => (child.position.y += 31))
  car.name = getCarName(playerName)
  car.add(positionWheels(wheel))

  // Build sprite and camera container (for position)
  const group = new Group()
  group.name = getGroupName(playerName)
  group.add(car)
  group.add(generateSprite(playerName, isOrangeTeam))

  scene.add(group)
  return new PlayerManager(playerName, isOrangeTeam, group)
}
