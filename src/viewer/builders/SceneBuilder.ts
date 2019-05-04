import {
  LoadingManager,
  Scene,
  PlaneBufferGeometry,
  MeshPhongMaterial,
  DoubleSide,
  Mesh,
} from "three"

export default class SceneBuilder {
  static async buildPlayfield(loadingManager: LoadingManager, scene: Scene) {
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
  }
}
