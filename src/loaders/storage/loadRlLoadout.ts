import { createPaintConfig, RocketAssetManager, BodyModel, WheelsModel, Body, Wheel } from 'rl-loadout-lib'
import { ExtendedPlayer } from '../../models/ReplayMetadata'
import { Mesh, MeshPhongMaterial, MeshStandardMaterial } from 'three'

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

  return {player, body}
}
