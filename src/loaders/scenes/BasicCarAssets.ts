import { Group, LoadingManager, Object3D } from "three"

import { loadBlueCar, loadOrangeCar, loadWheel } from "../storage/loadCar"

interface AvailableAssets {
  orangeCar: Group
  blueCar: Group
  wheel: Object3D
}

export default class BasicCarAssets {
  loadingManager: LoadingManager
  assets?: AvailableAssets

  constructor(loadingManager?: LoadingManager) {
    this.loadingManager = loadingManager || new LoadingManager()
  }

  async load() {
    const lm = this.loadingManager
    return Promise.all([
      loadOrangeCar(lm),
      loadBlueCar(lm),
      loadWheel(lm),
    ]).then(([orangeCar, blueCar, wheel]) => {
      this.assets = {
        orangeCar,
        blueCar,
        wheel,
      }
    })
  }

  getAssets() {
    if (!this.assets) {
      throw new Error("Must call `load` before using assets for this scene")
    }
    return this.assets
  }
}
