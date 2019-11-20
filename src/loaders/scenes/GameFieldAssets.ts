import { Group, LoadingManager, Object3D } from "three"

import { loadBall } from "../storage/loadBall"
import { loadBlueCar, loadOrangeCar, loadWheel } from "../storage/loadCar"
import { loadField } from "../storage/loadField"

interface AvailableAssets {
  ball: Object3D
  field: Group
  orangeCar: Group
  blueCar: Group
  wheel: Object3D
}

class GameFieldAssets {
  loadingManager: LoadingManager
  assets?: AvailableAssets

  constructor() {
    this.loadingManager = new LoadingManager()
  }

  async load() {
    const lm = this.loadingManager
    return Promise.all([
      loadBall(lm),
      loadField(lm),
      loadOrangeCar(lm),
      loadBlueCar(lm),
      loadWheel(lm),
    ]).then(([ball, field, orangeCar, blueCar, wheel]) => {
      this.assets = {
        ball,
        field,
        orangeCar,
        blueCar,
        wheel,
      } as AvailableAssets
    })
  }

  getAssets() {
    if (!this.assets) {
      throw new Error("Must call `load` before using assets for this scene")
    }
    return this.assets
  }
}

export default new GameFieldAssets()
