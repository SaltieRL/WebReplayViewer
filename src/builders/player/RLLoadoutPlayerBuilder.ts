import {
  BodyModel,
  RocketAssetManager,
  RocketConfig,
  TextureFormat,
} from "rl-loadout-lib"
import { Group, LoadingManager, Scene } from "three"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import { loadRlLoadout } from "../../loaders/storage/loadRlLoadout"
import PlayerManager from "../../managers/models/PlayerManager"
import { ExtendedPlayer } from "../../models/ReplayMetadata"
import { getCarName, getGroupName } from "../utils/playerNameGetters"
import { generateSprite } from "./generateSprite"
import PlayerBuilder from "./PlayerBuilder"

export default class RLLoadoutPlayerBuilder implements PlayerBuilder {
  private readonly manager: RocketAssetManager
  private readonly defaultLoadouts: boolean

  constructor(loadingManager?: LoadingManager, defaultLoadouts?: boolean) {
    this.defaultLoadouts = defaultLoadouts || true
    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("/draco/")
    gltfLoader.setDRACOLoader(dracoLoader)

    const config = new RocketConfig({
      gltfLoader,
      loadingManager,
      textureFormat: TextureFormat.PNG,
      useCompressedModels: true,
    })
    this.manager = new RocketAssetManager(config)
  }

  async buildPlayers(
    scene: Scene,
    playerInfo: ExtendedPlayer[]
  ): Promise<PlayerManager[]> {
    const bodyPromises = playerInfo.map((player) =>
      loadRlLoadout(this.manager, player, this.defaultLoadouts)
    )
    const bodies = await Promise.all(bodyPromises)

    return bodies.map((value) => this.buildRocketLoadoutGroup(scene, value))
  }

  private buildRocketLoadoutGroup(
    scene: Scene,
    { body, player }: { body: BodyModel; player: ExtendedPlayer }
  ) {
    body.scene.name = getCarName(player.name)

    // Build sprite and camera container (for position)
    const group = new Group()
    group.name = getGroupName(player.name)
    group.add(body.scene)
    group.add(generateSprite(player.name, player.isOrange))

    scene.add(group)
    return new PlayerManager(player.name, player.isOrange, group)
  }
}
