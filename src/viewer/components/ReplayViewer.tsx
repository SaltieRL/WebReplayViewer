import React, { PureComponent } from "react"
import ModelLoader from "../../loaders/ModelLoader"

interface Props {}

class ReplayViewer extends PureComponent<Props> {
  render() {
    ModelLoader.loadObject("./Ball.glb").then(console.log)
    return <div>Hello There Obi Wan</div>
  }
}

export default ReplayViewer
