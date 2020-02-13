import { Group, LoadingManager, Object3D, DataTexture } from "three"

import { loadBall } from "../storage/loadBall"
import { loadField } from "../storage/loadField"
import { loadEnvironment } from "../storage/loadEnvironment"

interface AvailableAssets {
  ball: Object3D
  field: Group
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
      loadEnvironment(lm)
    ]).then(([ball, field, environment]) => {
      this.assets = {
        ball,
        field,
        environment
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
