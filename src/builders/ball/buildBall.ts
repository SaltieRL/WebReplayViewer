import { Object3D, Scene } from "three"

import { BALL } from "../../constants/gameObjectNames"
import BallManager from "../../managers/models/BallManager"

export const buildBall = (ball: Object3D, scene: Scene) => {
  ball.name = BALL
  ball.castShadow = true
  scene.add(ball)
  return new BallManager(ball)
}
