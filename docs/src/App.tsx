import React, { Component } from "react"
import {
  ReplayViewer,
  FPSClock,
  ReplayData,
  ReplayMetadata,
  GameManager,
} from "../../src"

interface State {
  gameManager?: GameManager
}

const fetchByURL = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => response.json())

class App extends Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const REPLAY_ID = "BDC240CE11E96C735CEBCE8190E3C53A"

    Promise.all([
      fetchByURL(`https://calculated.gg/api/replay/${REPLAY_ID}/positions`),
      fetchByURL(`https://calculated.gg/api/v1/replay/${REPLAY_ID}?key=1`),
    ])
      .then(([replayData, replayMetadata]: [ReplayData, ReplayMetadata]) => {
        return GameManager.builder({
          replayData,
          replayMetadata,
          clock: FPSClock.convertReplayToClock(replayData),
        })
      })
      .then(gameManager => {
        this.setState({ gameManager })
      })
  }

  render() {
    const { gameManager } = this.state
    return (
      <div>
        <div>
          <h2>Welcome to React</h2>
        </div>
        {gameManager ? (
          <ReplayViewer gameManager={gameManager} />
        ) : (
          "Loading..."
        )}
      </div>
    )
  }
}

export default App
