import { Group, LoadingManager, Object3D, DataTexture } from "three"

import { loadBall } from "../storage/loadBall"
import { loadBlueCar, loadOrangeCar, loadWheel } from "../storage/loadCar"
import { loadField } from "../storage/loadField"
import { loadEnvironment } from "../storage/loadEnvironment"

interface AvailableAssets {
  ball: Object3D
  field: Group

  orangeCar: Group
  blueCar: Group
  wheel: Object3D
  environment: DataTexture
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
      loadEnvironment(lm)
    ]).then(([ball, field, orangeCar, blueCar, wheel, environment]) => {
      this.assets = {
        ball,
        field,
        orangeCar,
        blueCar,
        wheel,
        environment
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

export default new GameFieldAssets()
