import { RocketAssetManager, RocketConfig, TextureFormat } from "rl-loadout-lib"
import { Cache, Group, LoadingManager, Scene } from "three"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import { AssetLoader } from "../loaders/AssetLoader"
import HighQualityAssetLoader from "../loaders/impl/HighQualityAssetLoader"
import LowQualityAssetLoader from "../loaders/impl/LowQualityAssetLoader"
import MediumQualityAssetLoader from "../loaders/impl/MediumQualityAssetLoader"
import PlayerManager from "../managers/models/PlayerManager"
import QualityManager, { QualityOptions } from "../managers/QualityManager"
import SceneManager from "../managers/SceneManager"
import { ExtendedPlayer } from "../models/ReplayMetadata"
import { buildBall } from "./ball/buildBall"
import { buildPlayfield } from "./field/buildPlayfield"
import { generateSprite } from "./player/generateSprite"
import { addLighting } from "./scene/addLighting"
import { getGroupName } from "./utils/playerNameGetters"

const buildAssetManager = (loadingManager?: LoadingManager) => {
  const gltfLoader = new GLTFLoader(loadingManager)
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath("/draco/")
  gltfLoader.setDRACOLoader(dracoLoader)

  const config = new RocketConfig({
    gltfLoader,
    loadingManager,
    textureFormat: TextureFormat.PNG,
    useCompressedModels: true,
  })
  return new RocketAssetManager(config)
}

const getAssetLoader = (
  qualityManager: QualityManager,
  loadingManager?: LoadingManager
) => {
  switch (qualityManager.getQuality()) {
    case QualityOptions.LOW:
      return new LowQualityAssetLoader()
    case QualityOptions.MEDIUM:
      return new MediumQualityAssetLoader(buildAssetManager(loadingManager))
    case QualityOptions.HIGH:
      return new HighQualityAssetLoader(buildAssetManager(loadingManager))
  }
}

const toPlayerManager = async (
  assetLoader: AssetLoader,
  playerInfo: ExtendedPlayer,
  loadingManager?: LoadingManager
): Promise<PlayerManager> => {
  const car = await assetLoader.loadCar(playerInfo, loadingManager)

  const group = new Group()
  group.name = getGroupName(playerInfo.name)
  group.add(car)
  group.add(generateSprite(playerInfo.name, playerInfo.isOrange))

  return new PlayerManager(playerInfo.name, playerInfo.isOrange, group)
}

/**
 * @description The sole purpose of this function is to initialize and tie together all of the
 * required assets for the replay viewer. This includes resizing and lighting to ensure that every
 * object is of the correct color and size. Out of necessity, this function is what loads all
 * required game assets.
 */
const defaultSceneBuilder = async (
  playerInfo: ExtendedPlayer[],
  loadingManager?: LoadingManager,
  defaultLoadouts?: boolean
): Promise<SceneManager> => {
  const scene = new Scene()

  const qualityManager = QualityManager.init({})
  const assetLoader = getAssetLoader(qualityManager, loadingManager)

  // Enabled caching used by three's loaders
  Cache.enabled = true

  addLighting(scene)

  const [field, ball] = await Promise.all([
    assetLoader.loadField(loadingManager),
    assetLoader.loadBall(loadingManager),
  ])

  const fieldManager = buildPlayfield(field, scene)
  const ballManager = buildBall(ball, scene)

  const players = await Promise.all(
    playerInfo.map(player =>
      toPlayerManager(assetLoader, player, loadingManager)
    )
  )
  players.forEach(player => scene.add(player.carGroup))

  return SceneManager.init({
    scene,
    ball: ballManager,
    field: fieldManager,
    players,
  })
}
export default defaultSceneBuilder
