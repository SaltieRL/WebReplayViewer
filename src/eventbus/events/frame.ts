import { FRAME } from "../../constants/eventNames"
import EventBus from "../EventBus"

/**
 * Fires each time the global game clock advances a frame or updates its current frame.
 */
export interface FrameEvent {
  delta: number
  frame: number
  elapsedTime: number
}

export const {
  addEventListener: addFrameListener,
  removeEventListener: removeFrameListener,
  dispatch: dispatchFrameEvent,
} = EventBus.buildEvent<FrameEvent>(FRAME)
