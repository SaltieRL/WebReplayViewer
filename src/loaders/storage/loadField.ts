import { Group, LoadingManager } from "three"

import { loadObject } from "../operators/loadObject"
import { storageMemoize } from "./storageMemoize"

export const loadField = (loadingManager?: LoadingManager) =>
  storageMemoize(async () => {
    const { default: glb } = await import(
      // @ts-ignore
      /* webpackChunkName: "Field" */ "../../assets/models/draco/Field.glb"
    )
    const fieldGLTF = await loadObject(glb, loadingManager)
    const field = new Group()
    field.name = "Field"
    field.add(...fieldGLTF.scene.children)
    return field
  }, "FIELD")
