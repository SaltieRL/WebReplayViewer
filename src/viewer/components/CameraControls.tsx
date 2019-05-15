import React, { PureComponent } from "react"

import CameraManager from "../../managers/CameraManager"
import SceneManager from "../../managers/SceneManager"

interface Props {}

export default class PlayerControls extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
    this.onPlayerClick = this.onPlayerClick.bind(this)
  }

  onPlayerClick(playerName: string) {
    return () => CameraManager.getInstance().setCameraLocation({ playerName })
  }

  render() {
    return (
      <div>
        {SceneManager.getInstance().players.map(player => {
          const name = player.playerName
          return (
            <button key={name} onClick={this.onPlayerClick(name)}>
              {name}
            </button>
          )
        })}
      </div>
    )
  }
}
