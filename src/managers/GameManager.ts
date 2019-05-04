import { PerspectiveCamera, Scene, Object3D, WebGLRenderer } from "three"
import { PlayerManager } from "./PlayerManager"

interface FieldScene {
  scene: Scene
  camera: PerspectiveCamera
  ball: Object3D
  ground: Object3D
  players: PlayerManager[]
}

export class GameManager {
  private readonly threeField: FieldScene
  private readonly renderer: WebGLRenderer

  private static instance?: GameManager

  public static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager()
    }
    return GameManager
  }

  private constructor() {
    this.threeField = {} as any
    this.renderer = new WebGLRenderer({ antialias: true })
  }

  async initialize() {}

  updateSize(width: number = 640, height: number = 480) {
    const { camera } = this.threeField
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    // this.renderer.setSize(width, height)
    // this.renderScene()
  }

  render() {
    this.renderer.render(this.threeField.scene, this.threeField.camera)
  }
}
