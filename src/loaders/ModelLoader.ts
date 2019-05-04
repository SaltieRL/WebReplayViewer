import { LoadingManager, MaterialLoader, Material, Object3D } from "three"
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader"

export default class ModelLoader {
  // static async loadObject()
  static async loadMaterial(path: string, loadingManager?: LoadingManager) {
    return new Promise(
      (
        resolve: (material: Material) => void,
        reject: (err: Error | ErrorEvent) => void
      ) => {
        const mtlLoader = new MaterialLoader(loadingManager)
        mtlLoader.load(
          path,
          (material: Material) => {
            resolve(material)
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
            gltf.scene.resolve(gltf)
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
