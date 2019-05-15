import { defaultMemoize } from "reselect"
import { Group, LoadingManager } from "three"

import { loadObject } from "../operators/loadObject"

export const loadField = defaultMemoize(
  async (loadingManager?: LoadingManager) => {
    // @ts-ignore
    const { default: glb } = await import("../../assets/models/Field.glb")
    const fieldGLTF = await loadObject(glb, loadingManager)
    const field = new Group()
    field.name = "Field"
    field.add(...fieldGLTF.scene.children)
    return field
  }
)
