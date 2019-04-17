interface Replay {
  id: string
  name: string
  date: import("moment").Moment
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
