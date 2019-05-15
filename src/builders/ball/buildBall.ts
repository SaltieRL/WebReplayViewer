import { Scene } from "three"
import GameFieldAssets from "../../loaders/scenes/GameFieldAssets"
import { BALL } from "../../constants/gameObjectNames"
import BallManager from "../../managers/models/BallManager"

export const buildBall = (scene: Scene) => {
  const { ball } = GameFieldAssets.getAssets()
  ball.scale.setScalar(110)
  ball.name = BALL
  scene.add(ball)
  return new BallManager(ball)
}
