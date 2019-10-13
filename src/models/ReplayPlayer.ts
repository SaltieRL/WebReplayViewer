interface ReplayPlayer {
  id: string
  name: string
  isOrange: boolean
  score: number
  goals: number
  assists: number
  saves: number
  shots: number
  cameraSettings: CameraSettings
  loadout: Loadout
}

interface CameraSettings {
  distance: number
  fieldOfView: number
  transitionSpeed: number
  pitch: number
  swivelSpeed: number
  stiffness: number
  height: number
}

interface Loadout {
  antenna: number
  banner: number
  boost: number
  car: number
  engineAudio: number
  goalExplosion: number
  skin: number
  topper: number
  trail: number
  wheels: number
  primaryColor: number
  accentColor: number
  bannerPaint: number
  boostPaint: number
  carPaint: number
  goalExplosionPaint: number
  skinPaint: number
  trailPaint: number
  wheelsPaint: number
  topperPaint: number
  antennaPaint: number
}

export { ReplayPlayer }
