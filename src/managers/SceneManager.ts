import { Scene } from "three"

import { addToWindow } from "../utils/addToWindow"
import BallManager from "./models/BallManager"
import FieldManager from "./models/FieldManager"
import PlayerManager from "./models/PlayerManager"

interface SceneManagerOptions {
  scene: Scene
  ball: BallManager
  field: FieldManager
  players: PlayerManager[]
}

export default class SceneManager {
  readonly scene: Scene
  readonly ball: BallManager
  readonly field: FieldManager
  readonly players: PlayerManager[]

  private constructor({ scene, ball, field, players }: SceneManagerOptions) {
    this.scene = scene
    this.ball = ball
    this.field = field
    this.players = players

    addToWindow("arena", field)
  }

  update() {}

  /**
   * ========================================
   * Managers are singletons
   * ========================================
   */
  private static instance?: SceneManager
  static getInstance() {
    if (!SceneManager.instance) {
      throw new Error("SceneManager not initialized with call to `init`")
    }
    return SceneManager.instance
  }
  static init(options: SceneManagerOptions) {
    SceneManager.instance = new SceneManager(options)
    return SceneManager.instance
  }
}
