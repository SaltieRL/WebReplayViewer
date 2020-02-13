import { Scene, Mesh, MeshStandardMaterial, Texture } from "three"

import { BALL } from "../../constants/gameObjectNames"
import GameFieldAssets from "../../loaders/scenes/GameFieldAssets"
import BallManager from "../../managers/models/BallManager"

export const buildBall = (scene: Scene, envMap: Texture) => {
  const { ball } = GameFieldAssets.getAssets()
  ball.scale.setScalar(105)
  ball.name = BALL
  ball.castShadow = true
  ball.traverse( child => {
    if ( (child as Mesh).isMesh ) {
      ((child as Mesh).material as MeshStandardMaterial).envMap = envMap
    }
  })
  scene.add(ball)
  return new BallManager(ball)
}
