import { LoadingManager } from "three"

import { ReplayData } from "../models/ReplayData"
import defaultSceneBuilder from "./SceneBuilder"
import defaultAnimationBuilder from "./AnimationBuilder"
import { GameManager } from "../managers/GameManager"

const defaultGameBuilder = async (
  replayData: ReplayData,
  loadingManager?: LoadingManager
) => {
  const { names, colors } = replayData
  const playerInfo = []
  for (let index = 0; index < names.length; index++) {
    playerInfo.push({ name: names[index], orangeTeam: colors[index] })
  }
  const sceneManager = await defaultSceneBuilder(playerInfo, loadingManager)
  const animationManager = defaultAnimationBuilder(
    replayData,
    sceneManager.players.map(manager => manager.playerModel),
    sceneManager.ball
  )
  return GameManager.init({
    sceneManager,
    animationManager,
  })
}

export default defaultGameBuilder
