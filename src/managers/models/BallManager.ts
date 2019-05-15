import { Object3D } from "three"

class BallManager {
  readonly ball: Object3D

  constructor(ball: Object3D) {
    this.ball = ball
  }
}

export default BallManager
