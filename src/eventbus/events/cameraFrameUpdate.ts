import { Camera, Vector3 } from "three"

import { CAMERA_FRAME_UPDATE } from "../../constants/eventNames"
import EventBus from "../EventBus"

/**
 * Event that fires telling all cameras to adjust their settings.
 */
export interface CameraFrameUpdateEvent {
  ballPosition: Vector3
  ballCam: boolean
  isUsingBoost: boolean
  activeCamera: Camera
}

export const {
  addEventListener: addCameraFrameUpdateListener,
  removeEventListener: removeCameraFrameUpdateListener,
  dispatch: dispatchCameraFrameUpdate,
} = EventBus.buildEvent<CameraFrameUpdateEvent>(CAMERA_FRAME_UPDATE)
