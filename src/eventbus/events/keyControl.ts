import { Vector3 } from "three"

import { KEY_CONTROL } from "../../constants/eventNames"
import EventBus from "../EventBus"

type Direction = "forward" | "backward" | "left" | "right" | "up" | "down"

/**
 * Fires when the keys are pressed in a certain manner.
 */
export interface KeyControlEvent {
  directions: Direction[]
  speed: boolean
}

export const {
  addEventListener: addKeyControlListener,
  removeEventListener: removeKeyControlListener,
  dispatch: dispatchKeyControlEvent,
} = EventBus.buildEvent<KeyControlEvent>(KEY_CONTROL)

export const applyDirections = (
  cameraDirection: Vector3,
  directions: Direction[],
  multiplier: number
) => {
  const newVector = new Vector3()
  directions.forEach(direction => {
    const localCameraDirection = new Vector3()
    localCameraDirection.copy(cameraDirection)
    switch (direction) {
      case "forward":
        newVector.add(localCameraDirection.multiplyScalar(multiplier))
        break
      case "backward":
        newVector.sub(localCameraDirection.multiplyScalar(multiplier))
        break
      case "up":
        newVector.add(new Vector3(0, multiplier, 0))
        break
      case "down":
        newVector.add(new Vector3(0, -multiplier, 0))
        break
      case "left":
        localCameraDirection.cross(new Vector3(0, -1, 0))
        newVector.add(localCameraDirection.multiplyScalar(multiplier))
        break
      case "right":
        localCameraDirection.cross(new Vector3(0, 1, 0))
        newVector.add(localCameraDirection.multiplyScalar(multiplier))
        break
    }
  })
  return newVector
}
