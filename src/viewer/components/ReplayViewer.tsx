import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import React, { createRef, PureComponent, RefObject } from "react"
import FullScreen from "react-full-screen"
import styled from "styled-components"

import { dispatchCanvasResizeEvent } from "../../eventbus/events/canvasResize"
import { dispatchPlayPauseEvent } from "../../eventbus/events/playPause"
import { GameManager } from "../../managers/GameManager"
import FullscreenExitIcon from "./icons/FullscreenExitIcon"
import FullscreenIcon from "./icons/FullscreenIcon"
import Scoreboard from "./ScoreBoard"

interface Props {
  gameManager: GameManager
  autoplay?: boolean
}

interface State {
  fullScreen: boolean
}

class ReplayViewer extends PureComponent<Props, State> {
  private readonly mount: RefObject<HTMLDivElement>

  constructor(props: Props) {
    super(props)
    this.mount = createRef()
    this.state = {
      fullScreen: false,
    }
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
    const { clientWidth: width, clientHeight: height } = this.mount.current!
    dispatchCanvasResizeEvent({ width, height })
  }

  toggleFullscreen = (enabled: boolean) => {
    this.setState({
      fullScreen: enabled,
    })
  }

  render() {
    const { fullScreen } = this.state
    const onClick = () => this.toggleFullscreen(!this.state.fullScreen)
    return (
      <ViewerContainer>
        <FullscreenWrapper
          enabled={fullScreen}
          onChange={this.toggleFullscreen}
        >
          <div style={{ width: "100%", height: "100%" }} ref={this.mount} />
          <Scoreboard />
          <FullscreenToggle>
            <Button onClick={onClick}>
              <Typography style={{ color: "#fff" }}>
                {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </Typography>
            </Button>
          </FullscreenToggle>
          {this.props.children}
        </FullscreenWrapper>
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
const FullscreenWrapper = styled(FullScreen)`
  width: 100%;
  height: 100%;
`
const FullscreenToggle = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`

export default ReplayViewer
