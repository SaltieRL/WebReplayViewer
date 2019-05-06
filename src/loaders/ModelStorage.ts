import ModelLoader from "./ModelLoader"
import { Object3D, LoadingManager } from "three"

export default class ModelStorage {
  private static instance?: ModelStorage
  public static getInstance() {
    if (!ModelStorage.instance) {
      ModelStorage.instance = new ModelStorage()
    }
    return ModelStorage.instance
  }

  private storage: { [key: string]: Object3D }
  private constructor() {
    this.storage = {}
  }

  async loadBall(loadingManager?: LoadingManager) {
    const BALL = "ball"
    if (this.storage[BALL]) {
      return this.storage[BALL]
    }
    // @ts-ignore
    const { default: glb } = await import("../assets/models/Ball.glb")
    const ballGLTF = await ModelLoader.loadObject(glb, loadingManager)
    const ball = ballGLTF.scene.children[2]
    this.storage[BALL] = ball
    return ball
  }

  async loadField(loadingManager?: LoadingManager) {
    const FIELD = "field"
    if (this.storage[FIELD]) {
      return this.storage[FIELD]
    }

    // @ts-ignore
    const { default: glb } = await import("../assets/models/Field.glb")
    const fieldGLTF = await ModelLoader.loadObject(glb, loadingManager)
    // TODO: Determine the child number for the field
    const field = fieldGLTF.scene.children[2]
    this.storage[FIELD] = field
    return field
  }

  async loadCar(loadingManager?: LoadingManager) {
    const CAR = "car"
    if (this.storage[CAR]) {
      return this.storage[CAR]
    }

    // @ts-ignore
    const { default: glb } = await import("../assets/models/Octane.glb")
    // TODO: Load car wheels
    const carGLTF = await ModelLoader.loadObject(glb, loadingManager)
    // TODO: Determine the child number for the car
    const car = carGLTF.scene.children[2]
    this.storage[CAR] = car
    return car
  }
}
