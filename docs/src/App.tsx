import { Grid, WithStyles, withStyles } from "@material-ui/core"
import React, { Component } from "react"

import {
  FieldCameraControls,
  GameManager,
  loadBuilderFromReplay,
  PlayControls,
  PlayerCameraControls,
  ReplayViewer,
  Slider,
} from "../../src"

interface State {
  gameManager?: GameManager
}

class App extends Component<WithStyles, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const REPLAY_ID = "9944A36A11E987D3E286C1B524E68ECC"

    loadBuilderFromReplay(REPLAY_ID).then(gameManager => {
      this.setState({ gameManager })
    })
  }

  render() {
    const { gameManager } = this.state
    const { root } = this.props.classes
    return (
      <div style={{ maxWidth: 900, width: "100%", margin: "0 auto" }}>
        <div>
          <h2>Welcome to React</h2>
        </div>
        {gameManager ? (
          <Grid
            container
            className={root}
            direction="column"
            justify="center"
            spacing={24}
          >
            <Grid item style={{ minHeight: 0, maxWidth: 900, width: "100%" }}>
              <ReplayViewer gameManager={gameManager} />
            </Grid>
            <Grid item>
              <Grid
                container
                justify="space-between"
                alignItems="center"
                spacing={24}
              >
                <Grid item>
                  <PlayControls />
                </Grid>
                <Grid item>
                  <FieldCameraControls />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <PlayerCameraControls />
            </Grid>
            <Grid item>
              <Slider />
            </Grid>
          </Grid>
        ) : (
          "Loading..."
        )}
      </div>
    )
  }
}

export default withStyles({
  root: {
    "&& > div:nth-child(even)": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
  },
})(App)
