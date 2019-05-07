import {
  DoubleSide,
  Group,
  LoadingManager,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry,
  Scene,
} from "three"

import ArenaModel from "../loaders/glb-models/ArenaModel"
import BallModel from "../loaders/glb-models/BallModel"
import ModelStorage from "../loaders/ModelStorage"
import { PlayerManager } from "../managers/PlayerManager"
import SceneManager from "../managers/SceneManager"

interface Player {
  name: string
  orangeTeam: boolean
}

interface BuildOption {
  scene: Scene
  loadingManager?: LoadingManager
}

/**
 * @description The sole purpose of this function is to initialize and tie together all of the
 * required assets for the replay viewer. This includes resizing and lighting to ensure that every
 * object is of the correct color and size.
 */
const defaultSceneBuilder = async (
  playerInfo: Player[],
  loadingManager?: LoadingManager
): Promise<SceneManager> => {
  const scene = new Scene()

  const buildOption = { scene, loadingManager }
  const [ball, ground, players] = await Promise.all([
    buildBall(buildOption),
    buildPlayfield(buildOption),
    buildPlayers(playerInfo, buildOption),
  ])

  return SceneManager.init({
    scene,
    ball,
    arena: ground,
    players,
  })
}
export default defaultSceneBuilder

const buildPlayfield = async ({ scene, loadingManager }: BuildOption) => {
  const goalPlane = new PlaneBufferGeometry(2000, 1284.5, 1, 1)
  const blueGoalMaterial = new MeshPhongMaterial({
    color: "#2196f3",
    side: DoubleSide,
    opacity: 0.3,
    transparent: true,
  })
  const orangeGoalMaterial = new MeshPhongMaterial({
    color: "#ff9800",
    side: DoubleSide,
    opacity: 0.3,
    transparent: true,
  })
  const blueGoal = new Mesh(goalPlane, blueGoalMaterial)
  blueGoal.position.z = -5120
  scene.add(blueGoal)
  const orangeGoal = new Mesh(goalPlane, orangeGoalMaterial)
  orangeGoal.position.z = 5120
  orangeGoal.rotation.y = Math.PI
  scene.add(orangeGoal)

  const field = await ModelStorage.getInstance().loadField(loadingManager)
  scene.add(field)
  return new ArenaModel(field)
}

const buildBall = async ({ scene, loadingManager }: BuildOption) => {
  const ballModel = await ModelStorage.getInstance().loadBall(loadingManager)
  const ball = new BallModel({ model: ballModel })
  scene.add(ball.getThreeObject())
  return ball
}

const buildPlayers = async (
  players: Player[],
  { scene, loadingManager }: BuildOption
) => {
  const managers = []
  const car = await ModelStorage.getInstance().loadCar(loadingManager)
  for (const player of players) {
    const { name, orangeTeam } = player
    const playerMesh = car.clone() as Group
    const manager = new PlayerManager(name, orangeTeam, playerMesh)
    scene.add(manager.getThreeObject())
    managers.push(manager)
  }
  return managers
}
