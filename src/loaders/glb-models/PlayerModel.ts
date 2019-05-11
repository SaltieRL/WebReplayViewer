import {
  AnimationMixer,
  Group,
  LinearMipMapLinearFilter,
  Mesh,
  MeshStandardMaterial,
  NearestFilter,
  Sprite,
  SpriteMaterial,
  Texture,
  AxesHelper,
} from "three"

import { _Model } from "./_Model"

interface PlayerConstructorOptions {
  playerName: string
  orangeTeam: boolean
  model: Group
}

export default class PlayerModel implements _Model {
  private playerName: string
  private orangeTeam: boolean
  private group: Group

  constructor({ playerName, orangeTeam, model }: PlayerConstructorOptions) {
    this.playerName = playerName
    this.orangeTeam = orangeTeam
    this.group = new Group()
    this.group.name = `${playerName}${PlayerModel.GROUP_SUFFIX}`
    this.generateGroup(model)
    this.generateSprite()
  }

  getThreeObject() {
    return this.group
  }

  toggleNametagVisibility(visible: boolean) {
    const sprite = this.group.children.find(
      child => child.name === PlayerModel.SPRITE_NAME
    )
    sprite!.visible = visible
  }

  getMixer() {
    return new AnimationMixer(this.group)
  }

  getCarGroup() {
    return this.group.children.find(
      child => child.name === `${this.playerName}${PlayerModel.CAR_SUFFIX}`
    ) as Group
  }

  private generateGroup(model: Group) {
    const carGroup = new Group()
    carGroup.scale.setScalar(0.02)
    carGroup.name = `${this.playerName}${PlayerModel.CAR_SUFFIX}`
    console.log(model.children)
    const children = model.children as Mesh[]
    // body.name = `${this.playerName}-body`
    // chassis.name = `${this.playerName}-chassis`
    // 0xff9800 is orange, 0x2196f3 is blue
    // const carColor = this.orangeTeam ? 0xff9800 : 0x2196f3
    // const bodyMaterial = (Array.isArray(body.material)
    //   ? body.material
    //   : [body.material]) as MeshStandardMaterial[]
    // bodyMaterial[0].color.setHex(carColor)
    carGroup.add(...children)
    this.group.add(carGroup)

    // Debug
    carGroup.add(new AxesHelper(200))
  }

  private generateSprite() {
    const name = this.playerName.toUpperCase()

    const border = 10
    const fontSize = 60
    const canvasSize = 480
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = canvas.width
    const context = canvas.getContext("2d")

    // Rectangle prototyping
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
      context.font = `bold ${fontSize}px Arial`
      context.fillStyle = this.orangeTeam ? "#ff9800" : "#2196f3"
      roundRect(
        context,
        border,
        border,
        canvasSize,
        fontSize + border * 2,
        fontSize * 2
      ).fill()
      context.strokeStyle = "#eee"
      context.lineWidth = border
      roundRect(
        context,
        border,
        border,
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
      context.fillText(name, x, fontSize + border, maxWidth)
    }

    const texture = new Texture(canvas)
    texture.needsUpdate = true
    texture.magFilter = NearestFilter
    texture.minFilter = LinearMipMapLinearFilter
    const spriteMaterial = new SpriteMaterial({
      map: texture,
    })
    const sprite = new Sprite(spriteMaterial)
    sprite.name = PlayerModel.SPRITE_NAME
    sprite.scale.setScalar(600)

    this.group.add(sprite)
  }

  private static SPRITE_NAME = "SPRITE"
  static GROUP_SUFFIX = "-group"
  static CAR_SUFFIX = "-car"
}
