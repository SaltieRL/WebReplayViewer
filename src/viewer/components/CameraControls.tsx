import React, { PureComponent } from "react"
import { GameManager } from "../../managers/GameManager"

interface Props {
  gameManager: GameManager
}

export default class PlayerControls extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
    this.onPlayerClick = this.onPlayerClick.bind(this)
  }

  onPlayerClick(playerName: string) {
    return () =>
      this.props.gameManager.sceneManager.setCameraLocation({ playerName })
  }

  render() {
    const { gameManager } = this.props
    return (
      <div>
        {gameManager.getPlayers().map(player => {
          const name = player.getName()
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
