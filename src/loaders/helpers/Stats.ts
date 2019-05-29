import { Panel } from "./Panel"

export class Stats {
  dom: HTMLDivElement

  private mode: number

  private beginTime: number
  private prevTime: number
  private frames: number

  private readonly fpsPanel: Panel
  private readonly msPanel: Panel
  private readonly memPanel?: Panel

  constructor() {
    this.mode = 0

    const scope = this
    this.dom = document.createElement("div")
    scope.dom.style.cssText =
      "position:absolute;top:-48px;left:0;cursor:pointer;opacity:0.9;z-index:10000"
    scope.dom.addEventListener(
      "click",
      event => {
        event.preventDefault()
        scope.showPanel(++scope.mode % scope.dom.children.length)
      },
      false
    )

    this.beginTime = (performance || Date).now()
    this.prevTime = this.beginTime
    this.frames = 0

    this.fpsPanel = this.addPanel(new Panel("FPS", "#0ff", "#002"))
    this.msPanel = this.addPanel(new Panel("MS", "#0f0", "#020"))

    if (self.performance && (self.performance as any).memory) {
      this.memPanel = this.addPanel(new Panel("MB", "#f08", "#201"))
    }

    this.showPanel(0)
  }

  addPanel(panel: any) {
    this.dom.appendChild(panel.dom)
    return panel
  }

  /**
   * 0: fps, 1: ms, 2: mb, 3+: custom
   * @param id number referenced above
   */
  showPanel(id: number) {
    for (let i = 0; i < this.dom.children.length; i++) {
      const child = this.dom.children[i] as any
      if (child.style) {
        child.style.display = i === id ? "block" : "none"
      }
    }

    this.mode = id
  }

  begin() {
    this.beginTime = (performance || Date).now()
  }

  end() {
    this.frames++

    const time = (performance || Date).now()

    this.msPanel.update(time - this.beginTime, 200)

    if (time > this.prevTime + 1000) {
      this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100)

      this.prevTime = time
      this.frames = 0

      if (this.memPanel) {
        const memory = (performance as any).memory
        this.memPanel.update(
          memory.usedJSHeapSize / 1048576,
          memory.jsHeapSizeLimit / 1048576
        )
      }
    }

    return time
  }
  update() {
    this.beginTime = this.end()
  }
}
