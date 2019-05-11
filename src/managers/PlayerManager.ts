import { Camera, Group, Vector3 } from "three"

import PlayerModel from "../loaders/glb-models/PlayerModel"

const CAMERA_ABOVE_PLAYER = 200

export class PlayerManager {
  public readonly playerModel: PlayerModel

  private camera: Camera | null = null
  private readonly playerName: string

  constructor(playerName: string, orangeTeam: boolean, carObject: Group) {
    this.playerName = playerName
    this.playerModel = new PlayerModel({
      playerName,
      orangeTeam,
      model: carObject,
    })
  }

  public getName() {
    return this.playerName
  }

  public getThreeObject() {
    return this.playerModel.getThreeObject()
  }

  /**
   * Attaches the global camera to the top of the player, similar to player/ball cam in-game.
   * @param camera Global camera
   */
  public makeActive(camera: Camera) {
    this.playerModel.getThreeObject().add(camera)
    this.camera = camera
    camera.position.set(0, CAMERA_ABOVE_PLAYER, 0)
    this.playerModel.toggleNametagVisibility(false)
  }

  /**
   * Should be called every tick to reposition the camera based on the player's position in the
   * field. Calculates what is, essentially, the ball camera.
   * @param ballPosition
   * @param isUsingBoost
   */
  public updateCamera(ballPosition: Vector3, isUsingBoost: boolean) {
    if (!this.camera) {
      return
    }

    const vectorToBall = new Vector3()
    const scaleFromPlayer = 300
    vectorToBall.subVectors(
      this.playerModel.getThreeObject().position,
      ballPosition
    )
    vectorToBall.setLength(scaleFromPlayer)
    vectorToBall.y += CAMERA_ABOVE_PLAYER
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

  public removeCamera() {
    this.playerModel.toggleNametagVisibility(true)
    if (this.camera) {
      this.playerModel.getThreeObject().remove(this.camera)
    }
    this.camera = null
  }
}
