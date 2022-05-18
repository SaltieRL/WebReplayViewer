import Grid from "@mui/material/Grid"
import React, { Component } from "react"

import {
  DrawingControls,
  FieldCameraControls,
  GameBuilderOptions,
  GameManager,
  GameManagerLoader,
  PlayControls,
  PlayerCameraControls,
  ReplayViewer,
  Slider,
} from "../../../src"

interface Props {
  options: GameBuilderOptions
}

interface State {
  gameManager?: GameManager
}

export default class Viewer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  renderContent() {
    const { gameManager } = this.state

    if (!gameManager) {
      return "Food machine broke..."
    }

    return (
      <Grid
        container
        sx={{
          "&& > div:nth-child(even)": {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          },
        }}
        direction="column"
        justifyContent="center"
        spacing={3}
      >
        <Grid item style={{ minHeight: 0, maxWidth: 900, width: "100%" }}>
          <ReplayViewer gameManager={gameManager} autoplay />
        </Grid>
        <Grid item>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
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
          <DrawingControls />
        </Grid>
        <Grid item>
          <Slider />
        </Grid>
      </Grid>
    )
  }

  render() {
    const { options } = this.props
    const onLoad = (gm: GameManager) => this.setState({ gameManager: gm })
    return (
      <GameManagerLoader options={options} onLoad={onLoad}>
        {this.renderContent()}
      </GameManagerLoader>
    )
  }
}

