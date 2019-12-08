import Button, { ButtonProps } from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Typography from "@material-ui/core/Typography"
import React, { PureComponent } from "react"
import styled from "styled-components"

import DrawingManager from "../../managers/DrawingManager"

interface Props {}

interface State {
  isDrawingMode: boolean
  shouldShowDialog: boolean
}

class DrawingControls extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isDrawingMode: false,
      shouldShowDialog: true
    }
  }
  
  toggleDrawingMode = () => {
    const isDrawingMode = !this.state.isDrawingMode
    this.setState({
      isDrawingMode,
    })
    DrawingManager.getInstance().toggleDrawingMode(isDrawingMode)
  }

  dialogShown = () => {
    const shouldShowDialog = false
    this.setState({
      shouldShowDialog,
    })
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

  render() {
    return (
      <div>
        <DrawingButton onClick={this.toggleDrawingMode} variant="outlined">
          {this.state.isDrawingMode ? 'Turn Drawing Mode OFF' : 'Turn Drawing Mode ON'}
        </DrawingButton>
        {this.renderDialog()}
      </div>
    )
  }
}

const DrawingButton = styled(Button)`
  && {
    margin: 6px;
  }
` as React.ComponentType<ButtonProps>

export default DrawingControls