import Button from "@material-ui/core/Button"
import { styled } from "@material-ui/styles"
import React, { PureComponent } from "react"

import CameraManager, {
  CameraLocationOptions,
} from "../../managers/CameraManager"

const options: CameraLocationOptions["fieldLocation"][] = [
  "blue",
  "orange",
  "center",
  "orthographic",
]
const optionNames = {
  blue: "Blue Goal",
  orange: "Orange Goal",
  center: "Above Field",
  orthographic: "Orthographic",
}

interface Props {}

class FieldCameraControls extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
  }

  onFieldClick = (fieldLocation: CameraLocationOptions["fieldLocation"]) => {
    return () =>
      CameraManager.getInstance().setCameraLocation({ fieldLocation })
  }

  renderFieldButtons() {
    return options.map(option => {
      return (
        <FieldButton
          key={option}
          variant="outlined"
          onClick={this.onFieldClick(option)}
        >
          {optionNames[option || "center"]}
        </FieldButton>
      )
    })
  }

  render() {
    return <div>{this.renderFieldButtons()}</div>
  }
}

const FieldButton = styled(Button)({
  margin: 6,
})

export default FieldCameraControls
