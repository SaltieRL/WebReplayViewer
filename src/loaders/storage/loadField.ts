import { defaultMemoize } from "reselect"
import { Group, LoadingManager } from "three"

import { loadObject } from "../operators/loadObject"

export const loadField = defaultMemoize(
  async (loadingManager?: LoadingManager) => {
    const { default: glb } = await import(
      // @ts-ignore
      /* webpackChunkName: "Field" */ "../../assets/models/Field.glb"
    )
    const fieldGLTF = await loadObject(glb, loadingManager)
    const field = new Group()
    field.name = "Field"
    field.add(...fieldGLTF.scene.children)
    return field
  }
)
