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
    if ( (<Mesh> child).isMesh ) {
      (<MeshStandardMaterial> (<Mesh> child).material).envMap = envMap
    }
  })
  scene.add(ball)
  return new BallManager(ball)
}
