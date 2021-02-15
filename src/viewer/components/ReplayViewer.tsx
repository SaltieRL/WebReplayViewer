import React, { createRef, PureComponent, RefObject } from "react"
import styled from "styled-components"

import { dispatchCanvasResizeEvent } from "../../eventbus/events/canvasResize"
import { dispatchPlayPauseEvent } from "../../eventbus/events/playPause"
import { GameManager } from "../../managers/GameManager"
import Fullscreen from "./Fullscreen"
import Scoreboard from "./ScoreBoard"

interface Props {
  gameManager: GameManager
  autoplay?: boolean
}

class ReplayViewer extends PureComponent<Props> {
  private readonly mount: RefObject<HTMLDivElement>

  constructor(props: Props) {
    super(props)
    this.mount = createRef()
  }

  componentDidMount() {
    const { current } = this.mount
    if (!current) {
      throw new Error("Did not mount replay viewer correctly")
    }
    const { gameManager, autoplay } = this.props
    // Mount and resize canvas
    current.appendChild(gameManager.getDOMNode())
    this.handleResize()

    // Set the play/pause status to match autoplay property
    dispatchPlayPauseEvent({ paused: !autoplay })

    addEventListener("resize", this.handleResize)
  }

  componentWillUnmount() {
    removeEventListener("resize", this.handleResize)
    const { gameManager } = this.props
    gameManager.clock.pause()
  }

  handleResize = () => {
    const { current } = this.mount
    if (!current) return
    const { clientWidth: width, clientHeight: height } = current
    dispatchCanvasResizeEvent({ width, height })
  }

  render() {
    return (
      <ViewerContainer>
        <Fullscreen>
          <div style={{ width: "100%", height: "100%" }} ref={this.mount} />
          <Scoreboard />
          {this.props.children}
        </Fullscreen>
      </ViewerContainer>
    )
  }
}

const ViewerContainer = styled.div`
  width: 100%;
  height: 480px;
  position: relative;
  .fullscreen {
    width: 100%;
    height: 100%;
  }
`

export default ReplayViewer
