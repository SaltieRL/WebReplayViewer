import { BodyModel } from 'rl-loadout-lib';
import { ExtendedPlayer } from '../../models/ReplayMetadata';
import { getCarName, getGroupName } from '../utils/playerNameGetters';
import { Group, Scene } from 'three';
import { generateSprite } from './generateSprite';
import PlayerManager from '../../managers/models/PlayerManager';

export function buildRocketLoadoutGroup(scene: Scene, {body, player}: { body: BodyModel; player: ExtendedPlayer }) {
  body.scene.position.y += 31
  body.scene.name = getCarName(player.name)

  // Build sprite and camera container (for position)
  const group = new Group()
  group.name = getGroupName(player.name)
  group.add(body.scene)
  group.add(generateSprite(player.name, player.isOrange))

  scene.add(group)
  return new PlayerManager(player.name, player.isOrange, group)
}
