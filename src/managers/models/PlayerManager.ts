import { Group, PerspectiveCamera, Vector3 } from "three"

import { SPRITE } from "../../constants/gameObjectNames"
import {
  addCameraChangeListener,
  CameraChangeEvent,
} from "../../eventbus/events/cameraChange"
import {
  addCameraFrameUpdateListener,
  CameraFrameUpdateEvent,
} from "../../eventbus/events/cameraFrameUpdate"

const CAMERA_ABOVE_PLAYER = 200

export default class PlayerManager {
  readonly carGroup: Group
  readonly playerName: string
  readonly isOrangeTeam: boolean

  readonly camera: PerspectiveCamera
  private activeCamera: boolean

  constructor(playerName: string, isOrangeTeam: boolean, carGroup: Group) {
    this.playerName = playerName
    this.carGroup = carGroup
    this.isOrangeTeam = isOrangeTeam
    this.camera = new PerspectiveCamera(80, 2, 0.1, 20000)
    this.activeCamera = false
    this.carGroup.add(this.camera)

    addCameraChangeListener(this.onCameraChange)
    addCameraFrameUpdateListener(this.onCameraFrameUpdate)
  }

  onCameraChange = ({ camera }: CameraChangeEvent) => {
    const isActiveCamera = camera === this.camera
    this.toggleSprite(!isActiveCamera)
    this.activeCamera = isActiveCamera
  }

  onCameraFrameUpdate = ({ ballPosition }: CameraFrameUpdateEvent) => {
    // Ignore frame updates if we aren't the active camera
    if (!this.activeCamera) {
      return
    }

    // Compute the position where the camera should sit on opposite side of player from ball
    const vectorToBall = new Vector3()
    const scaleFromPlayer = 300
    vectorToBall.subVectors(this.carGroup.position, ballPosition)
    vectorToBall.setLength(scaleFromPlayer)
    vectorToBall.y += CAMERA_ABOVE_PLAYER

    // Correct for camera going beneath the map
    if (vectorToBall.y < 0) {
      const lowYFactor = 15
      vectorToBall.setLength(
        lowYFactor / -vectorToBall.y + (scaleFromPlayer - lowYFactor)
      )
      vectorToBall.y = 0
    }
    const camera = this.camera
    // TODO: Tween FOV
    // if (isUsingBoost && camera.fov === 80) {
    //     camera.fov = 85
    //     camera.updateProjectionMatrix()
    // } else if (camera.fov === 85) {
    //     camera.fov = 80
    //     camera.updateProjectionMatrix()
    // }
    camera.position.copy(vectorToBall)
  }

  private toggleSprite(display: boolean) {
    const sprite = this.carGroup.children.find(child => child.name === SPRITE)
    sprite!.visible = display
  }
}
