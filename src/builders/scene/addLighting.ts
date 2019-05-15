import { AmbientLight, HemisphereLight, Scene } from "three"

export const addLighting = (scene: Scene) => {
  // Ambient light
  scene.add(new AmbientLight(0x444444))

  // Hemisphere light
  scene.add(new HemisphereLight(0xffffbb, 0x080820, 1))
}
