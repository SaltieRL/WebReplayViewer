import { Camera, OrthographicCamera, PerspectiveCamera } from "three"

import {
  ABOVE_FIELD_CAMERA,
  BLUE_GOAL_CAMERA,
  ORANGE_GOAL_CAMERA,
  ORTHOGRAPHIC_CAMERA,
} from "../constants/gameObjectNames"
import PlayerManager from "./models/PlayerManager"
import SceneManager from "./SceneManager"

class CameraManager {
  activeCamera: Camera

  private activePlayer?: PlayerManager
  private readonly _defaultCamera: Camera
  private width: number
  private height: number

  private constructor() {
    this.activeCamera = SceneManager.getInstance().field.getCamera(
      ORANGE_GOAL_CAMERA
    ) as any
    this._defaultCamera = this.activeCamera
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
    if (this.activePlayer) {
      this.activePlayer.updateCamera({
        ballPosition: position,
        ballCam: true,
        isUsingBoost: false,
      })
    }
    if (this.activeCamera.name !== ORTHOGRAPHIC_CAMERA) {
      this.activeCamera.lookAt(position)
    }
  }

  setCameraLocation({ playerName, fieldLocation }: CameraLocationOptions) {
    const { players, field } = SceneManager.getInstance()
    // Add hidden sprites back
    if (this.activePlayer) {
      this.activePlayer.toggleSprite(true)
    }
    if (playerName) {
      const player = players.find(player => player.playerName === playerName)
      if (player) {
        player.toggleSprite(false)
        this.activePlayer = player
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
          this.setActiveCamera(this._defaultCamera)
      }
    }
  }

  private updateCameraSize() {
    const { activeCamera: camera, width, height } = this

    if (camera instanceof PerspectiveCamera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    } else if (camera instanceof OrthographicCamera) {
      const { width, height } = this
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

export type CameraLocationOptions = {
  playerName?: string
  fieldLocation?: "orange" | "blue" | "center" | "orthographic"
}

export default CameraManager
