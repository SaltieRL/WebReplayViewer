import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import { styled } from "@material-ui/styles"
import React, { PureComponent } from "react"

import CameraManager from "../../managers/CameraManager"
import PlayerManager from "../../managers/models/PlayerManager"
import SceneManager from "../../managers/SceneManager"

1
interface Props {}

class PlayerControls extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
  }

  onPlayerClick = (playerName: string) => {
    return () => CameraManager.getInstance().setCameraLocation({ playerName })
  }

  renderPlayerButtons() {
    const { players } = SceneManager.getInstance()
    const renderTeam = (players: PlayerManager[]) =>
      players.map(({ playerName }) => {
        return (
          <PlayerButton
            key={playerName}
            variant="outlined"
            onClick={this.onPlayerClick(playerName)}
          >
            {playerName}
          </PlayerButton>
        )
      })
    return (
      <Grid container spacing={24} justify="space-between">
        <Grid item>
          {renderTeam(players.filter(player => player.isOrangeTeam))}
        </Grid>
        <Grid item>
          {renderTeam(players.filter(player => !player.isOrangeTeam))}
        </Grid>
      </Grid>
    )
  }

  render() {
    return <div>{this.renderPlayerButtons()}</div>
  }
}

const PlayerButton = styled(Button)({
  margin: 6,
})

export default PlayerControls
