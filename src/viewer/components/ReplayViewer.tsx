import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit"
import { styled } from "@material-ui/styles"
import React, { createRef, PureComponent, RefObject } from "react"
import Fullscreen from "react-full-screen"

import { GameManager } from "../../managers/GameManager"
import Scoreboard from "./ScoreBoard"

interface Props {
  gameManager: GameManager
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
    const { clientWidth: width, clientHeight: height } = current
    const { gameManager } = this.props
    current.appendChild(gameManager.getDOMNode())
    gameManager.updateSize(width, height)
    gameManager.render()
    gameManager.clock.play()

    addEventListener("resize", this.handleResize)
  }

  componentWillUnmount() {
    removeEventListener("resize", this.handleResize)
    const { gameManager } = this.props
    gameManager.clock.pause()
  }

  handleResize = () => {
    const { clientWidth: width, clientHeight: height } = this.mount.current!
    const { gameManager } = this.props
    gameManager.updateSize(width, height)
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
        <Fullscreen enabled={fullScreen} onChange={this.toggleFullscreen}>
          <Viewer>
            <div ref={this.mount} />
          </Viewer>
          <Scoreboard />
          <FullscreenToggle>
            <Button onClick={onClick}>
              <Typography style={{ color: "#fff" }}>
                {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </Typography>
            </Button>
          </FullscreenToggle>
        </Fullscreen>
      </ViewerContainer>
    )
  }
}

const ViewerContainer = styled("div")({
  width: "100%",
  height: 480,
  position: "relative",
})

const Viewer = styled("div")({
  width: "100%",
  height: "100%",
  "&& div": {
    width: "100%",
    height: "100%",
  },
})

const FullscreenToggle = styled("div")({
  position: "absolute",
  bottom: 0,
  right: 0,
})

export default ReplayViewer
