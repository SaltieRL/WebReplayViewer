import { OrthographicCamera, PerspectiveCamera, Scene, AxesHelper } from "three"

import { DEFAULT_CAMERA_OPTIONS } from "../../constants/defaultCameraOptions"
import {
  ABOVE_FIELD_CAMERA,
  BLUE_GOAL_CAMERA,
  ORANGE_GOAL_CAMERA,
  ORTHOGRAPHIC_CAMERA,
} from "../../constants/gameObjectNames"

export const addCameras = (scene: Scene) => {
  const blueGoalCamera = new PerspectiveCamera(...DEFAULT_CAMERA_OPTIONS)
  blueGoalCamera.name = BLUE_GOAL_CAMERA
  blueGoalCamera.position.set(0, 750, -5000)
  scene.add(blueGoalCamera)

  const orangeGoalCamera = new PerspectiveCamera(...DEFAULT_CAMERA_OPTIONS)
  orangeGoalCamera.name = ORANGE_GOAL_CAMERA
  orangeGoalCamera.position.set(0, 750, 5000)
  scene.add(orangeGoalCamera)

  const aboveFieldCamera = new PerspectiveCamera(...DEFAULT_CAMERA_OPTIONS)
  aboveFieldCamera.name = ABOVE_FIELD_CAMERA
  aboveFieldCamera.position.set(0, 2000, 0)
  scene.add(aboveFieldCamera)

  const orthographicCamera = new OrthographicCamera(
    -320,
    320,
    240,
    -240,
    0.1,
    20000
  )
  orthographicCamera.name = ORTHOGRAPHIC_CAMERA
  orthographicCamera.position.set(3500, 5000, 5000)
  orthographicCamera.lookAt(-500, 0, -500)
  orthographicCamera.zoom = 0.05
  scene.add(orthographicCamera)

  return [
    blueGoalCamera,
    orangeGoalCamera,
    aboveFieldCamera,
    orthographicCamera,
  ]
}
