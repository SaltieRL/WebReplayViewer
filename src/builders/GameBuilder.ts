import { LoadingManager } from "three"

import { ReplayData } from "../models/ReplayData"
import defaultSceneBuilder from "./SceneBuilder"
import defaultAnimationBuilder from "./AnimationBuilder"
import { GameManager } from "../managers/GameManager"
import FPSClock from "../utils/FPSClock"
import DataManager from "../managers/DataManager"
import { ReplayMetadata } from "../models/ReplayMetadata"

export interface GameBuilderOptions {
  replayData: ReplayData
  replayMetadata: ReplayMetadata
  clock: FPSClock
  loadingManager?: LoadingManager
}

const defaultGameBuilder = async ({
  clock,
  replayData,
  replayMetadata,
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
  const dataManager = DataManager.init({ replayData, replayMetadata })

  return GameManager.init({
    clock: clock,
    animationManager,
    dataManager,
    sceneManager,
  })
}

export default defaultGameBuilder
