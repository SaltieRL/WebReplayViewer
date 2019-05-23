import { styled } from "@material-ui/styles"
import React, { createRef, PureComponent, RefObject } from "react"

import { GameManager } from "../../managers/GameManager"
import { addToWindow } from "../../utils/addToWindow"
import Scoreboard from "./ScoreBoard"

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
