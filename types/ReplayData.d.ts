interface ReplayData {
  ball: BallFrame[] // [pos_x, pos_z, pos_y, rot_x, rot_z, rot_y]
  colors: boolean[]
  frames: number[][]
  names: string[]
  id: string
  players: PlayerFrame[][] // Each frame contains a PlayerFrame for each player
}

type BallFrame = [PosX, PosZ, PosY, RotX, RotZ, RotY]
type PlayerFrame = [PosX, PosZ, PosY, RotX, RotZ, RotY, Boost]
type PosX = number
type PosY = number
type PosZ = number
type RotX = number
type RotY = number
type RotZ = number
type Boost = boolean
