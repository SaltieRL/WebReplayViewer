import MUISlider from "@material-ui/lab/Slider"

import React, { Component } from "react"
import DataManager from "../../managers/DataManager"

interface Props {}

interface State {
  frame: number
  maxFrame: number
}

class Slider extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      frame: 0,
      maxFrame: DataManager.getInstance().data.frames.length - 1,
    }
  }

  handleChange = (_: any, value: number) => {
    console.log(value)
  }

  render() {
    const { frame, maxFrame } = this.state

    return (
      <div>
        <MUISlider
          value={frame}
          aria-labelledby="label"
          onChange={this.handleChange}
          min={0}
          max={maxFrame}
        />
      </div>
    )
  }
}

export default Slider
