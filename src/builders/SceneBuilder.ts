import {
  DoubleSide,
  Group,
  LoadingManager,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry,
  Scene,
  AmbientLight,
  HemisphereLight,
} from "three"

import ArenaModel from "../loaders/glb-models/ArenaModel"
import BallModel from "../loaders/glb-models/BallModel"
import {
  loadField,
  loadBall,
  loadOrangeCar,
  loadBlueCar,
  loadWheel,
} from "../loaders/ModelStorage"
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

  // Ambient light
  scene.add(new AmbientLight(0x444444))

  // Hemisphere light
  scene.add(new HemisphereLight(0xffffbb, 0x080820, 1))

  const field = await loadField(loadingManager)
  scene.add(field)
  return new ArenaModel(field)
}

const buildBall = async ({ scene, loadingManager }: BuildOption) => {
  const ballModel = await loadBall(loadingManager)
  const ball = new BallModel({ model: ballModel })
  scene.add(ball.getThreeObject())
  return ball
}

const buildPlayers = async (
  players: Player[],
  { scene, loadingManager }: BuildOption
) => {
  const managers = []
  for (const player of players) {
    const { name, orangeTeam } = player
    const car = orangeTeam
      ? await loadOrangeCar(loadingManager)
      : await loadBlueCar(loadingManager)
    const wheels = await buildWheels(loadingManager)
    const playerMesh = car.clone() as Group
    playerMesh.add(wheels)
    const manager = new PlayerManager(name, orangeTeam, playerMesh)
    scene.add(manager.getThreeObject())
    managers.push(manager)
  }
  return managers
}

const buildWheels = async (loadingManager?: LoadingManager) => {
  const wheel = await loadWheel(loadingManager)

  const LEFT_DISTANCE = 55
  const FORWARD_DISTANCE = 80
  const VERTICAL_DISTANCE = 32
  const wheelGroup = new Group()
  const frontLeft = wheel.clone()
  frontLeft.name = "Front Left"
  frontLeft.position.set(FORWARD_DISTANCE, -VERTICAL_DISTANCE, -LEFT_DISTANCE)
  const frontRight = wheel.clone()
  frontRight.name = "Front Right"
  frontRight.position.set(FORWARD_DISTANCE, -VERTICAL_DISTANCE, LEFT_DISTANCE)
  const backLeft = wheel.clone()
  backLeft.name = "Back Left"
  backLeft.position.set(-FORWARD_DISTANCE, -VERTICAL_DISTANCE, -LEFT_DISTANCE)
  const backRight = wheel.clone()
  backRight.name = "Back Right"
  backRight.position.set(-FORWARD_DISTANCE, -VERTICAL_DISTANCE, LEFT_DISTANCE)

  wheelGroup.add(frontLeft, frontRight, backLeft, backRight)
  return wheelGroup
}
