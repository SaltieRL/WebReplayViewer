import { Cache, LoadingManager, Scene, WebGLRenderer, Mesh, MeshStandardMaterial } from 'three'

import GameFieldAssets from '../loaders/scenes/GameFieldAssets'
import SceneManager from '../managers/SceneManager'
import { buildBall } from './ball/buildBall'
import { buildPlayfield } from './field/buildPlayfield'
import { addLighting } from './scene/addLighting'
import { ExtendedPlayer } from '../models/ReplayMetadata';
import { loadRlLoadout } from '../loaders/storage/loadRlLoadout';
import { RocketAssetManager, RocketConfig, TextureFormat } from 'rl-loadout-lib';
import { buildRocketLoadoutGroup } from './player/buildRocketLoadoutScene';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { addEnvironment } from "./scene/addEnvironment";

/**
 * @description The sole purpose of this function is to initialize and tie together all of the
 * required assets for the replay viewer. This includes resizing and lighting to ensure that every
 * object is of the correct color and size. Out of necessity, this function is what loads all
 * required game assets.
 */
const defaultSceneBuilder = async (
  playerInfo: ExtendedPlayer[],
  renderer: WebGLRenderer,
  loadingManager?: LoadingManager,
  defaultLoadouts?: boolean
): Promise<SceneManager> => {
  const scene = new Scene()

  // Enabled caching used by three's loaders
  Cache.enabled = true

  if (loadingManager) {
    GameFieldAssets.loadingManager = loadingManager
  }

  const gltfLoader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')
  gltfLoader.setDRACOLoader(dracoLoader)

  const config = new RocketConfig({
    gltfLoader,
    loadingManager,
    textureFormat: TextureFormat.PNG,
    useCompressedModels: true
  })
  const manager = new RocketAssetManager(config)
  const bodyPromises = playerInfo.map(player => loadRlLoadout(manager, player, defaultLoadouts))

  await GameFieldAssets.load()
  const bodies = await Promise.all(bodyPromises)

  const envMap = addEnvironment(scene, renderer)
  addLighting(scene)
  const field = buildPlayfield(scene)
  const players = bodies.map(value => buildRocketLoadoutGroup(scene, value))
  const ball = buildBall(scene)

  // TODO ?
  scene.traverse( child => {
    if ( (<Mesh> child).isMesh ) {
      (<MeshStandardMaterial> (<Mesh> child).material).envMap = envMap
    }
  })

  return SceneManager.init({
    scene,
    ball,
    field,
    players,
  })
}
export default defaultSceneBuilder
