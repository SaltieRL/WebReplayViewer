import { RESTART } from "../../constants/eventNames"
import EventBus from "../EventBus"

/**
 * Fires when the game should be rebuilt
 */
export interface RestartEvent {}

export const {
  addEventListener: addRestartListener,
  removeEventListener: removeRestartListener,
  dispatch: dispatchRestartEvent,
} = EventBus.buildEvent<RestartEvent>(RESTART)
