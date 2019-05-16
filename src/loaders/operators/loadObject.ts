import { LoadingManager } from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export const loadObject = (path: string, loadingManager?: LoadingManager) => {
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
