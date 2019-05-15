import React, { Component } from "react"
import { GameManager } from "../../managers/GameManager"

interface Props {}

interface State {
  paused: boolean
}

export default class PlayControls extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      paused: false,
    }

    this.togglePlay = this.togglePlay.bind(this)
  }

  togglePlay() {
    const { clock } = GameManager.getInstance()
    const { paused } = this.state
    this.setState({
      paused: !paused,
    })
    if (paused) {
      clock.play()
    } else {
      clock.pause()
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.togglePlay}>
          {this.state.paused ? "Play" : "Pause"}
        </button>
      </div>
    )
  }
}
