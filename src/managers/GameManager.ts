import { WebGLRenderer } from "three"

import AnimationManager from "./AnimationManager"
import SceneManager from "./SceneManager"
import FPSClock from "../utils/FPSClock"
import { addToWindow } from "../utils/addToWindow"

interface GameManagerOptions {
  clock: FPSClock
  animationManager: AnimationManager
  sceneManager: SceneManager
}

export class GameManager {
  private clock: FPSClock
  private animationManager: AnimationManager
  private sceneManager: SceneManager
  private readonly renderer: WebGLRenderer

  private constructor({
    clock,
    animationManager,
    sceneManager,
  }: GameManagerOptions) {
    this.renderer = new WebGLRenderer({ antialias: true })
    this.animationManager = animationManager
    this.sceneManager = sceneManager

    this.animate = this.animate.bind(this)
    this.render = this.render.bind(this)
    this.clock = clock
    clock.subscribe(this.animate)

    this.animationManager.playAnimationClips()
    addToWindow("render", this.render)
    addToWindow("animation", this.animationManager)
    addToWindow("scene", this.sceneManager)
  }

  animate(frameNumber: number) {
    const delta = this.clock.getDelta()
    if (delta) {
      this.sceneManager.camera.lookAt(
        this.sceneManager.ball.getThreeObject().position
      )
      this.animationManager.updateAnimationClips(delta)
      this.render()
    }
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
