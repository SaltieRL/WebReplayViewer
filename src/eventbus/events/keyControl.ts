import { KEY_CONTROL } from "../../constants/eventNames"
import EventBus from "../EventBus"

/**
 * Fires when the keys are pressed in a certain manner.
 */
export interface KeyControlEvent {
  direction: "forward" | "backward" | "left" | "right" | "up" | "down"
  speed: boolean
}

export const {
  addEventListener: addKeyControlListener,
  removeEventListener: removeKeyControlListener,
  dispatch: dispatchKeyControlEvent,
} = EventBus.buildEvent<KeyControlEvent>(KEY_CONTROL)
