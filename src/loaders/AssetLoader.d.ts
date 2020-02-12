export interface AssetLoader {
  loadBall(loadingManager?: LoadingManager): Promise<Object3D>
  loadField(loadingManager?: LoadingManager): Promise<Object3D>
  loadCar(
    player: ReplayPlayer,
    loadingManager?: LoadingManager
  ): Promise<Object3D>
}
