import {
  Body,
  BodyModel,
  createPaintConfig,
  PaintConfig,
  RocketAssetManager,
  Wheel,
} from "rl-loadout-lib"
import { Mesh } from "three"

import { ExtendedPlayer } from "../../models/ReplayMetadata"

const OCTANE_BODY_ID = Body.DEFAULT.id
const OEM_WHEEL_ID = Wheel.DEFAULT.id

export const loadRlLoadout = async (
  manager: RocketAssetManager,
  player: ExtendedPlayer,
  defaultLoadout?: boolean
): Promise<{ body: BodyModel; player: ExtendedPlayer }> => {
  let paintConfig: PaintConfig
  if (defaultLoadout) {
    paintConfig = new PaintConfig()
  } else {
    paintConfig = createPaintConfig(
      player.isOrange,
      player.loadout.primaryColor,
      player.loadout.accentColor,
      player.loadout.carPaint,
      player.loadout.skinPaint,
      player.loadout.wheelsPaint,
      player.loadout.topperPaint,
      player.loadout.antennaPaint
    )
  }

  const bodyId = defaultLoadout ? OCTANE_BODY_ID : player.loadout.car
  const wheelId = defaultLoadout ? OEM_WHEEL_ID : player.loadout.wheels

  const body = await manager.loadBody(bodyId, paintConfig, Body.DEFAULT)
  const wheels = await manager.loadWheel(wheelId, paintConfig, Wheel.DEFAULT)

  // Add the wheels to the body.
  // It will automatically create 4 wheels with the correct position and scale
  body.addWheelsModel(wheels)

  body.scene.traverse(object => {
    // @ts-ignore
    if (object.isMesh) {
      const mesh = object as Mesh
      mesh.receiveShadow = true
      mesh.castShadow = true
    }
  })

  return { player, body }
}
