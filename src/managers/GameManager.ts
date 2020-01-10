import { WebGLRenderer } from "three"

import defaultGameBuilder from "../builders/GameBuilder"
import EventBus from "../eventbus/EventBus"
import {
  addCameraChangeListener,
  removeCameraChangeListener,
} from "../eventbus/events/cameraChange"
import {
  addCanvasResizeListener,
  CanvasResizeEvent,
  removeCanvasResizeListener,
} from "../eventbus/events/canvasResize"
import {
  addFrameListener,
  FrameEvent,
  removeFrameListener,
} from "../eventbus/events/frame"
import {
  addPlayPauseListener,
  PlayPauseEvent,
  removePlayPauseListener,
} from "../eventbus/events/playPause"
import FPSClock from "../utils/FPSClock"
import AnimationManager from "./AnimationManager"
import CameraManager from "./CameraManager"
import KeyManager from "./KeyManager"
import SceneManager from "./SceneManager"

interface GameManagerOptions {
  clock: FPSClock
}

export class GameManager {
  clock: FPSClock
  private readonly renderer: WebGLRenderer

  private constructor({ clock }: GameManagerOptions) {
    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.shadowMap.enabled = true
    this.animate = this.animate.bind(this)
    this.render = this.render.bind(this)
    this.clock = clock

    // Spawns the animation clips
    AnimationManager.getInstance().playAnimationClips()
    // Forces every animation to "take position"
    AnimationManager.getInstance().updateAnimationClips(0)
    addPlayPauseListener(this.onPlayPause)
    addFrameListener(this.animate)
    addCanvasResizeListener(this.updateSize)
    addCameraChangeListener(this.render)
  }

  onPlayPause = ({ paused }: PlayPauseEvent) => {
    paused ? this.clock.pause() : this.clock.play()
  }

  animate({ delta }: FrameEvent) {
    if (delta) {
      AnimationManager.getInstance().updateAnimationClips(delta)
      this.render()
    }
  }

  getDOMNode() {
    return this.renderer.domElement
  }

  render = () => {
    const { scene } = SceneManager.getInstance()
    const { activeCamera } = CameraManager.getInstance()
    this.renderer.render(scene, activeCamera)
  }

  private readonly updateSize = ({
    width = 640,
    height = 480,
  }: CanvasResizeEvent) => {
    this.renderer.setSize(width, height)
    this.render()
  }

  /**
   * ========================================
   * Managers are singletons
   * ========================================
   */
  static builder = defaultGameBuilder
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
  static destruct() {
    // Destruct other managers
    SceneManager.destruct()
    CameraManager.destruct()
    KeyManager.destruct()

    // Handle destruction of the existing game
    const { instance } = GameManager
    if (instance) {
      removePlayPauseListener(instance.onPlayPause)
      removeFrameListener(instance.animate)
      removeCanvasResizeListener(instance.updateSize)
      removeCameraChangeListener(instance.render)
      instance.clock.reset()
      EventBus.reset()
      GameManager.instance = undefined
    }
  }
}
