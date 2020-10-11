import { Group, LoadingManager, Scene } from "three"

import BasicCarAssets from "../../loaders/scenes/BasicCarAssets"
import PlayerManager from "../../managers/models/PlayerManager"
import { ExtendedPlayer } from "../../models/ReplayMetadata"
import { getCarName, getGroupName } from "../utils/playerNameGetters"
import { generateSprite } from "./generateSprite"
import PlayerBuilder from "./PlayerBuilder"
import { positionWheels } from "./positionWheels"

export default class BasicPlayerBuilder implements PlayerBuilder {
  private readonly basicCarAssets: BasicCarAssets

  constructor(loadingManager?: LoadingManager) {
    this.basicCarAssets = new BasicCarAssets(loadingManager)
  }

  async buildPlayers(
    scene: Scene,
    playerInfo: ExtendedPlayer[]
  ): Promise<PlayerManager[]> {
    await this.basicCarAssets.load()
    return playerInfo.map((player) => this.buildCarGroup(scene, player))
  }

  private buildCarGroup(scene: Scene, player: ExtendedPlayer): PlayerManager {
    const { orangeCar, blueCar, wheel } = this.basicCarAssets.getAssets()

    orangeCar.children.forEach((child) => {
      child.castShadow = true
      child.receiveShadow = true
    })
    blueCar.children.forEach((child) => {
      child.castShadow = true
      child.receiveShadow = true
    })
    wheel.children.forEach((child) => {
      child.castShadow = true
      child.receiveShadow = true
    })

    // Build the car with its wheels (for rotation)
    const car = player.isOrange ? orangeCar.clone(true) : blueCar.clone(true)
    car.children.forEach((child) => (child.position.y += 31))
    car.name = getCarName(player.name)
    car.add(positionWheels(wheel))

    // Build sprite and camera container (for position)
    const group = new Group()
    group.name = getGroupName(player.name)
    group.add(car)
    group.add(generateSprite(player.name, player.isOrange))

    scene.add(group)
    return new PlayerManager(player.name, player.isOrange, group)
  }
}
