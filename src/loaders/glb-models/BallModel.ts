import { AnimationMixer, Object3D } from "three"

import { _Model } from "./_Model"

interface BallConstructorOptions {
  model: Object3D
}

export default class BallModel implements _Model {
  private model: Object3D
  constructor({ model }: BallConstructorOptions) {
    this.model = model
    this.initialize()
  }

  getThreeObject() {
    return this.model
  }

  getMixer() {
    return new AnimationMixer(this.model)
  }

  private initialize() {
    this.model.scale.setScalar(150)
    this.model.name = BallModel.BALL_NAME
  }

  static BALL_NAME = "ball"
}
