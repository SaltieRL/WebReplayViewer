import { defaultMemoize } from "reselect"
import { Group, LoadingManager } from "three"

import { getChildByName } from "../operators/getChildByName"
import { loadObject } from "../operators/loadObject"
import { throwLoadingError } from "../operators/throwLoadingError"

export const loadWheel = defaultMemoize(
  async (loadingManager?: LoadingManager) => {
    const { default: glb } = await import(
      // @ts-ignore
      "../../assets/models/Wheel.glb"
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
      "../../assets/models/Octane_ZXR_Orange.glb"
    )
    const carGLTF = await loadObject(glb, loadingManager)
    const car = getChildByName(carGLTF, "Octane")
    if (!car) {
      throwLoadingError("Octane")
    }
    return car as Group
  }
)

export const loadBlueCar = defaultMemoize(
  async (loadingManager?: LoadingManager) => {
    const { default: glb } = await import(
      // @ts-ignore
      "../../assets/models/Octane_ZXR_Blue.glb"
    )
    const carGLTF = await loadObject(glb, loadingManager)
    const car = getChildByName(carGLTF, "Octane")
    if (!car) {
      throwLoadingError("Octane")
    }
    return car as Group
  }
)
