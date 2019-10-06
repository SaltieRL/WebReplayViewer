import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import React, { Component } from "react"
import styled from "styled-components"

import {
  addPlayPauseListener,
  dispatchPlayPauseEvent,
  PlayPauseEvent,
  removePlayPauseListener,
} from "../../eventbus/events/playPause"
import PausedIcon from "./icons/PausedIcon"
import PlayIcon from "./icons/PlayIcon"
import Slider from "./Slider"

interface Props extends WithStyles {}

interface State {
  paused: boolean
}

class CompactPlayControls extends Component<Props, State> {
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
    const { paused } = this.state
    const { focused, thumb, track } = this.props.classes
    return (
      <ControlsWrapper>
        <Grid container spacing={24} alignItems="center">
          <Grid item>
            <Button onClick={this.setPlayPause}>
              {paused ? <PlayIcon /> : <PausedIcon />}
            </Button>
          </Grid>
          <Grid item zeroMinWidth xs>
            <Slider
              classes={{
                thumb,
                track,
                focused,
              }}
            />
          </Grid>
        </Grid>
      </ControlsWrapper>
    )
  }
}

const ControlsWrapper = styled.div`
  position: absolute;
  bottom: 6px;
  left: 12px;
  right: 60px;
`

export default withStyles({
  focused: {},
  track: {
    backgroundColor: "#fff",
  },
  thumb: {
    backgroundColor: "#fff",
    "&:focus,&:hover,&$active": {
      boxShadow: "inherit",
    },
  },
})(CompactPlayControls)
