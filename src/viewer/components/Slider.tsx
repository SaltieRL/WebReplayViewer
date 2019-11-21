import MUISlider, { SliderProps } from "@material-ui/core/Slider"
import debounce from "lodash.debounce"
import React, { Component } from "react"

import {
  addFrameListener,
  FrameEvent,
  removeFrameListener,
} from "../../eventbus/events/frame"
import DataManager from "../../managers/DataManager"
import { GameManager } from "../../managers/GameManager"

interface Props extends Partial<SliderProps> {}

interface State {
  frame: number
  maxFrame: number
}

const SLIDER_OUTLINE_RADIUS = 24

class Slider extends Component<Props, State> {
  onFrame = debounce(
    ({ frame }: FrameEvent) => {
      this.setState({ frame })
    },
    250,
    { maxWait: 250 }
  )

  constructor(props: Props) {
    super(props)
    this.state = {
      frame: 0,
      maxFrame: DataManager.getInstance().data.frames.length - 1,
    }
    addFrameListener(this.onFrame)
  }

  componentWillUnmount() {
    removeFrameListener(this.onFrame)
    this.onFrame.cancel()
  }

  handleChange = (_: any, value: number | number[]) => {
    const frame = Math.round(value as number)
    GameManager.getInstance().clock.setFrame(frame)
  }

  render() {
    const { frame, maxFrame } = this.state

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 12,
          marginLeft: -SLIDER_OUTLINE_RADIUS / 2,
          marginRight: -SLIDER_OUTLINE_RADIUS / 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            height: SLIDER_OUTLINE_RADIUS * 2,
            width: "calc(100% - 12px)",
            paddingLeft: SLIDER_OUTLINE_RADIUS,
            paddingRight: SLIDER_OUTLINE_RADIUS,
          }}
        >
          <MUISlider
            {...this.props}
            value={frame}
            aria-labelledby="label"
            onChange={this.handleChange}
            min={0}
            max={maxFrame}
          />
        </div>
      </div>
    )
  }
}

export default Slider
