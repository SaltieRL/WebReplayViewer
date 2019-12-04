import { GameManager } from "../../managers/GameManager"
import FPSClock from "../../utils/FPSClock"
import { loadReplay } from "./loadReplay"

export const loadBuilderFromReplay = async (
  replayId: string,
  defaultLoadouts: boolean = false
) => {
  return loadReplay(replayId).then(([replayData, replayMetadata]) => {
    return GameManager.builder({
      replayData,
      replayMetadata,
      clock: FPSClock.convertReplayToClock(replayData),
      defaultLoadouts,
    })
  })
}
