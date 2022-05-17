import { LoadingManager } from "three"

import CameraManager from "../managers/CameraManager"
import DataManager from "../managers/DataManager"
import { GameManager } from "../managers/GameManager"
import KeyManager from "../managers/KeyManager"
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
  useBallRotation?: boolean
}

const defaultGameBuilder = async ({
  clock,
  replayData,
  replayMetadata,
  loadingManager,
  useBallRotation = true,
}: GameBuilderOptions) => {
  const players = replayMetadata.players
  try {
    const sceneManager = await defaultSceneBuilder(
      players,
      loadingManager,
    )
    defaultAnimationBuilder(replayData, sceneManager.players, sceneManager.ball, useBallRotation)
    DataManager.init({ replayData, replayMetadata })
    CameraManager.init()
    KeyManager.init()

    return GameManager.init({
      clock,
    })
  } catch (e: any) {
    loadingManager?.onError && loadingManager?.onError(e.toString())
    throw e
  }
}

export default defaultGameBuilder
