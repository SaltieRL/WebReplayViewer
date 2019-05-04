import {
  LoadingManager,
  MaterialLoader,
  Material,
  ObjectLoader,
  Object3D,
} from "three"

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
        resolve: (object: Object3D) => void,
        reject: (err: Error | ErrorEvent) => void
      ) => {
        const objLoader = new ObjectLoader(loadingManager)

        objLoader.load(
          path,
          (object: Object3D) => {
            resolve(object)
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
