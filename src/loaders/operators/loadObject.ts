import { LoadingManager } from "three"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export const loadObject = (path: string, loadingManager?: LoadingManager) => {
  return new Promise(
    (
      resolve: (gltf: GLTF) => void,
      reject: (err: Error | ErrorEvent) => void
    ) => {
      const gltfLoader = new GLTFLoader(loadingManager)
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath("/draco/")
      gltfLoader.setDRACOLoader(dracoLoader)
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
