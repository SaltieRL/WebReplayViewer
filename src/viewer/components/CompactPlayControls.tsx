import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
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

interface Props {
}

interface State {
  paused: boolean
  cameraControlsShowing: boolean
}

export default class CompactPlayControls extends Component<Props, State> {
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
              sx={{
                backgroundColor: "#fff",
                "&:focus,&:hover,&$active": {
                  boxShadow: "inherit",
                },
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
