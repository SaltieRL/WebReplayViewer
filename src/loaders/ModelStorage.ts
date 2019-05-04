import ModelLoader from "./ModelLoader"

export default class ModelStorage {
  public static getInstance() {
    if (!ModelStorage.instance) {
      ModelStorage.instance = new ModelStorage()
    }
    return ModelStorage.instance
  }

  private static instance?: ModelStorage
  private constructor() {}

  async loadBall() {
    // @ts-ignore
    const ball = await import("../assets/models/Ball.glb")
    return ModelLoader.loadObject(ball)
  }
}
