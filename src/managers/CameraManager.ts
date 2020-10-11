import { Camera, OrthographicCamera, PerspectiveCamera, Vector3 } from "three"

import {
  ABOVE_FIELD_CAMERA,
  BLUE_GOAL_CAMERA,
  FREE_CAMERA,
  ORANGE_GOAL_CAMERA,
  ORTHOGRAPHIC,
} from "../constants/gameObjectNames"
import { dispatchCameraChange } from "../eventbus/events/cameraChange"
import { dispatchCameraFrameUpdate } from "../eventbus/events/cameraFrameUpdate"
import {
  addCanvasResizeListener,
  CanvasResizeEvent,
  removeCanvasResizeListener,
} from "../eventbus/events/canvasResize"
import { addFrameListener, removeFrameListener } from "../eventbus/events/frame"
import {
  addKeyControlListener,
  applyDirections,
  KeyControlEvent,
  removeKeyControlListener,
} from "../eventbus/events/keyControl"
import { isOrthographicCamera } from "../operators/isOrthographicCamera"
import SceneManager from "./SceneManager"

class CameraManager {
  activeCamera: Camera

  private readonly defaultCamera: Camera
  private width: number
  private height: number
  private ballCam: boolean

  private constructor() {
    this.activeCamera = SceneManager.getInstance().field.getCamera(
      ORANGE_GOAL_CAMERA
    )!
    this.defaultCamera = this.activeCamera
    this.width = 640
    this.height = 480
    this.ballCam = true

    this.activeCamera.position.z = 5000
    this.activeCamera.position.y = 750

    addFrameListener(this.update)
    addCanvasResizeListener(this.updateSize)
    addKeyControlListener(this.onKeyControl)
  }

  toggleBallCam() {
    this.ballCam = !this.ballCam
    this.update()
  }

  private readonly updateSize = ({ width, height }: CanvasResizeEvent) => {
    this.width = width
    this.height = height
    this.updateCameraSize()
  }

  private readonly update = () => {
    const { position } = SceneManager.getInstance().ball.ball
    dispatchCameraFrameUpdate({
      ballPosition: position,
      ballCam: this.ballCam,
      isUsingBoost: false,
      activeCamera: this.activeCamera
    })

    if (!isOrthographicCamera(this.activeCamera)) {
      this.activeCamera.lookAt(position)
    }
  }

  setCameraLocation({ playerName, fieldLocation }: CameraLocationOptions) {
    const { players, field } = SceneManager.getInstance()
    if (playerName) {
      const player = players.find(p => p.playerName === playerName)
      if (player) {
        this.setActiveCamera(player.camera)
      }
    } else if (fieldLocation) {
      switch (fieldLocation) {
        case "orange":
          this.setActiveCamera(field.getCamera(ORANGE_GOAL_CAMERA))
          break
        case "blue":
          this.setActiveCamera(field.getCamera(BLUE_GOAL_CAMERA))
          break
        case "center":
          this.setActiveCamera(field.getCamera(ABOVE_FIELD_CAMERA))
          break
        case "freecam":
          const freecam = field.getCamera(FREE_CAMERA) as PerspectiveCamera
          if (!isOrthographicCamera(this.activeCamera)) {
            if (freecam.parent) {
              freecam.parent.updateMatrixWorld()
            }
            freecam.position.setFromMatrixPosition(
              this.activeCamera.matrixWorld
            )
            freecam.rotation.fromArray(this.activeCamera.rotation.toArray())
          }
          this.setActiveCamera(freecam)
          break
        case "orthographic-above-field":
          this.setActiveCamera(field.getCamera(ORTHOGRAPHIC.ABOVE_FIELD))
          break
        case "orthographic-orange-left":
          this.setActiveCamera(field.getCamera(ORTHOGRAPHIC.ORANGE_LEFT))
          break
        case "orthographic-orange-right":
          this.setActiveCamera(field.getCamera(ORTHOGRAPHIC.ORANGE_RIGHT))
          break
        case "orthographic-blue-left":
          this.setActiveCamera(field.getCamera(ORTHOGRAPHIC.BLUE_LEFT))
          break
        case "orthographic-blue-right":
          this.setActiveCamera(field.getCamera(ORTHOGRAPHIC.BLUE_RIGHT))
          break
        default:
          this.setActiveCamera(this.defaultCamera)
      }
    }

    // Dispatch to all manager listeners
    dispatchCameraChange({ camera: this.activeCamera })
  }

  private readonly onKeyControl = ({ directions, speed }: KeyControlEvent) => {
    if (this.activeCamera.name === FREE_CAMERA) {
      const cameraDirection = new Vector3()
      this.activeCamera.getWorldDirection(cameraDirection)
      const multiplier = speed ? 75 : 15
      const newDirection = applyDirections(
        cameraDirection,
        directions,
        multiplier
      )
      const newPosition = new Vector3()
      newPosition.copy(this.activeCamera.position)
      newPosition.add(newDirection)

      // Don't allow phasing inside of the ball
      const { position: ballPosition } = SceneManager.getInstance().ball.ball
      if (ballPosition.distanceTo(newPosition) < 200) {
        return
      }
      // Don't allow cameras under the field
      if (newPosition.y < 10) {
        newPosition.setY(10)
      }

      // If all checks pass, set the new position
      this.activeCamera.position.copy(newPosition)
      this.update()
      dispatchCameraChange({ camera: this.activeCamera })
    }
  }

  private updateCameraSize() {
    const { activeCamera: camera, width, height } = this

    if (camera instanceof PerspectiveCamera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    } else if (camera instanceof OrthographicCamera) {
      /**
       * Here, we are computing the zoom of the camera given the aspect ratio. For cameras with an
       * aspect ratio greater than 4:3, we base the zoom on the height. Otherwise, we use width. The
       * minimum zoom should always be 0.02.
       *
       * The zoom when based on the height is a simple linear function y = x / 12500 + 0.01, where x
       * is the new height and y is the desired zoom.
       *
       * The denominator of the width-based computation is simply the slope of the previous
       * function, 12500, multiplied by 1.3 since this is aspect ratio breaking point we have set in
       * the if statement.
       */
      if (width / height > 1.3) {
        const newZoom = height / 12500 + 0.01
        camera.zoom = Math.max(newZoom, 0.02)
      } else {
        const newZoom = width / 16250 + 0.01
        camera.zoom = Math.max(newZoom, 0.02)
      }
      camera.left = -width / 2
      camera.right = width / 2
      camera.top = height / 2
      camera.bottom = -height / 2
      camera.updateProjectionMatrix()
    }
  }

  private setActiveCamera(camera?: Camera) {
    if (!camera) {
      return
    }
    this.activeCamera = camera
    this.updateCameraSize()
    this.update()
  }

  /**
   * ========================================
   * Managers are singletons
   * ========================================
   */
  private static instance?: CameraManager
  static getInstance() {
    if (!CameraManager.instance) {
      throw new Error("CameraManager not initialized with call to `init`")
    }
    return CameraManager.instance
  }
  static init() {
    CameraManager.instance = new CameraManager()
    return CameraManager.instance
  }
  static destruct() {
    const { instance } = CameraManager
    if (instance) {
      removeFrameListener(instance.update)
      removeCanvasResizeListener(instance.updateSize)
      removeKeyControlListener(instance.onKeyControl)
      CameraManager.instance = undefined
    }
  }
}

export interface CameraLocationOptions {
  playerName?: string
  fieldLocation?:
    | "orange"
    | "blue"
    | "center"
    | "freecam"
    | "orthographic-blue-right"
    | "orthographic-blue-left"
    | "orthographic-orange-right"
    | "orthographic-orange-left"
    | "orthographic-above-field"
}

export default CameraManager
