import Button, { ButtonProps } from "@material-ui/core/Button"
import React, { PureComponent } from "react"
import styled from "styled-components"

import DrawingManager from "../../managers/DrawingManager"

interface Props {}

interface State {
  isDrawingMode: boolean
}

class DrawingControls extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isDrawingMode: false,
    }
  }
  
  toggleDrawingMode = () => {
    const isDrawingMode = !this.state.isDrawingMode
    this.setState({
      isDrawingMode,
    })
    DrawingManager.getInstance().toggleDrawingMode(isDrawingMode)
  }

  // renderDrawingControls = () => {
  //   return (
  //     <Dialog open={this.state.drawingModeOn} onClose={this.toggleDrawingMode}>
  //       <List>
  //         <ListItem>
  //           <Typography>
  //             Sphere
  //           </Typography>
  //         </ListItem>
  //       </List>
  //     </Dialog>
  //   )
  // }

  render() {
    return (
      <div>
        <DrawingButton onClick={this.toggleDrawingMode} variant="outlined">
          {this.state.isDrawingMode ? 'Turn Drawing Mode OFF' : 'Turn Drawing Mode ON'}
        </DrawingButton>
        {/* {this.renderDrawingControls()} */}
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