import { ReplayPlayer } from "./ReplayPlayer"

interface ReplayMetadata {
  gameMetadata: GameMetadata
  players: ExtendedPlayer[]
  version: number
  mutators?: {
    ballType: "string"
    gameMutatorIndex: number
  }
  // TODO
  teams: any[]
  gameStats: any
}

interface GameMetadata {
  id: string
  name: string
  map: string
  version: number
  time: string
  frames: number
  score: {
    team0Score: number
    team1Score: number
  }
  goals: Goal[]
}

interface Goal {
  frameNumber: number
  playerId: { id: string }
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
interface ExtendedPlayer extends Omit<ReplayPlayer, "id"> {
  id: { id: string }
}

export { ReplayMetadata, Goal, ExtendedPlayer }
