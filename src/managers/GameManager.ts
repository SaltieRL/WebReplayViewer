import {
  LoadingManager,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three"

import SceneBuilder from "../builders/SceneBuilder"
import { ReplayData } from "../models/ReplayData"
import { PlayerManager } from "./PlayerManager"

export interface FieldScene {
  scene: Scene
  camera: PerspectiveCamera
  ball: Object3D
  ground: Object3D
  players: PlayerManager[]
}

interface GameManagerOptions {
  replayData: ReplayData
  width?: number
  height?: number
  loadingManager?: LoadingManager
}

export class GameManager {
  private static instance?: GameManager
  public static async init(options: GameManagerOptions) {
    const gm = new GameManager()
    const { names, colors } = options.replayData
    const playerInfo = []
    for (let index = 0; index < names.length; index++) {
      playerInfo.push({ name: names[index], orangeTeam: colors[index] })
    }
    const field = await SceneBuilder(
      playerInfo,
      options.width,
      options.height,
      options.loadingManager
    )
    gm.threeField = field
    GameManager.instance = gm
    return gm
  }
  public static getInstance() {
    if (!GameManager.instance) {
      throw new Error("Game manager must be built with call to `init` first")
    }
    return GameManager.instance
  }

  private threeField: FieldScene
  private readonly renderer: WebGLRenderer

  private constructor() {
    this.threeField = {} as any
    this.renderer = new WebGLRenderer({ antialias: true })
  }

  getDOMNode() {
    return this.renderer.domElement
  }

  updateSize(width: number = 640, height: number = 480) {
    const { camera } = this.threeField
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.render()
  }

  render() {
    this.renderer.render(this.threeField.scene, this.threeField.camera)
  }
}
