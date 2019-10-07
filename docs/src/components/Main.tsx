import React, { Component } from "react"

import {
  FPSClock,
  GameBuilderOptions,
  loadReplay,
  ReplayData,
  ReplayMetadata,
} from "../../../src"
import CompactViewer from "./CompactViewer"
import Viewer from "./Viewer"

interface Props {
  compact?: boolean
}

interface State {
  options?: GameBuilderOptions
}

class Main extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const REPLAY_ID = "9944A36A11E987D3E286C1B524E68ECC"

    loadReplay(REPLAY_ID, true).then(([replayData, replayMetadata]) => {
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
    return this.props.compact ? (
      <CompactViewer options={options} />
    ) : (
      <Viewer options={options} />
    )
  }
}

export default Main
