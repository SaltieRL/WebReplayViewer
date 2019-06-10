import MUISlider from "@material-ui/lab/Slider"
import debounce from "lodash.debounce"
import React, { Component } from "react"

import DataManager from "../../managers/DataManager"
import { GameManager } from "../../managers/GameManager"
import { FPSClockSubscriberOptions } from "../../utils/FPSClock"

interface Props {}

interface State {
  frame: number
  maxFrame: number
}

const SLIDER_OUTLINE_RADIUS = 24

class Slider extends Component<Props, State> {
  onFrame = debounce(
    ({ frame }: FPSClockSubscriberOptions) => {
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
    GameManager.getInstance().clock.subscribe(this.onFrame)
  }

  componentWillUnmount() {
    GameManager.getInstance().clock.unsubscribe(this.onFrame)
    this.onFrame.cancel()
  }

  handleChange = (_: any, value: number) => {
    const frame = Math.round(value)
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
