import {
  DoubleSide,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry,
  Scene,
  Texture,
  MeshStandardMaterial,
} from "three"

import GameFieldAssets from "../../loaders/scenes/GameFieldAssets"
import FieldManager from "../../managers/models/FieldManager"
import { addCameras } from "./addCameras"

export const buildPlayfield = (scene: Scene, envMap: Texture) => {
  /**
   * Temporary
   */
  const goalPlane = new PlaneBufferGeometry(1800, 630, 1, 1)
  const blueGoalMaterial = new MeshPhongMaterial({
    color: "#2196f3",
    side: DoubleSide,
    opacity: 0.3,
    transparent: true,
    emissive: "#2196f3",
    emissiveIntensity: 0.7
  })
  const orangeGoalMaterial = new MeshPhongMaterial({
    color: "#ff9800",
    side: DoubleSide,
    opacity: 0.3,
    transparent: true,
    emissive: "#ff9800",
    emissiveIntensity: 0.7
  })
  const blueGoal = new Mesh(goalPlane, blueGoalMaterial)
  blueGoal.position.z = -5120
  blueGoal.position.y = 315
  scene.add(blueGoal)
  const orangeGoal = new Mesh(goalPlane, orangeGoalMaterial)
  orangeGoal.position.z = 5120
  orangeGoal.position.y = 315
  orangeGoal.rotation.y = Math.PI
  scene.add(orangeGoal)
  /**
   * /Temporary
   */

  const { field } = GameFieldAssets.getAssets()
  field.scale.setScalar(400)
  field.traverse(child => {
    child.receiveShadow = true;
    if ((child as Mesh).isMesh) {
      ((child as Mesh).material as MeshStandardMaterial).envMap = envMap
    }
  })
  field.receiveShadow = true
  scene.add(field)

  const cameras = addCameras(scene)
  return new FieldManager(field, cameras)
}
