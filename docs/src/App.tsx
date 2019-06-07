import React, { Component } from "react"

import { FPSClock, GameManager, loadReplay } from "../../src"
import { GameBuilderOptions } from "../../src/builders/GameBuilder"
import Main from "./components/Main"

interface State {
  options?: GameBuilderOptions
}

class App extends Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const REPLAY_ID = "9944A36A11E987D3E286C1B524E68ECC"

    // loadBuilderFromReplay(REPLAY_ID).then(gameManager => {
    //   this.setState({ gameManager })
    // })
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

    return (
      <div style={{ maxWidth: 900, width: "100%", margin: "0 auto" }}>
        <div>
          <h2>Welcome to React</h2>
        </div>
        <Main options={options} />
      </div>
    )
  }
}

export default App
