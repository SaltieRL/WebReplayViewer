import { CANVAS_RESIZE } from "../../constants/eventNames"
import EventBus from "../EventBus"

/**
 * Fires when the main canvas is resized and its dimensions are adjusted.
 */
export interface CanvasResizeEvent {
  width: number
  height: number
}

export const {
  addEventListener: addCanvasResizeListener,
  removeEventListener: removeCanvasResizeListener,
  dispatch: dispatchCanvasResizeEvent,
} = EventBus.buildEvent<CanvasResizeEvent>(CANVAS_RESIZE)
