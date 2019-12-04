import Button, { ButtonProps } from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Typography from "@material-ui/core/Typography"
import React, { PureComponent } from "react"
import styled from "styled-components"

import CameraManager, {
  CameraLocationOptions,
} from "../../managers/CameraManager"

const options: CameraLocationOptions["fieldLocation"][] = [
  "blue",
  "orange",
  "center",
  "freecam",
]
const optionNames = {
  blue: "Blue Goal",
  orange: "Orange Goal",
  center: "Above Field",
  freecam: "Free Cam",
}
const orthographicOptions: CameraLocationOptions["fieldLocation"][] = [
  "orthographic-above-field",
  "orthographic-blue-left",
  "orthographic-blue-right",
  "orthographic-orange-left",
  "orthographic-orange-right",
]
const orthographicOptionNames = {
  ["orthographic-above-field"]: "Above Field",
  ["orthographic-blue-left"]: "Blue Left",
  ["orthographic-blue-right"]: "Blue Right",
  ["orthographic-orange-left"]: "Orange Left",
  ["orthographic-orange-right"]: "Orange Right",
}

interface Props {}

interface State {
  dialogOpen: boolean
}

class FieldCameraControls extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      dialogOpen: false,
    }
  }

  toggleDialog = () => {
    const dialogOpen = !this.state.dialogOpen
    this.setState({
      dialogOpen,
    })
  }

  onFieldClick = (fieldLocation: CameraLocationOptions["fieldLocation"]) => {
    return () => {
      if (this.state.dialogOpen) {
        this.setState({
          dialogOpen: false,
        })
      }
      CameraManager.getInstance().setCameraLocation({ fieldLocation })
    }
  }

  renderFieldButtons() {
    return options.map(option => {
      return (
        <FieldButton
          key={option}
          variant="outlined"
          onClick={this.onFieldClick(option)}
        >
          {(optionNames as any)[option || "center"]}
        </FieldButton>
      )
    })
  }

  renderOrthographicOptions() {
    return (
      <Dialog open={this.state.dialogOpen} onClose={this.toggleDialog}>
        <List>
          {orthographicOptions.map(option => {
            return (
              <ListItem
                key={option}
                onClick={this.onFieldClick(option)}
                style={{ cursor: "pointer" }}
              >
                <Typography>
                  {
                    (orthographicOptionNames as any)[
                      option || "orthographic-orange-right"
                    ]
                  }
                </Typography>
              </ListItem>
            )
          })}
        </List>
      </Dialog>
    )
  }

  render() {
    return (
      <div>
        {this.renderFieldButtons()}
        <FieldButton onClick={this.toggleDialog} variant="outlined">
          Orthographic
        </FieldButton>
        {this.renderOrthographicOptions()}
      </div>
    )
  }
}

const FieldButton = styled(Button)`
  && {
    margin: 6px;
  }
` as React.ComponentType<ButtonProps>

export default FieldCameraControls
