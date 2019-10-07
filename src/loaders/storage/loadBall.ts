import { LoadingManager, Object3D } from "three"

import { getChildByName } from "../operators/getChildByName"
import { loadObject } from "../operators/loadObject"
import { throwLoadingError } from "../operators/throwLoadingError"
import { storageMemoize } from "./storageMemoize"

export const loadBall = (loadingManager?: LoadingManager) =>
  storageMemoize(async () => {
    const { default: glb } = await import(
      // @ts-ignore
      /* webpackChunkName: "Ball" */ "../../assets/models/draco/Ball.glb"
    )
    const ballGLTF = await loadObject(glb, loadingManager)
    const ball = getChildByName(ballGLTF, "Ball")
    if (!ball) {
      throwLoadingError("Ball")
    }
    return ball as Object3D
  }, "BALL")
