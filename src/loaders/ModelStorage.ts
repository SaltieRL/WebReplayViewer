import ModelLoader from "./ModelLoader"
import { Object3D, LoadingManager, Group } from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

class MissingAssetError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "MissingAssetError"
  }
}

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

  private getChildByName = (asset: GLTF, name: string) =>
    asset.scene.children.find(object => object.name === name)

  async loadBall(loadingManager?: LoadingManager) {
    const BALL = "ball"
    if (this.storage[BALL]) {
      return this.storage[BALL]
    }
    // @ts-ignore
    const { default: glb } = await import("../assets/models/Ball.glb")
    const ballGLTF = await ModelLoader.loadObject(glb, loadingManager)
    const ball = this.getChildByName(ballGLTF, "Ball")
    if (!ball) {
      throw new MissingAssetError("Unable to load Ball model")
    }
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
    const field = new Group()
    field.name = "Field"
    field.add(...fieldGLTF.scene.children)
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
    const car = this.getChildByName(carGLTF, "Octane")
    if (!car) {
      throw new MissingAssetError("Unable to load Octane model")
    }
    this.storage[CAR] = car
    return car
  }
}
