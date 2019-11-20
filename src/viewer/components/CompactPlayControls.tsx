import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grid from "@material-ui/core/Grid"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import Typography from "@material-ui/core/Typography"
import React, { Component } from "react"
import styled from "styled-components"

import {
  addCameraChangeListener,
  removeCameraChangeListener,
} from "../../eventbus/events/cameraChange"
import {
  addPlayPauseListener,
  dispatchPlayPauseEvent,
  PlayPauseEvent,
  removePlayPauseListener,
} from "../../eventbus/events/playPause"
import FieldCameraControls from "./FieldCameraControls"
import Camera from "./icons/Camera"
import PausedIcon from "./icons/PausedIcon"
import PlayIcon from "./icons/PlayIcon"
import PlayerCameraControls from "./PlayerCameraControls"
import Slider from "./Slider"

interface Props extends WithStyles {}

interface State {
  paused: boolean
  cameraControlsShowing: boolean
}

class CompactPlayControls extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      paused: false,
      cameraControlsShowing: false,
    }

    addPlayPauseListener(this.onPlayPause)
    addCameraChangeListener(this.hideCameraControls)
  }

  componentWillUnmount() {
    removePlayPauseListener(this.onPlayPause)
    removeCameraChangeListener(this.hideCameraControls)
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

  showCameraControls = () => {
    this.setState({
      cameraControlsShowing: true,
    })
  }

  hideCameraControls = () => {
    this.setState({
      cameraControlsShowing: false,
    })
  }

  render() {
    const { paused, cameraControlsShowing } = this.state
    const { thumb, track } = this.props.classes
    return (
      <ControlsWrapper>
        <Grid container spacing={3} alignItems="center">
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
              }}
            />
          </Grid>
          <Grid item>
            <Button onClick={this.showCameraControls}>
              <Camera />
            </Button>
          </Grid>
        </Grid>
        <Dialog open={cameraControlsShowing} onClose={this.hideCameraControls}>
          <DialogTitle>Camera Controls</DialogTitle>
          <DialogContent>
            <Typography>Field Cameras</Typography>
            <FieldCameraControls />
            <Typography>Player Cameras</Typography>
            <PlayerCameraControls />
          </DialogContent>
        </Dialog>
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
