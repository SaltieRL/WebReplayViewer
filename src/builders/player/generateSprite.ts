import {
  LinearMipMapLinearFilter,
  NearestFilter,
  Sprite,
  SpriteMaterial,
  Texture,
} from "three"

import { SPRITE } from "../../constants/gameObjectNames"

export const SPRITE_ORTHO_SCALE = 2400

export const generateSprite = (playerName: string, orangeTeam: boolean) => {
  const name = playerName.toUpperCase()

  const border = 10
  const fontSize = 60
  const canvasSize = 480
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = canvas.width
  const context = canvas.getContext("2d")

  const roundRect = (
    ct: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number
  ) => {
    if (w > h) {
      radius = h / 2
    } else {
      radius = w / 2
    }
    ct.beginPath()
    ct.moveTo(x + radius, y)
    ct.arcTo(x + w, y, x + w, y + h, radius)
    ct.arcTo(x + w, y + h, x, y + h, radius)
    ct.arcTo(x, y + h, x, y, radius)
    ct.arcTo(x, y, x + w, y, radius)
    ct.closePath()
    return ct
  }

  if (context) {
    const tagYOffset = 70
    const tagY = (canvas.height / 2) - (fontSize + border * 2) - tagYOffset
    context.font = `bold ${fontSize}px Arial`
    context.textBaseline = "middle"
    context.fillStyle = orangeTeam ? "#ff9800" : "#2196f3"
    roundRect(
      context,
      border,
      tagY,
      canvasSize,
      fontSize + border * 2,
      fontSize * 2
    ).fill()
    context.strokeStyle = "#eee"
    context.lineWidth = border
    roundRect(
      context,
      border,
      tagY,
      canvasSize,
      fontSize + border * 2,
      fontSize * 2
    ).stroke()
    context.fillStyle = "#fff"
    const measure = context.measureText(name)
    const padding = border / 2 + fontSize / 2
    const maxWidth = canvasSize - padding * 2
    const width = maxWidth > measure.width ? measure.width : maxWidth
    const x = canvasSize / 2 + border / 2 - width / 2
    context.fillText(name, x, canvas.height / 2 - fontSize / 2 - border - tagYOffset, maxWidth)
  }

  const texture = new Texture(canvas)
  texture.needsUpdate = true
  texture.magFilter = NearestFilter
  texture.minFilter = LinearMipMapLinearFilter
  const spriteMaterial = new SpriteMaterial({
    map: texture,
  })
  const sprite = new Sprite(spriteMaterial)
  sprite.position.setY(40)
  sprite.name = SPRITE

  return sprite
}
