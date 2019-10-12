import { OrthographicCamera, PerspectiveCamera, Scene, Vector3 } from "three"

import { DEFAULT_CAMERA_OPTIONS } from "../../constants/defaultCameraOptions"
import {
  ABOVE_FIELD_CAMERA,
  BLUE_GOAL_CAMERA,
  FREE_CAMERA,
  ORANGE_GOAL_CAMERA,
  ORTHOGRAPHIC,
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

  const freeCamera = new PerspectiveCamera(...DEFAULT_CAMERA_OPTIONS)
  freeCamera.name = FREE_CAMERA
  freeCamera.position.set(0, 1000, 0)
  scene.add(freeCamera)

  const generateOrthographicCamera = () => {
    const camera = new OrthographicCamera(-320, 320, 240, -240, 0.1, 20000)
    camera.zoom = 0.05
    scene.add(camera)
    return camera
  }

  const ORTHOGRAPHIC_X = 3500
  const ORTHOGRAPHIC_Y = 5000
  const ORTHOGRAPHIC_Z = 5000

  const orthographicCameras = [
    {
      name: ORTHOGRAPHIC.BLUE_LEFT,
      position: new Vector3(ORTHOGRAPHIC_X, ORTHOGRAPHIC_Y, -ORTHOGRAPHIC_Z),
    },
    {
      name: ORTHOGRAPHIC.BLUE_RIGHT,
      position: new Vector3(-ORTHOGRAPHIC_X, ORTHOGRAPHIC_Y, -ORTHOGRAPHIC_Z),
    },
    {
      name: ORTHOGRAPHIC.ORANGE_LEFT,
      position: new Vector3(-ORTHOGRAPHIC_X, ORTHOGRAPHIC_Y, ORTHOGRAPHIC_Z),
    },
    {
      name: ORTHOGRAPHIC.ORANGE_RIGHT,
      position: new Vector3(ORTHOGRAPHIC_X, ORTHOGRAPHIC_Y, ORTHOGRAPHIC_Z),
    },
    {
      name: ORTHOGRAPHIC.ABOVE_FIELD,
      position: new Vector3(0, 8000, 0),
    },
  ].map(({ name, position }) => {
    const camera = generateOrthographicCamera()
    camera.name = name
    camera.position.set(position.x, position.y, position.z)
    camera.lookAt(0, 0, 0)
    return camera
  })

  return [
    blueGoalCamera,
    orangeGoalCamera,
    aboveFieldCamera,
    freeCamera,
    ...orthographicCameras,
  ]
}
