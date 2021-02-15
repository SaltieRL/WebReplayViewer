import { GameMode, GameScore } from "./Game"
import { ReplayPlayer } from "./ReplayPlayer"

interface Replay {
  id: string
  name: string
  date: any
  map: string
  gameMode: GameMode
  gameScore: GameScore
  players: ReplayPlayer[]
  tags: Tag[]
}

interface Tag {
  name: string
  ownerId: string
}

export { Replay }
