import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import ColorIcon from "./icons/ColorIcon"
import DropDownIcon from "./icons/DropDownIcon"
import DeleteIcon from "./icons/DeleteIcon"
import PencilIcon from "./icons/PencilIcon"
import PencilOffIcon from "./icons/PencilOffIcon"

import React, { PureComponent } from "react"
import styled from "styled-components"

import DrawingManager from "../../managers/DrawingManager"

interface Props {}

interface State {
  isDrawingMode: boolean
  shouldShowDialog: boolean
  selectedColor: string
}

class DrawingControls extends PureComponent<Props, State> {
  colorPicker: React.RefObject<HTMLInputElement>
  constructor(props: Props) {
    super(props)
    this.state = {
      isDrawingMode: false,
      shouldShowDialog: true,
      selectedColor: '#ff0000',
    }
    this.colorPicker = React.createRef()
  }
  
  toggleDrawingMode = () => {
    const isDrawingMode = !this.state.isDrawingMode
    this.setState({
      isDrawingMode,
    })
    isDrawingMode ? DrawingManager.init() : DrawingManager.destruct()
  }

  dialogShown = () => {
    this.setState({
      shouldShowDialog: false,
    })
  }

  changeSelectedColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    this.setState({
      selectedColor: color,
    });
    DrawingManager.getInstance().setColor(color)
  }

  toggleColorPicker = () => {
    this.colorPicker.current && this.colorPicker.current.click()
  }

  renderDialog = () => {
    return (
      <Dialog open={this.state.isDrawingMode && this.state.shouldShowDialog} onClose={this.dialogShown}>
        <List>
          <ListItem>
            <Typography>
              Holding ALT and dragging will draw spheres in 3D that will stick even when Free Cam
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Just dragging will draw Lines in front camera
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Holding CTRL and dragging will draw spheres in front of camera.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Turning Drawing Mode OFF will delete all existing drawings.
            </Typography>
          </ListItem>
        </List>
      </Dialog>
    )
  }

  clearDrawings = () => {
    DrawingManager.getInstance().clearDrawings()
  }

  renderControlButtons = () => {
    return (
      <Grid item>
      <ButtonGroup size="small" aria-label="small outlined button group" variant="outlined">
        <Button onClick={this.toggleColorPicker}>
            <ColorIcon selectedColor={this.state.selectedColor} />
            <DropDownIcon />
            <HiddenInput ref={this.colorPicker} type="color" value={this.state.selectedColor} onChange={this.changeSelectedColor} id="color-picker" />
        </Button>
        <Button onClick={this.clearDrawings}>
          <DeleteIcon />
        </Button>
        <Button>Three</Button>
      </ButtonGroup>
    </Grid>
    )
  }

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item>
          <Button onClick={this.toggleDrawingMode} variant="outlined" startIcon={this.state.isDrawingMode ? <PencilOffIcon /> : <PencilIcon />}>
            Drawing Mode
          </Button>
        </Grid>
        {this.state.isDrawingMode && this.renderControlButtons()}
        {this.renderDialog()}
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