import {
  Body,
  BodyModel,
  createPaintConfig,
  Decal,
  RocketAssetManager,
  Wheel,
  WheelsModel,
} from "rl-loadout-lib"
import { Mesh, MeshStandardMaterial, Texture } from "three"

import { ExtendedPlayer } from "../../models/ReplayMetadata"

export const loadRlLoadout = async (
  manager: RocketAssetManager,
  player: ExtendedPlayer,
  envMap: Texture,
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
      Body.DEFAULT
    )

    // TODO use the default wheel for now, there aren't a lot of wheels in rocket-loadout yet,
    // and not yet fully supported
    wheels = new WheelsModel(Wheel.DEFAULT, paintConfig, manager.config)

    await wheels.load()
    body = await bodyTask
  }

  body.addWheelsModel(wheels)

  body.scene.traverse(object => {
    if ((object as Mesh).isMesh) {
      object.receiveShadow = true
      object.castShadow = true;
      ((object as Mesh).material as MeshStandardMaterial).envMap = envMap
    }
  })

  return { player, body }
}
