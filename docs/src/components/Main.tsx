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
    const REPLAY_ID = "80F9E0AA11E9EDD0CC415BA96B37926C"

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
