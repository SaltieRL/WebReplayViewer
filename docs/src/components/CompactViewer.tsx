import Grid from "@material-ui/core/Grid"
import React, { Component } from "react"

import {
  CompactPlayControls,
  GameBuilderOptions,
  GameManager,
  GameManagerLoader,
  ReplayViewer,
} from "../../../src"

interface Props {
  options: GameBuilderOptions
}

interface State {
  gameManager?: GameManager
}

class CompactViewer extends Component<Props, State> {
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
      <Grid container direction="column" justify="center" spacing={3}>
        <Grid item style={{ minHeight: 0, maxWidth: 900, width: "100%" }}>
          <ReplayViewer gameManager={gameManager}>
            <CompactPlayControls />
          </ReplayViewer>
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

export default CompactViewer
