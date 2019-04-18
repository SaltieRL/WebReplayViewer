type GameMode = "1's" | "2's" | "3's" | "Standard"

interface GameScore {
  team0Score: number
  team1Score: number
}

export { GameMode, GameScore }
