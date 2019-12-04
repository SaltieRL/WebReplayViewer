import { DirectionalLight, Scene } from "three"

export const addLighting = (scene: Scene) => {
  // The directional light is purely responsible for casting shadows
  const dirLight = new DirectionalLight(0xffffff, 1.5)
  dirLight.color.setHSL(0.1, 1, 0.95)
  dirLight.position.set(0, 2300, 0)
  dirLight.castShadow = true

  // Denotes the "detail" of the shadow
  dirLight.shadow.mapSize.width = 512
  dirLight.shadow.mapSize.height = 512

  // If you were "looking down" on the field, this is the area the light covers
  const distance = 5120
  dirLight.shadow.camera.left = -distance
  dirLight.shadow.camera.right = distance
  dirLight.shadow.camera.top = distance
  dirLight.shadow.camera.bottom = -distance

  dirLight.shadow.camera.far = 3500
  dirLight.shadow.bias = -0.0001
  dirLight.shadow.radius = 3

  scene.add(dirLight)
}
