import { LoadingManager } from "three"

import CameraManager from "../managers/CameraManager"
import DataManager from "../managers/DataManager"
import { GameManager } from "../managers/GameManager"
import KeyManager from "../managers/KeyManager"
import DrawingManager from "../managers/DrawingManager"
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
  defaultLoadouts: boolean
}

const defaultGameBuilder = async ({
  clock,
  replayData,
  replayMetadata,
  loadingManager,
  defaultLoadouts
}: GameBuilderOptions) => {
  const players = replayMetadata.players
  const sceneManager = await defaultSceneBuilder(players, loadingManager, defaultLoadouts)
  defaultAnimationBuilder(replayData, sceneManager.players, sceneManager.ball)
  DataManager.init({ replayData, replayMetadata })
  CameraManager.init()
  KeyManager.init()
  DrawingManager.init()

  return GameManager.init({
    clock,
  })
}

export default defaultGameBuilder
