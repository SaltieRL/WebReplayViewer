import React, { createRef, PureComponent, RefObject } from "react"
import { LoadingManager } from "three"

import { GameManager } from "../../managers/GameManager"
import { ReplayData } from "../../models/ReplayData"
import FPSClock from "../../utils/FPSClock"
import defaultGameBuilder from "../../builders/GameBuilder"

interface Props {
  replayData: ReplayData
  clock: FPSClock
}

class ReplayViewer extends PureComponent<Props> {
  private mount: RefObject<HTMLDivElement>
  private loadingManager: LoadingManager
  private gameManager?: GameManager

  constructor(props: Props) {
    super(props)
    this.mount = createRef()
    this.loadingManager = new LoadingManager()
  }

  componentDidMount() {
    const { clientWidth: width, clientHeight: height } = this.mount.current || {
      clientWidth: 640,
      clientHeight: 480,
    }

    const { replayData, clock } = this.props
    defaultGameBuilder({
      replayData,
      clock,
      loadingManager: this.loadingManager,
    }).then(gameManager => {
      this.gameManager = gameManager
      this.mount.current!.appendChild(gameManager.getDOMNode())
      gameManager.updateSize(width, height)
      gameManager.render()
      clock.play()
    })
  }

  render() {
    return <div ref={this.mount} style={{ width: 640, height: 480 }} />
  }
}

export default ReplayViewer
