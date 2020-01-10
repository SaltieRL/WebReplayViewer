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

import DrawingManager, { DrawableMeshIndex } from "../../managers/DrawingManager"
import BoxIcon from "./icons/BoxIcon"

interface Props { }

interface State {
  isDrawingMode: boolean
  color: string
  meshScale: number
  drawObject: DrawableMeshIndex
  is3dMode: boolean
}

class DrawingControls extends PureComponent<Props, State> {
  colorPicker: React.RefObject<HTMLInputElement>
  constructor(props: Props) {
    super(props)
    this.state = {
      isDrawingMode: false,
      color: "#00ea0c",
      meshScale: 200,
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

  changeSelectedDrawObject = (object: DrawableMeshIndex) => {
    if (this.state.drawObject === object) return
    this.setState({
      drawObject: object,
    })
    DrawingManager.getInstance().drawObject = object
  }

  changeMeshScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = Number(e.target.value)
    this.setState({
      meshScale: scale,
    })
    DrawingManager.getInstance().meshScale = scale
  }

  clearDrawings = () => {
    DrawingManager.getInstance().clearDrawings()
  }

  renderControlButtons = () => {
    const drawableMeshes:DrawableMeshIndex[] = ['box','sphere','line']
    const meshButtons = {
      sphere: SphereIcon,
      line: LineIcon,
      box: BoxIcon
    }
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
            {drawableMeshes.map((value, index) => {
              const IconButton = meshButtons[value];
              return <Button key={index}
                  variant={this.state.drawObject == value ? "contained" : "outlined"}
                  color={this.state.drawObject == value ? "primary" : "default"}
                  onClick={() => this.changeSelectedDrawObject(value)}
                >
                  <IconButton color={this.state.drawObject == value ? "#ffffff" : "#000000"} />
                </Button>
            })}
          </ButtonGroup>
        </Grid>
        {this.state.drawObject == "sphere" || this.state.drawObject == "box"
          ? <Grid item xs={2}>
            <Input
              type="number"
              placeholder="Scale"
              defaultValue={this.state.meshScale}
              onChange={this.changeMeshScale}
              startAdornment={<InputAdornment position="start">Scale</InputAdornment>}
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