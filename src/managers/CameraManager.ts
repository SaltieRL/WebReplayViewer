import { Camera, OrthographicCamera, PerspectiveCamera } from "three"

import {
  ABOVE_FIELD_CAMERA,
  BLUE_GOAL_CAMERA,
  ORANGE_GOAL_CAMERA,
  ORTHOGRAPHIC_CAMERA,
} from "../constants/gameObjectNames"
import { dispatchCameraChange } from "../eventbus/events/cameraChange"
import { dispatchCameraFrameUpdate } from "../eventbus/events/cameraFrameUpdate"
import SceneManager from "./SceneManager"

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
  }

  updateSize(width: number, height: number) {
    this.width = width
    this.height = height
    this.updateCameraSize()
  }

  update() {
    const { position } = SceneManager.getInstance().ball.ball
    dispatchCameraFrameUpdate({
      ballPosition: position,
      ballCam: true,
      isUsingBoost: false,
    })
    if (this.activeCamera.name !== ORTHOGRAPHIC_CAMERA) {
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
        case "orthographic":
          this.setActiveCamera(field.getCamera(ORTHOGRAPHIC_CAMERA) as any)
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
}

export interface CameraLocationOptions {
  playerName?: string
  fieldLocation?: "orange" | "blue" | "center" | "orthographic"
}

export default CameraManager
