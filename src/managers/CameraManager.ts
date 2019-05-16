import { PerspectiveCamera } from "three"
import SceneManager from "./SceneManager"
import PlayerManager from "./models/PlayerManager"

class CameraManager {
  activeCamera: PerspectiveCamera

  private activePlayer?: PlayerManager
  private readonly _defaultCamera: PerspectiveCamera

  private constructor() {
    this.activeCamera = new PerspectiveCamera(80, 2, 0.1, 20000)
    this._defaultCamera = this.activeCamera

    this.activeCamera.position.z = 5000
    this.activeCamera.position.y = 750
  }

  updateSize(width: number, height: number) {
    this.activeCamera.aspect = width / height
    this.activeCamera.updateProjectionMatrix()
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
    this.activeCamera.lookAt(position)
  }

  setCameraLocation({ playerName, fieldLocation }: CameraLocationOptions) {
    const { players } = SceneManager.getInstance()
    if (playerName) {
      const player = players.find(player => player.playerName === playerName)
      if (player) {
        if (this.activePlayer) {
          this.activePlayer.toggleSprite(true)
        }
        player.toggleSprite(false)
        this.activePlayer = player
        this.setActiveCamera(player.camera)
      }
    } else if (fieldLocation) {
      this.setActiveCamera(this._defaultCamera)
      switch (fieldLocation) {
        case "orange":
          this.activeCamera.position.z = 5750
        case "blue":
          this.activeCamera.position.z = -5750
        case "center":
          this.activeCamera.position.z = 0
      }
    }
  }

  private setActiveCamera(camera: PerspectiveCamera) {
    const activeAspect = this.activeCamera.aspect
    camera.aspect = activeAspect
    camera.updateProjectionMatrix()
    this.activeCamera = camera
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

type CameraLocationOptions = {
  playerName?: string
  fieldLocation?: "orange" | "blue" | "center"
}

export default CameraManager
