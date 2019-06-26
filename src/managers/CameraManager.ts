import { Camera, OrthographicCamera, PerspectiveCamera } from "three"

import {
  ABOVE_FIELD_CAMERA,
  BLUE_GOAL_CAMERA,
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
import SceneManager from "./SceneManager"

const ORTHOGRAPHIC_CAMERA_NAMES: string[] = Object.keys(ORTHOGRAPHIC).map(
  (key: string) => {
    return (ORTHOGRAPHIC as any)[key] as string
  }
)

class CameraManager {
  activeCamera: Camera

  private readonly defaultCamera: Camera
  private width: number
  private height: number

  private constructor() {
    this.activeCamera = SceneManager.getInstance().field.getCamera(
      ORANGE_GOAL_CAMERA
    ) as any
    this.defaultCamera = this.activeCamera
    this.width = 640
    this.height = 480

    this.activeCamera.position.z = 5000
    this.activeCamera.position.y = 750

    addFrameListener(this.update)
    addCanvasResizeListener(this.updateSize)
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
      ballCam: true,
      isUsingBoost: false,
    })

    if (!ORTHOGRAPHIC_CAMERA_NAMES.includes(this.activeCamera.name)) {
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
          this.setActiveCamera(field.getCamera(ORANGE_GOAL_CAMERA) as any)
          break
        case "blue":
          this.setActiveCamera(field.getCamera(BLUE_GOAL_CAMERA) as any)
          break
        case "center":
          this.setActiveCamera(field.getCamera(ABOVE_FIELD_CAMERA) as any)
          break
        case "orthographic-above-field":
          this.setActiveCamera(field.getCamera(ORTHOGRAPHIC.ABOVE_FIELD) as any)
          break
        case "orthographic-orange-left":
          this.setActiveCamera(field.getCamera(ORTHOGRAPHIC.ORANGE_LEFT) as any)
          break
        case "orthographic-orange-right":
          this.setActiveCamera(field.getCamera(
            ORTHOGRAPHIC.ORANGE_RIGHT
          ) as any)
          break
        case "orthographic-blue-left":
          this.setActiveCamera(field.getCamera(ORTHOGRAPHIC.BLUE_LEFT) as any)
          break
        case "orthographic-blue-right":
          this.setActiveCamera(field.getCamera(ORTHOGRAPHIC.BLUE_RIGHT) as any)
          break
        default:
          this.setActiveCamera(this.defaultCamera)
      }
    }

    // Dispatch to all manager listeners
    dispatchCameraChange({ camera: this.activeCamera })
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

  private setActiveCamera(camera: Camera) {
    this.activeCamera = camera
    this.updateCameraSize()
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
    | "orthographic-blue-right"
    | "orthographic-blue-left"
    | "orthographic-orange-right"
    | "orthographic-orange-left"
    | "orthographic-above-field"
}

export default CameraManager
