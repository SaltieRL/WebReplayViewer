import React, { createRef, PureComponent, RefObject } from "react"
import styled from "styled-components"

import { GameManager } from "../../managers/GameManager"
import Scoreboard from "./ScoreBoard"
import { addToWindow } from "../../utils/addToWindow"

interface Props {
  gameManager: GameManager
}
interface State {}

class ReplayViewer extends PureComponent<Props, State> {
  private mount: RefObject<HTMLDivElement>

  constructor(props: Props) {
    super(props)
    this.mount = createRef()
  }

  componentDidMount() {
    const { clientWidth: width, clientHeight: height } = this.mount.current || {
      clientWidth: 640,
      clientHeight: 480,
    }
    const { gameManager } = this.props
    this.mount.current!.appendChild(gameManager.getDOMNode())
    gameManager.updateSize(width, height)
    gameManager.render()
    addToWindow("game", gameManager)
    gameManager.clock.play()
  }

  render() {
    const { gameManager } = this.props
    return (
      <ViewerContainer>
        <Viewer ref={this.mount} />
        <Scoreboard gameManager={gameManager} />
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
