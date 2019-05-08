import { ReplayMetadata } from "../models/ReplayMetadata"

export const getPlayerById = (
  replayMetadata: ReplayMetadata,
  playerId: string
) => replayMetadata.players.find(player => player.id.id === playerId)
