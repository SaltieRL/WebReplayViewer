import { Camera } from "three"

import { CAMERA_CHANGE } from "../../constants/eventNames"
import EventBus from "../EventBus"

/**
 * Event fired when the active camera is updated with a new object.
 */
export interface CameraChangeEvent {
  camera: Camera
}

export const {
  addEventListener: addCameraChangeListener,
  removeEventListener: removeCameraChangeListener,
  dispatch: dispatchCameraChange,
} = EventBus.buildEvent<CameraChangeEvent>(CAMERA_CHANGE)
