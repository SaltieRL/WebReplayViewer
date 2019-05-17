import React, { Component } from "react"
import { GameManager } from "../../managers/GameManager"
import { FPSClockSubscriberOptions } from "../../utils/FPSClock"

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

    this.onClockUpdate = this.onClockUpdate.bind(this)
    GameManager.getInstance().clock.subscribe(this.onClockUpdate)
  }

  onClockUpdate({ paused }: FPSClockSubscriberOptions) {
    this.setState({
      paused,
    })
  }

  render() {
    const { clock } = GameManager.getInstance()
    const onClick = () => (clock.isPaused() ? clock.play() : clock.pause())
    return (
      <div>
        <button onClick={onClick}>
          {this.state.paused ? "Play" : "Pause"}
        </button>
      </div>
    )
  }
}
