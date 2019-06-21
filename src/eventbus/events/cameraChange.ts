import { Camera } from "three"

import { CAMERA_CHANGE } from "../../constants/eventNames"
import EventBus from "../EventBus"

export interface CameraChangeEvent {
  camera: Camera
}

export const {
  addEventListener: addCameraChangeListener,
  removeEventListener: removeCameraChangeListener,
  dispatch: dispatchCameraChange,
} = EventBus.buildEvent<CameraChangeEvent>(CAMERA_CHANGE)
