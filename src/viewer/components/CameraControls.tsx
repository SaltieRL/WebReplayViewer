import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import React, { PureComponent } from "react"

import CameraManager from "../../managers/CameraManager"
import SceneManager from "../../managers/SceneManager"
import PlayerManager from "../../managers/models/PlayerManager"

interface Props extends WithStyles {}

class PlayerControls extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
  }

  onPlayerClick = (playerName: string) => {
    return () => CameraManager.getInstance().setCameraLocation({ playerName })
  }

  renderPlayerButtons() {
    const { playerButton } = this.props.classes
    const { players } = SceneManager.getInstance()
    const renderTeam = (players: PlayerManager[]) =>
      players.map(({ playerName }) => {
        return (
          <Button
            key={playerName}
            className={playerButton}
            variant="outlined"
            onClick={this.onPlayerClick(playerName)}
          >
            {playerName}
          </Button>
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

export default withStyles({
  playerButton: {
    margin: 6,
  },
})(PlayerControls)
