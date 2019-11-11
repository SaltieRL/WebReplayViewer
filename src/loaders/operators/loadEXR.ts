import { LoadingManager, DataTexture, FloatType } from "three"
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader"

export const loadEXR = (path: string, loadingManager?: LoadingManager) => {
  return new Promise(
    (
      resolve: (exrTexture: DataTexture) => void,
      reject: (err: Error | ErrorEvent) => void
    ) => {
      const exrLoader = new EXRLoader(loadingManager)
      exrLoader.setDataType( FloatType )
      exrLoader.load(
        path,
        (exrTexture: DataTexture) => {
          resolve(exrTexture)
        },
        undefined,
        (error: Error | ErrorEvent) => {
          reject(error)
        }
      )
    }
  )
}
