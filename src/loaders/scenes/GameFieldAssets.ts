import { Group, LoadingManager, Object3D } from "three"

import { loadBall } from "../storage/loadBall"
import { loadField } from "../storage/loadField"

interface AvailableAssets {
  ball: Object3D
  field: Group
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
      loadField(lm)
    ]).then(([ball, field]) => {
      this.assets = {
        ball,
        field
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
