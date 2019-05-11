import { loadReplay } from "./loadReplay"
import { GameManager } from "../../managers/GameManager"
import FPSClock from "../../utils/FPSClock"

export const loadBuilderFromReplay = async (replayId: string) => {
  return loadReplay(replayId).then(([replayData, replayMetadata]) => {
    return GameManager.builder({
      replayData,
      replayMetadata,
      clock: FPSClock.convertReplayToClock(replayData),
    })
  })
}
