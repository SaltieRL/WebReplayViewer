import { Scene } from "three"

import { BALL } from "../../constants/gameObjectNames"
import GameFieldAssets from "../../loaders/scenes/GameFieldAssets"
import BallManager from "../../managers/models/BallManager"

export const buildBall = (scene: Scene) => {
  const { ball } = GameFieldAssets.getAssets()
  ball.scale.setScalar(105)
  ball.name = BALL
  ball.castShadow = true
  scene.add(ball)
  return new BallManager(ball)
}
