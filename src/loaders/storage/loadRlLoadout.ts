import {
  Body,
  BodyModel,
  createPaintConfig,
  Decal,
  RocketAssetManager,
  Wheel,
  WheelsModel,
} from "rl-loadout-lib"
import { Mesh, MeshPhongMaterial, MeshStandardMaterial } from "three"

import { ExtendedPlayer } from "../../models/ReplayMetadata"

export const loadRlLoadout = async (
  manager: RocketAssetManager,
  player: ExtendedPlayer,
  defaultLoadout?: boolean
): Promise<{ body: BodyModel; player: ExtendedPlayer }> => {
  let body: BodyModel
  let wheels: WheelsModel

  if (defaultLoadout) {
    const paintConfig = createPaintConfig(player.isOrange)
    body = new BodyModel(Body.DEFAULT, Decal.NONE, paintConfig, manager.config)
    wheels = new WheelsModel(Wheel.DEFAULT, paintConfig, manager.config)
    await Promise.all([body.load(), wheels.load()])
  } else {
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

    const bodyTask = manager.loadBody(
      player.loadout.car,
      paintConfig,
      Body.DEFAULT,
      player.loadout.skin
    )

    // TODO use the default wheel for now, there aren't a lot of wheels in rocket-loadout yet,
    // and not yet fully supported
    wheels = new WheelsModel(Wheel.DEFAULT, paintConfig, manager.config)

    await wheels.load()
    body = await bodyTask
  }

  body.addWheelsModel(wheels)

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

  return { player, body }
}
