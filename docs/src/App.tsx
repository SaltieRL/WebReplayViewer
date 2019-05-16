import React, { Component } from "react"
import {
  ReplayViewer,
  GameManager,
  loadBuilderFromReplay,
  PlayControls,
  CameraControls,
} from "../../src"

interface State {
  gameManager?: GameManager
}

class App extends Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const REPLAY_ID = "BDC240CE11E96C735CEBCE8190E3C53A"

    loadBuilderFromReplay(REPLAY_ID).then(gameManager => {
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
          <>
            <ReplayViewer gameManager={gameManager} />
            <PlayControls />
            <CameraControls />
          </>
        ) : (
          "Loading..."
        )}
      </div>
    )
  }
}

export default App
