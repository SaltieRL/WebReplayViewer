const round = Math.round

type FillStyle = string | CanvasGradient | CanvasPattern

export class Panel {
  private min: number
  private max: number
  private name: string
  private fg: FillStyle
  private bg: FillStyle

  dom: HTMLCanvasElement
  update: (value: number, maxValue: number) => void

  constructor(name: string, fg: FillStyle, bg: FillStyle) {
    this.min = Infinity
    this.max = 0
    this.name = name
    this.fg = fg
    this.bg = bg
    const { canvas, update } = this.init()
    this.dom = canvas
    this.update = update
  }

  private init() {
    const PR = round(window.devicePixelRatio || 1)

    const WIDTH = 80 * PR,
      HEIGHT = 48 * PR,
      TEXT_X = 3 * PR,
      TEXT_Y = 2 * PR,
      GRAPH_X = 3 * PR,
      GRAPH_Y = 15 * PR,
      GRAPH_WIDTH = 74 * PR,
      GRAPH_HEIGHT = 30 * PR

    const canvas = document.createElement("canvas")
    canvas.width = WIDTH
    canvas.height = HEIGHT
    canvas.style.cssText = "width:80px;height:48px"

    const context = canvas.getContext("2d")!
    context.font = "bold " + 9 * PR + "px Helvetica,Arial,sans-serif"
    context.textBaseline = "top"

    context.fillStyle = this.bg
    context.fillRect(0, 0, WIDTH, HEIGHT)

    context.fillStyle = this.fg
    context.fillText(this.name, TEXT_X, TEXT_Y)
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)

    context.fillStyle = this.bg
    context.globalAlpha = 0.9
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)

    const update = (value: number, maxValue: number) => {
      this.min = Math.min(this.min, value)
      this.max = Math.max(this.max, value)

      context.fillStyle = this.bg
      context.globalAlpha = 1
      context.fillRect(0, 0, WIDTH, GRAPH_Y)
      context.fillStyle = this.fg
      context.fillText(
        `${round(value)} ${this.name} (${round(this.min)}-${round(this.max)})`,
        TEXT_X,
        TEXT_Y
      )

      context.drawImage(
        canvas,
        GRAPH_X + PR,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT,
        GRAPH_X,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT
      )

      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT)

      context.fillStyle = this.bg
      context.globalAlpha = 0.9
      context.fillRect(
        GRAPH_X + GRAPH_WIDTH - PR,
        GRAPH_Y,
        PR,
        round((1 - value / maxValue) * GRAPH_HEIGHT)
      )
    }

    return { canvas, update }
  }
}
