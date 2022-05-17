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
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.4.1/")
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
