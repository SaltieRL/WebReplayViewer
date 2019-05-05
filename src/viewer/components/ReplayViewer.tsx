import React, { createRef, PureComponent, RefObject } from "react"
import { LoadingManager } from "three"

import { GameManager } from "../../managers/GameManager"
import { ReplayData } from "../../models/ReplayData"
import FPSClock from "../../utils/FPSClock"

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
    props.clock.pause()
  }

  componentDidMount() {
    const { clientWidth: width, clientHeight: height } = this.mount.current || {
      clientWidth: 640,
      clientHeight: 480,
    }

    GameManager.init({
      replayData: this.props.replayData,
      loadingManager: this.loadingManager,
    }).then(gm => {
      this.gameManager = gm
      this.mount.current!.appendChild(gm.getDOMNode())
      gm.updateSize(width, height)
      gm.render()
    })
  }

  render() {
    return <div ref={this.mount} style={{ width: 640, height: 480 }} />
  }
}

export default ReplayViewer
