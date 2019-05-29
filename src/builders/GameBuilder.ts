import CameraManager from "../managers/CameraManager"
import DataManager from "../managers/DataManager"
import { GameManager } from "../managers/GameManager"
import { ReplayData } from "../models/ReplayData"
import { ReplayMetadata } from "../models/ReplayMetadata"
import FPSClock from "../utils/FPSClock"
import defaultAnimationBuilder from "./AnimationBuilder"
import defaultSceneBuilder from "./SceneBuilder"

export interface GameBuilderOptions {
  replayData: ReplayData
  replayMetadata: ReplayMetadata
  clock: FPSClock
}

const defaultGameBuilder = async ({
  clock,
  replayData,
  replayMetadata,
}: GameBuilderOptions) => {
  const { names: playerNames, colors } = replayData
  const players = playerNames.map((name, index) => {
    const isOrangeTeam = colors[index]
    return { name, isOrangeTeam }
  })
  const sceneManager = await defaultSceneBuilder(players)
  defaultAnimationBuilder(replayData, sceneManager.players, sceneManager.ball)
  DataManager.init({ replayData, replayMetadata })
  CameraManager.init()

  return GameManager.init({
    clock,
  })
}

export default defaultGameBuilder
