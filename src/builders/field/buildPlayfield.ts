import {
  DoubleSide,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PlaneBufferGeometry,
  Scene,
} from "three"

import FieldManager from "../../managers/models/FieldManager"
import { addCameras } from "./addCameras"

export const buildPlayfield = (field: Object3D, scene: Scene) => {
  /**
   * Temporary
   */
  const goalPlane = new PlaneBufferGeometry(2000, 1284.5, 1, 1)
  const blueGoalMaterial = new MeshPhongMaterial({
    color: "#2196f3",
    side: DoubleSide,
    opacity: 0.3,
    transparent: true,
  })
  const orangeGoalMaterial = new MeshPhongMaterial({
    color: "#ff9800",
    side: DoubleSide,
    opacity: 0.3,
    transparent: true,
  })
  const blueGoal = new Mesh(goalPlane, blueGoalMaterial)
  blueGoal.position.z = -5120
  scene.add(blueGoal)
  const orangeGoal = new Mesh(goalPlane, orangeGoalMaterial)
  orangeGoal.position.z = 5120
  orangeGoal.rotation.y = Math.PI
  scene.add(orangeGoal)
  /**
   * /Temporary
   */
  field.children.forEach(child => (child.receiveShadow = true))
  field.receiveShadow = true
  scene.add(field)

  const cameras = addCameras(scene)
  return new FieldManager(field, cameras)
}
