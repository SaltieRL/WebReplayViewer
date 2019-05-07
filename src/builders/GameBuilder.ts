import { LoadingManager } from "three"

import { ReplayData } from "../models/ReplayData"
import defaultSceneBuilder from "./SceneBuilder"
import defaultAnimationBuilder from "./AnimationBuilder"
import { GameManager } from "../managers/GameManager"
import FPSClock from "../utils/FPSClock"

interface GameBuilderOptions {
  replayData: ReplayData
  clock: FPSClock
  loadingManager?: LoadingManager
}

const defaultGameBuilder = async ({
  clock,
  replayData,
  loadingManager,
}: GameBuilderOptions) => {
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
    clock: clock,
    sceneManager,
    animationManager,
  })
}

export default defaultGameBuilder
