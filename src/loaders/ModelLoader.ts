import { LoadingManager } from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import {
  MTLLoader,
  MaterialCreator,
} from "three/examples/jsm/loaders/MTLLoader"

export default class ModelLoader {
  // static async loadObject()
  static async loadMaterial(path: string, loadingManager?: LoadingManager) {
    return new Promise(
      (
        resolve: (material: MaterialCreator) => void,
        reject: (err: Error | ErrorEvent) => void
      ) => {
        const mtlLoader = new MTLLoader(loadingManager)
        mtlLoader.load(
          path,
          (materialCreator: MaterialCreator) => {
            resolve(materialCreator)
          },
          undefined,
          (error: Error | ErrorEvent) => {
            reject(error)
          }
        )
      }
    )
  }

  static async loadObject(path: string, loadingManager?: LoadingManager) {
    return new Promise(
      (
        resolve: (gltf: GLTF) => void,
        reject: (err: Error | ErrorEvent) => void
      ) => {
        const gltfLoader = new GLTFLoader(loadingManager)
        gltfLoader.load(
          path,
          (gltf: GLTF) => {
            resolve(gltf)
          },
          undefined,
          (error: Error | ErrorEvent) => {
            reject(error)
          }
        )
      }
    )
  }
}
