import { Cache, LoadingManager, Scene } from "three"

import GameFieldAssets from "../loaders/scenes/GameFieldAssets"
import PlayerManager from "../managers/models/PlayerManager"
import SceneManager from "../managers/SceneManager"
import { ExtendedPlayer } from "../models/ReplayMetadata"
import { buildBall } from "./ball/buildBall"
import { buildPlayfield } from "./field/buildPlayfield"
import BasicPlayerBuilder from "./player/BasicPlayerBuilder"
import { addLighting } from "./scene/addLighting"

const getPlayersAndScene = async (
  playerInfo: ExtendedPlayer[],
  loadingManager?: LoadingManager,
): Promise<[PlayerManager[], Scene]> => {
  const basicBuilder = new BasicPlayerBuilder(loadingManager)
  const scene = new Scene()
  const players = await basicBuilder.buildPlayers(scene, playerInfo)
  return [players, scene]
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
): Promise<SceneManager> => {
  // Enabled caching used by three's loaders
  Cache.enabled = true

  if (loadingManager) {
    GameFieldAssets.loadingManager = loadingManager
  }
  await GameFieldAssets.load()

  const [players, scene] = await getPlayersAndScene(
    playerInfo,
    loadingManager,
  )

  addLighting(scene)
  const field = buildPlayfield(scene)
  const ball = buildBall(scene)

  return SceneManager.init({
    scene,
    ball,
    field,
    players,
  })
}

export default defaultSceneBuilder
