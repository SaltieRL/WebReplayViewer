import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"

import ColorIcon from "./icons/ColorIcon"
import DropDownIcon from "./icons/DropDownIcon"
import DeleteIcon from "./icons/DeleteIcon"
import PencilIcon from "./icons/PencilIcon"
import PencilOffIcon from "./icons/PencilOffIcon"
import SphereIcon from "./icons/SphereIcon"
import LineIcon from "./icons/LineIcon"

import React, { PureComponent } from "react"
import styled from "styled-components"

import DrawingManager from "../../managers/DrawingManager"

interface Props { }

interface State {
  isDrawingMode: boolean
  color: string
  sphereRadius: number
  drawObject: string
  is3dMode: boolean
}

class DrawingControls extends PureComponent<Props, State> {
  colorPicker: React.RefObject<HTMLInputElement>
  constructor(props: Props) {
    super(props)
    this.state = {
      isDrawingMode: false,
      color: "#00ea0c",
      sphereRadius: 200,
      drawObject: "line",
      is3dMode: false,
    }
    this.colorPicker = React.createRef()
  }

  toggleDrawingMode = () => {
    const isDrawingMode = !this.state.isDrawingMode
    this.setState({
      isDrawingMode,
    })
    isDrawingMode ? DrawingManager.init(this.state) : DrawingManager.destruct()
  }

  toggle3dMode = () => {
    const is3dMode = !this.state.is3dMode
    this.setState({
      is3dMode: is3dMode
    })
    DrawingManager.getInstance().is3dMode = is3dMode
  }

  changecolor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    this.setState({
      color: color,
    })
    DrawingManager.getInstance().setColor(color)
  }

  toggleColorPicker = () => {
    this.colorPicker.current && this.colorPicker.current.click()
  }

  changeSelectedDrawObject = (object: string) => {
    if (this.state.drawObject === object) return
    this.setState({
      drawObject: object,
    })
    DrawingManager.getInstance().drawObject = object
  }

  changeSphereRadius = (e: React.ChangeEvent<HTMLInputElement>) => {
    const radius = Number(e.target.value)
    this.setState({
      sphereRadius: radius,
    })
    DrawingManager.getInstance().sphereRadius = radius
  }

  clearDrawings = () => {
    DrawingManager.getInstance().clearDrawings()
  }

  renderControlButtons = () => {
    return (
      <React.Fragment>
        <Grid item>
          <ButtonGroup size="small" variant="outlined">
            <Button onClick={this.toggleColorPicker}>
              <ColorIcon selectedColor={this.state.color} />
              <DropDownIcon />
              <HiddenInput
                ref={this.colorPicker}
                type="color"
                value={this.state.color}
                onChange={this.changecolor}
              />
            </Button>
            <Button onClick={this.clearDrawings}>
              <DeleteIcon />
            </Button>
            <Button onClick={this.toggle3dMode} title="3D-Draw on the field object or in front of camera">
              {this.state.is3dMode ? "3D" : "2D"}
            </Button>
            <Button
              variant={this.state.drawObject == "sphere" ? "contained" : "outlined"}
              color={this.state.drawObject == "sphere" ? "primary" : "default"}
              onClick={() => this.changeSelectedDrawObject("sphere")}
            >
              <SphereIcon color={this.state.drawObject == "sphere" ? "#ffffff" : "#000000"} />
            </Button>
            <Button
              variant={this.state.drawObject == "line" ? "contained" : "outlined"}
              color={this.state.drawObject == "line" ? "primary" : "default"}
              onClick={() => this.changeSelectedDrawObject("line")}
            >
              <LineIcon color={this.state.drawObject == "line" ? "#ffffff" : "#000000"} />
            </Button>
          </ButtonGroup>
        </Grid>
        {this.state.drawObject == "sphere"
          ? <Grid item xs={2}>
            <Input
              type="number"
              placeholder="Sphere radius"
              defaultValue={this.state.sphereRadius}
              onChange={this.changeSphereRadius}
              startAdornment={<InputAdornment position="start">Radius</InputAdornment>}
            />
          </Grid>
          : null
        }
      </React.Fragment>
    )
  }

  render() {
    return (
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Button onClick={this.toggleDrawingMode} variant="outlined" startIcon={this.state.isDrawingMode ? <PencilOffIcon /> : <PencilIcon />}>
            Drawing Mode
          </Button>
        </Grid>
        {this.state.isDrawingMode && this.renderControlButtons()}
      </Grid>
    )
  }
}

const HiddenInput = styled.input`
  && {
    display: none;
  }
`

export default DrawingControls