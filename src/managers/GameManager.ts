import { WebGLRenderer } from "three"

import defaultGameBuilder from "../builders/GameBuilder"
import FPSClock from "../utils/FPSClock"
import AnimationManager from "./AnimationManager"
import CameraManager from "./CameraManager"
import SceneManager from "./SceneManager"

interface GameManagerOptions {
  clock: FPSClock
}

export class GameManager {
  clock: FPSClock
  private readonly renderer: WebGLRenderer

  private constructor({ clock }: GameManagerOptions) {
    this.renderer = new WebGLRenderer({ antialias: true })
    this.animate = this.animate.bind(this)
    this.render = this.render.bind(this)
    this.clock = clock
    clock.subscribe(this.animate)

    AnimationManager.getInstance().playAnimationClips()
  }

  animate(frameNumber: number) {
    const delta = this.clock.getDelta()
    CameraManager.getInstance().update()

    if (delta) {
      SceneManager.getInstance().update()
      CameraManager.getInstance().update()
      AnimationManager.getInstance().updateAnimationClips(delta)
      this.render()
    }
  }

  getDOMNode() {
    return this.renderer.domElement
  }

  updateSize(width: number = 640, height: number = 480) {
    CameraManager.getInstance().updateSize(width, height)
    this.renderer.setSize(width, height)
    this.render()
  }

  render() {
    const { scene } = SceneManager.getInstance()
    const { activeCamera } = CameraManager.getInstance()
    this.renderer.render(scene, activeCamera)
  }

  static builder = defaultGameBuilder

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
