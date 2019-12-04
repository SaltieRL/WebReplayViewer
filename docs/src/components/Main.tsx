import React, { Component, ErrorInfo } from "react"

import { FPSClock, GameBuilderOptions, loadReplay } from "../../../src"
import CompactViewer from "./CompactViewer"
import Viewer from "./Viewer"

interface Props {
  compact?: boolean
}

interface State {
  options?: GameBuilderOptions
  error?: Error
  errorInfo?: ErrorInfo
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
          defaultLoadouts: false
        },
      })
    })
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo })
  }

  render() {
    const { options, error, errorInfo } = this.state

    if (!options) {
      return "Loading..."
    } else if (error || errorInfo) {
      return JSON.stringify(error)
    }

    return this.props.compact ? (
      <CompactViewer options={options} />
    ) : (
      <Viewer options={options} />
    )
  }
}

export default Main
