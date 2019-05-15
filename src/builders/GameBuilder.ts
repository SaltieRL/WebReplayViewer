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

  return GameManager.init({
    clock: clock,
  })
}

export default defaultGameBuilder
