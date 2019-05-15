import GameFieldAssets from "../../loaders/scenes/GameFieldAssets"
import { Group, Scene } from "three"
import { generateSprite } from "./generateSprite"
import { positionWheels } from "./positionWheels"
import PlayerManager from "../../managers/models/PlayerManager"
import { getCarName, getGroupName } from "../utils/playerNameGetters"

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
  car.name = getCarName(playerName)
  car.add(positionWheels(wheel))

  // Build sprite and camera container (for position)
  const group = new Group()
  group.name = getGroupName(playerName)
  group.add(car)
  group.add(generateSprite(playerName, isOrangeTeam))

  scene.add(group)
  return new PlayerManager(playerName, group)
}
