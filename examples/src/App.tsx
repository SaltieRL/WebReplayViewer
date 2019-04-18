import React from "react"
console.log("fukt")
import { ReplayViewer } from "replay-viewer"
console.log(ReplayViewer)

function App() {
  return (
    <div>
      <div>
        <h2>Welcome to React</h2>
      </div>
      <p>
        To get started, edit <code>app/App.tsx</code> and save to reload.
      </p>
      <ReplayViewer />
    </div>
  )
}

export default App
