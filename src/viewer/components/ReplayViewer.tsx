import React, { createRef, PureComponent, RefObject } from "react"
import { LoadingManager } from "three"
import styled from "styled-components"

import { GameManager } from "../../managers/GameManager"
import { ReplayData } from "../../models/ReplayData"
import FPSClock from "../../utils/FPSClock"
import defaultGameBuilder from "../../builders/GameBuilder"
import Scoreboard from "./ScoreBoard"
import { ReplayMetadata } from "../../models/ReplayMetadata"

interface Props {
  replayData: ReplayData
  replayMetadata: ReplayMetadata
  clock: FPSClock
}

interface State {
  loadingManager: LoadingManager
  gameManager?: GameManager
}

class ReplayViewer extends PureComponent<Props, State> {
  private mount: RefObject<HTMLDivElement>

  constructor(props: Props) {
    super(props)
    this.mount = createRef()
    this.state = {
      loadingManager: new LoadingManager(),
    }
  }

  componentDidMount() {
    const { clientWidth: width, clientHeight: height } = this.mount.current || {
      clientWidth: 640,
      clientHeight: 480,
    }

    const { replayData, replayMetadata, clock } = this.props

    defaultGameBuilder({
      replayData,
      replayMetadata,
      clock,
      loadingManager: this.state.loadingManager,
    }).then(gameManager => {
      this.mount.current!.appendChild(gameManager.getDOMNode())
      gameManager.updateSize(width, height)
      gameManager.render()

      this.setState({
        gameManager,
      })
      clock.play()
    })
  }

  render() {
    const { gameManager } = this.state
    return (
      <ViewerContainer>
        <Viewer ref={this.mount} />
        {gameManager && <Scoreboard gameManager={gameManager} />}
      </ViewerContainer>
    )
  }
}

const ViewerContainer = styled.div`
  width: 640px;
  height: 480px;
  position: relative;
`

const Viewer = styled.div`
  width: 100%;
  height: 100%;
`

export default ReplayViewer
