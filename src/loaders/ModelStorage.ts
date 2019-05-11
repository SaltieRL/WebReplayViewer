import { defaultMemoize } from "reselect"
import ModelLoader from "./ModelLoader"
import { LoadingManager, Group } from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

const getChildByName = (asset: GLTF, name: string) =>
  asset.scene.children.find(object => object.name === name)

class MissingAssetError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "MissingAssetError"
  }
}

export const loadBall = defaultMemoize(
  async (loadingManager?: LoadingManager) => {
    // @ts-ignore
    const { default: glb } = await import("../assets/models/Ball.glb")
    const ballGLTF = await ModelLoader.loadObject(glb, loadingManager)
    const ball = getChildByName(ballGLTF, "Ball")
    if (!ball) {
      throw new MissingAssetError("Unable to load Ball model")
    }
    return ball
  }
)

export const loadField = defaultMemoize(
  async (loadingManager?: LoadingManager) => {
    // @ts-ignore
    const { default: glb } = await import("../assets/models/Field.glb")
    const fieldGLTF = await ModelLoader.loadObject(glb, loadingManager)
    const field = new Group()
    field.name = "Field"
    field.add(...fieldGLTF.scene.children)
    return field
  }
)

export const loadCar = defaultMemoize(
  async (loadingManager?: LoadingManager) => {
    // @ts-ignore
    const { default: glb } = await import("../assets/models/Octane ZXR.glb")
    // TODO: Load car wheels
    const carGLTF = await ModelLoader.loadObject(glb, loadingManager)
    const car = getChildByName(carGLTF, "Octane")
    if (!car) {
      throw new MissingAssetError("Unable to load Octane model")
    }
    return car
  }
)
