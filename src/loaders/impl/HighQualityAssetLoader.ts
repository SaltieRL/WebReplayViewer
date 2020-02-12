import {
  Body,
  BodyModel,
  createPaintConfig,
  RocketAssetManager,
  Wheel,
  WheelsModel,
} from "rl-loadout-lib"
import {
  LoadingManager,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Object3D,
} from "three"

import { getCarName } from "../../builders/utils/playerNameGetters"
import { ReplayPlayer } from "../../models/ReplayPlayer"
import { AssetLoader } from "../AssetLoader"
import { loadBall } from "../storage/loadBall"
import { loadField } from "../storage/loadField"

export default class HighQualityAssetLoader implements AssetLoader {
  private readonly manager: RocketAssetManager

  constructor(manager: RocketAssetManager) {
    this.manager = manager
  }

  async loadBall(loadingManager?: LoadingManager): Promise<Object3D> {
    const ball = await loadBall(loadingManager)
    ball.scale.setScalar(105)
    return ball
  }

  async loadField(loadingManager?: LoadingManager): Promise<Object3D> {
    const field = await loadField(loadingManager)
    field.scale.setScalar(400)
    return field
  }

  async loadCar(player: ReplayPlayer): Promise<Object3D> {
    const body = await this.buildBody(player)
    this.setMaterials(body)
    body.scene.name = getCarName(player.name)
    return body.scene
  }

  private async buildBody(player: ReplayPlayer): Promise<BodyModel> {
    const paintConfig = createPaintConfig(
      player.isOrange,
      player.loadout.primaryColor,
      player.loadout.accentColor,
      player.loadout.carPaint,
      player.loadout.skinPaint,
      player.loadout.wheelsPaint,
      player.loadout.topperPaint,
      player.loadout.antennaPaint
    )

    const body = await this.manager.loadBody(
      player.loadout.car,
      paintConfig,
      Body.DEFAULT,
      player.loadout.skin
    )

    // TODO: use the default wheel for now, there aren't a lot of wheels in rocket-loadout yet, and
    // not yet fully supported
    const wheels = new WheelsModel(
      Wheel.DEFAULT,
      paintConfig,
      this.manager.config
    )
    await wheels.load()
    body.addWheelsModel(wheels)

    return body
  }

  private setMaterials(body: BodyModel) {
    body.scene.traverse(object => {
      // @ts-ignore
      if (object.isMesh) {
        const mesh = object as Mesh
        mesh.receiveShadow = true
        mesh.castShadow = true

        // Phong material is less physically accurate but has noticably better performance
        const oldMaterial = mesh.material as MeshStandardMaterial
        const phongMaterial = new MeshPhongMaterial()
        phongMaterial.name = oldMaterial.name
        phongMaterial.map = oldMaterial.map
        phongMaterial.normalMap = oldMaterial.normalMap
        phongMaterial.color = oldMaterial.color
        phongMaterial.shininess = (1 - oldMaterial.roughness) * 100
        phongMaterial.skinning = oldMaterial.skinning

        mesh.material = phongMaterial
        mesh.material.needsUpdate = true

        oldMaterial.dispose()
      }
    })
  }
}
