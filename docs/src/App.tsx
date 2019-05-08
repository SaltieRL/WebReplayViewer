import React, { Component } from "react"
import { ReplayViewer, FPSClock } from "../../src/index"
import { ReplayData } from "../../src/models/ReplayData"

interface State {
  replayData?: ReplayData
  clock?: FPSClock
}

class App extends Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    fetch(
      "https://calculated.gg/api/replay/BDC240CE11E96C735CEBCE8190E3C53A/positions",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then(response => response.json())
      .then(replayData => {
        this.setState({
          replayData,
          clock: FPSClock.convertReplayToClock(replayData),
        })
      })
  }

  render() {
    const { clock, replayData } = this.state
    return (
      <div>
        <div>
          <h2>Welcome to React</h2>
        </div>
        {replayData && clock ? (
          <ReplayViewer replayData={replayData} clock={clock} />
        ) : (
          "Loading..."
        )}
      </div>
    )
  }
}

export default App
