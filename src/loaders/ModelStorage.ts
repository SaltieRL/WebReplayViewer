import ModelLoader from "./ModelLoader"
// @ts-ignore
// import ball from "../assets/models/Ball.glb"

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
    const { default: ball } = await import("../assets/models/Ball.glb")
    return ModelLoader.loadObject(ball)
  }
}
