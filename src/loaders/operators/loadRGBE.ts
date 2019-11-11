import { LoadingManager, DataTexture, UnsignedByteType } from "three"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

export const loadRGBE = (path: string, loadingManager?: LoadingManager) => {
  return new Promise(
    (
      resolve: (rgbeTexture: DataTexture) => void,
      reject: (err: Error | ErrorEvent) => void
    ) => {
      const rgbeLoader = new RGBELoader(loadingManager)
      rgbeLoader.setDataType( UnsignedByteType )
      rgbeLoader.load(
        path,
        (rgbeTexture: DataTexture) => {
          resolve(rgbeTexture)
        },
        undefined,
        (error: Error | ErrorEvent) => {
          reject(error)
        }
      )
    }
  )
}
