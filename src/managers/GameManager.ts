import { WebGLRenderer } from "three"

import AnimationManager from "./AnimationManager"
import SceneManager from "./SceneManager"

interface GameManagerOptions {
  animationManager: AnimationManager
  sceneManager: SceneManager
}

export class GameManager {
  private animationManager: AnimationManager
  private sceneManager: SceneManager
  private readonly renderer: WebGLRenderer

  private constructor({ animationManager, sceneManager }: GameManagerOptions) {
    this.renderer = new WebGLRenderer({ antialias: true })
    this.animationManager = animationManager
    this.sceneManager = sceneManager
  }

  getDOMNode() {
    return this.renderer.domElement
  }

  updateSize(width: number = 640, height: number = 480) {
    this.sceneManager.updateSize(width, height)
    this.renderer.setSize(width, height)
    this.render()
  }

  render() {
    this.renderer.render(this.sceneManager.scene, this.sceneManager.camera)
  }

  /**
   * ========================================
   * Managers are singletons
   * ========================================
   */
  private static instance?: GameManager
  static getInstance() {
    if (!GameManager.instance) {
      throw new Error("GameManager not initialized with call to `init`")
    }
    return GameManager.instance
  }
  static init(options: GameManagerOptions) {
    GameManager.instance = new GameManager(options)
    return GameManager.instance
  }
}
