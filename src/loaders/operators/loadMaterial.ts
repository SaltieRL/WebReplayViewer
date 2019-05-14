import { LoadingManager } from "three"
import {
  MaterialCreator,
  MTLLoader,
} from "three/examples/jsm/loaders/MTLLoader"

export const loadMaterial = (path: string, loadingManager?: LoadingManager) => {
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
