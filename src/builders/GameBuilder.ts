import { LoadingManager } from "three"

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
  loadingManager?: LoadingManager
}

const defaultGameBuilder = async ({
  clock,
  replayData,
  replayMetadata,
  loadingManager,
}: GameBuilderOptions) => {
  const players = replayMetadata.players.map(player => ({
    isOrangeTeam: player.isOrange,
    loadout: player.loadout,
    name
  }))
  const sceneManager = await defaultSceneBuilder(players, loadingManager)
  defaultAnimationBuilder(replayData, sceneManager.players, sceneManager.ball)
  DataManager.init({ replayData, replayMetadata })
  CameraManager.init()

  return GameManager.init({
    clock,
  })
}

export default defaultGameBuilder
