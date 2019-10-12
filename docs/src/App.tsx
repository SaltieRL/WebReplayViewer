import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import React, { Component } from "react"

import Main from "./components/Main"

type ActiveTab = "viewer" | "compact" | "other"

interface State {
  tab: ActiveTab
}

class App extends Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      tab: "viewer",
    }
  }

  handleChange = (_: any, newTab: ActiveTab) => {
    this.setState({
      tab: newTab,
    })
  }

  render() {
    const { tab } = this.state
    return (
      <div style={{ maxWidth: 900, width: "100%", margin: "0 auto" }}>
        <div>
          <h2>Welcome to Replay Viewer</h2>
        </div>
        <Tabs value={tab} onChange={this.handleChange}>
          <Tab label="Viewer" value="viewer" />
          <Tab label="Compact" value="compact" />
          <Tab label="Other" value="other" />
        </Tabs>
        {tab === "viewer" && <Main />}
        {tab === "compact" && <Main compact />}
        {tab === "other" && <div>Other</div>}
      </div>
    )
  }
}

export default App
