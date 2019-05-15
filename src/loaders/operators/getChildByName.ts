import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

export const getChildByName = (asset: GLTF, name: string) =>
  asset.scene.children.find(object => object.name === name)
