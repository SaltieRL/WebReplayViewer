import { LoadingManager, DataTexture } from "three"

import { loadRGBE } from "../operators/loadRGBE"
// import { loadEXR } from "../operators/loadEXR"
import { storageMemoize } from "./storageMemoize"

export const loadEnvironment = (loadingManager?: LoadingManager) =>
  storageMemoize(async () => {
    const { default: hdr } = await import(
      // @ts-ignore
      /* webpackChunkName: "Environment" */ "../../assets/models/textures/Environment/Environment.hdr"
    )
    const environmentTexture = await loadRGBE(hdr, loadingManager)
    return environmentTexture as DataTexture
  }, "ENVIRONMENT")
