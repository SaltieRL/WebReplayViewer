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
    const { clientWidth, clientHeight } = this.mount.current || {
      clientWidth: 640,
      clientHeight: 480,
    }
    GameManager.init(
      this.props.replayData,
      clientWidth,
      clientHeight,
      this.loadingManager
    ).then(gm => {
      this.gameManager = gm
      this.mount.current!.appendChild(gm.getDOMNode())
    })
  }

  render() {
    return <div ref={this.mount}>Hello There Obi Wan</div>
  }
}

export default ReplayViewer
