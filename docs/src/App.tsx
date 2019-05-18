import React, { Component } from "react"
import {
  ReplayViewer,
  GameManager,
  loadBuilderFromReplay,
  PlayControls,
  PlayerCameraControls,
  Slider,
  FieldCameraControls,
} from "../../src"
import { Grid, withStyles, WithStyles } from "@material-ui/core"

interface State {
  gameManager?: GameManager
}

class App extends Component<WithStyles, State> {
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
    const { root } = this.props.classes
    return (
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
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
            <Grid item style={{ minHeight: 0 }}>
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
