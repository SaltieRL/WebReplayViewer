import { LoadingManager } from "three"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader"

export const loadMaterial = (path: string, loadingManager?: LoadingManager) => {
  return new Promise(
    (
      resolve: (material: MTLLoader.MaterialCreator) => void,
      reject: (err: Error | ErrorEvent) => void
    ) => {
      const mtlLoader = new MTLLoader(loadingManager)
      mtlLoader.load(
        path,
        (materialCreator: MTLLoader.MaterialCreator) => {
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
