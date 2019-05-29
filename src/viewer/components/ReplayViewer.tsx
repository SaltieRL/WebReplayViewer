import { styled } from "@material-ui/styles"
import React, { createRef, PureComponent, RefObject } from "react"

import { GameManager } from "../../managers/GameManager"
import Scoreboard from "./ScoreBoard"

interface Props {
  gameManager: GameManager
}

interface State {}

class ReplayViewer extends PureComponent<Props, State> {
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

  render() {
    return (
      <ViewerContainer>
        <Viewer>
          <div ref={this.mount} />
        </Viewer>
        <Scoreboard />
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

export default ReplayViewer
