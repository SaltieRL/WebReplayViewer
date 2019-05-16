import { Scene } from "three"

import GameFieldAssets from "../loaders/scenes/GameFieldAssets"
import SceneManager from "../managers/SceneManager"
import { buildBall } from "./ball/buildBall"
import { buildPlayfield } from "./field/buildPlayfield"
import { buildCarGroup } from "./player/buildCarGroup"
import { addLighting } from "./scene/addLighting"

interface Player {
  name: string
  isOrangeTeam: boolean
}

/**
 * @description The sole purpose of this function is to initialize and tie together all of the
 * required assets for the replay viewer. This includes resizing and lighting to ensure that every
 * object is of the correct color and size. Out of necessity, this function is what loads all
 * required game assets.
 */
const defaultSceneBuilder = async (
  playerInfo: Player[]
): Promise<SceneManager> => {
  const scene = new Scene()

  await GameFieldAssets.load()

  addLighting(scene)
  const field = buildPlayfield(scene)
  const players = playerInfo.map(({ name, isOrangeTeam }) =>
    buildCarGroup(scene, { playerName: name, isOrangeTeam })
  )
  const ball = buildBall(scene)

  return SceneManager.init({
    scene,
    ball,
    field,
    players,
  })
}
export default defaultSceneBuilder
