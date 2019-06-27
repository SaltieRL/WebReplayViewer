import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import React, { Component } from "react"

import {
  addPlayPauseListener,
  dispatchPlayPauseEvent,
  PlayPauseEvent,
  removePlayPauseListener,
} from "../../eventbus/events/playPause"
import { GameManager } from "../../managers/GameManager"

interface Props {}

interface State {
  paused: boolean
}

export default class PlayControls extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      paused: false,
    }

    addPlayPauseListener(this.onPlayPause)
  }

  componentWillUnmount() {
    removePlayPauseListener(this.onPlayPause)
  }

  setPlayPause = () => {
    const isPaused = this.state.paused
    dispatchPlayPauseEvent({
      paused: !isPaused,
    })
  }

  onPlayPause = ({ paused }: PlayPauseEvent) => {
    this.setState({
      paused,
    })
  }

  render() {
    const { clock } = GameManager.getInstance()
    const onResetClick = () => clock.setFrame(0)

    return (
      <Grid container spacing={24}>
        <Grid item>
          <Button variant="outlined" onClick={this.setPlayPause}>
            {this.state.paused ? "Play" : "Pause"}
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={onResetClick}>
            Reset
          </Button>
        </Grid>
      </Grid>
    )
  }
}
