import { defaultMemoize } from "reselect"
import { Group, LoadingManager } from "three"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

import { loadObject } from "./operators/loadObject"

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
    const ballGLTF = await loadObject(glb, loadingManager)
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
    const fieldGLTF = await loadObject(glb, loadingManager)
    const field = new Group()
    field.name = "Field"
    field.add(...fieldGLTF.scene.children)
    return field
  }
)

export const loadWheel = defaultMemoize(
  async (loadingManager?: LoadingManager) => {
    const { default: glb } = await import(
      // @ts-ignore
      "../assets/models/Wheel.glb"
    )
    const wheelGLTF = await loadObject(glb, loadingManager)
    const wheel = new Group()
    wheel.name = "Wheel"
    wheel.add(...wheelGLTF.scene.children)
    return wheel
  }
)

export const loadOrangeCar = defaultMemoize(
  async (loadingManager?: LoadingManager) => {
    const { default: glb } = await import(
      // @ts-ignore
      "../assets/models/Octane_ZXR_Orange.glb"
    )
    const carGLTF = await loadObject(glb, loadingManager)
    const car = getChildByName(carGLTF, "Octane")
    if (!car) {
      throw new MissingAssetError("Unable to load orange Octane model")
    }
    return car
  }
)

export const loadBlueCar = defaultMemoize(
  async (loadingManager?: LoadingManager) => {
    const { default: glb } = await import(
      // @ts-ignore
      "../assets/models/Octane_ZXR_Blue.glb"
    )
    const carGLTF = await loadObject(glb, loadingManager)
    const car = getChildByName(carGLTF, "Octane")
    if (!car) {
      throw new MissingAssetError("Unable to load blue Octane model")
    }
    return car
  }
)
