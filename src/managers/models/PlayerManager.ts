import { Group, PerspectiveCamera, Vector3 } from "three"

import { SPRITE } from "../../constants/gameObjectNames"

const CAMERA_ABOVE_PLAYER = 200

export default class PlayerManager {
  readonly carGroup: Group
  readonly playerName: string

  readonly camera: PerspectiveCamera

  constructor(playerName: string, carGroup: Group) {
    this.playerName = playerName
    this.carGroup = carGroup
    this.camera = new PerspectiveCamera(80, 2, 0.1, 20000)
    this.carGroup.add(this.camera)
  }

  toggleSprite(display: boolean) {
    const sprite = this.carGroup.children.find(child => child.name === SPRITE)
    sprite!.visible = display
  }

  updateCamera({ ballPosition }: UpdateCameraOptions) {
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
}

interface UpdateCameraOptions {
  ballPosition: Vector3
  ballCam: boolean
  isUsingBoost: boolean
}
