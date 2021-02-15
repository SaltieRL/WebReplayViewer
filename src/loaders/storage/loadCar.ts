import { Group, LoadingManager } from "three"

import { getChildByName } from "../operators/getChildByName"
import { loadObject } from "../operators/loadObject"
import { throwLoadingError } from "../operators/throwLoadingError"
import { storageMemoize } from "./storageMemoize"

export const loadWheel = (loadingManager?: LoadingManager) =>
  storageMemoize(async () => {
    const { default: glb } = await import(
      /* webpackChunkName: "Wheel" */ "../../assets/models/draco/Wheel.glb"
    )
    const wheelGLTF = await loadObject(glb, loadingManager)
    const wheel = new Group()
    wheel.name = "Wheel"
    wheel.add(...wheelGLTF.scene.children)
    return wheel
  }, "WHEEL")

export const loadOrangeCar = (loadingManager?: LoadingManager) =>
  storageMemoize(async () => {
    const { default: glb } = await import(
      /* webpackChunkName: "Octane_ZXR_Orange" */ "../../assets/models/draco/Octane_ZXR_Orange.glb"
    )
    const carGLTF = await loadObject(glb, loadingManager)
    const car = getChildByName(carGLTF, "Octane")
    if (!car) {
      throwLoadingError("Octane")
    }
    return car as Group
  }, "Octane_ZXR_Orange")

export const loadBlueCar = (loadingManager?: LoadingManager) =>
  storageMemoize(async () => {
    const { default: glb } = await import(
      /* webpackChunkName: "Octane_ZXR_Blue" */ "../../assets/models/draco/Octane_ZXR_Blue.glb"
    )
    const carGLTF = await loadObject(glb, loadingManager)
    const car = getChildByName(carGLTF, "Octane")
    if (!car) {
      throwLoadingError("Octane")
    }
    return car as Group
  }, "Octane_ZXR_Blue")
