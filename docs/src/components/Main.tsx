import React, { Component } from "react"

import { FPSClock, GameBuilderOptions, loadReplay } from "../../../src"
import Viewer from "./Viewer"

interface State {
  options?: GameBuilderOptions
}

class Main extends Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const REPLAY_ID = "9944A36A11E987D3E286C1B524E68ECC"

    loadReplay(REPLAY_ID).then(([replayData, replayMetadata]) => {
      this.setState({
        options: {
          replayData,
          replayMetadata,
          clock: FPSClock.convertReplayToClock(replayData),
        },
      })
    })
  }

  render() {
    const { options } = this.state

    if (!options) {
      return "Loading..."
    }

    return <Viewer options={options} />
  }
}

export default Main
