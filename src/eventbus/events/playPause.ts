import { PLAY_PAUSE } from "../../constants/eventNames"
import EventBus from "../EventBus"

export interface PlayPauseEvent {
  paused: boolean
}

export const {
  addEventListener: addPlayPauseListener,
  removeEventListener: removePlayPauseListener,
  dispatch: dispatchPlayPauseEvent,
} = EventBus.buildEvent<PlayPauseEvent>(PLAY_PAUSE)
