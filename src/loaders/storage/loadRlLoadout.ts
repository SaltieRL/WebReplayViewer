import { createPaintConfig, RocketAssetManager, BodyModel, WheelsModel, Body, Wheel } from 'rl-loadout-lib';
import { ExtendedPlayer } from '../../models/ReplayMetadata';

export async function loadRlLoadout(manager: RocketAssetManager, player: ExtendedPlayer):
  Promise<{ body: BodyModel; player: ExtendedPlayer }> {
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

  const bodyTask = manager.loadBody(player.loadout.car, paintConfig, Body.DEFAULT)
  const wheelTask = manager.loadWheel(player.loadout.wheels, paintConfig, Wheel.DEFAULT)

  const body: BodyModel = await bodyTask
  const wheels: WheelsModel = await wheelTask

  body.addWheelsModel(wheels)

  body.scene.traverse(object => {
    // @ts-ignore
    if (object.isMesh) {
      object.receiveShadow = true
      object.castShadow = true
    }
  })

  return {player, body}
}
