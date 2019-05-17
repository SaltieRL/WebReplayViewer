import React, { createRef, PureComponent, RefObject } from "react"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"

import { GameManager } from "../../managers/GameManager"
import Scoreboard from "./ScoreBoard"
import { addToWindow } from "../../utils/addToWindow"

interface Props extends WithStyles {
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
    const { viewerContainer, viewer } = this.props.classes
    return (
      <div className={viewerContainer}>
        <div className={viewer} ref={this.mount} />
        <Scoreboard />
      </div>
    )
  }
}

export default withStyles({
  viewerContainer: {
    width: "100%",
    height: 480,
    position: "relative",
  },
  viewer: {
    width: "100%",
    height: "100%",
  },
})(ReplayViewer)
