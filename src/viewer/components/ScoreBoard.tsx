import React, { PureComponent } from "react"
import { styled } from "@material-ui/styles"

import DataManager from "../../managers/DataManager"
import { GameManager } from "../../managers/GameManager"
import { Goal } from "../../models/ReplayMetadata"
import { getGameTime } from "../../operators/frameGetters"
import { getPlayerById } from "../../operators/metadataGetters"
import { FPSClockSubscriberOptions } from "../../utils/FPSClock"

interface Props {}
interface State {
  team0Score: number
  team1Score: number
  gameTime: number
}

export default class Scoreboard extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      team0Score: 0,
      team1Score: 0,
      gameTime: 300,
    }

    this.onFrame = this.onFrame.bind(this)
    GameManager.getInstance().clock.subscribe(this.onFrame)
  }

  onFrame({ frame }: FPSClockSubscriberOptions) {
    const { data } = DataManager.getInstance()
    const gameTime = getGameTime(data, frame)
    if (gameTime !== this.state.gameTime) {
      this.setState({ gameTime })
    }
    this.updateGameScore(frame)
  }

  getDateTimeString() {
    const { gameTime } = this.state

    const seconds = gameTime % 60
    const minutes = (gameTime - seconds) / 60
    const secondsString = seconds < 10 ? `0${seconds}` : seconds
    return `${minutes}:${secondsString}`
  }

  render() {
    const { team0Score, team1Score } = this.state
    return (
      <ScoreContainer>
        <BlueScoreCard>
          <Score>{team0Score}</Score>
        </BlueScoreCard>
        <GameTimeCard>
          <GameTime>{this.getDateTimeString()}</GameTime>
        </GameTimeCard>
        <OrangeScoreCard>
          <Score>{team1Score}</Score>
        </OrangeScoreCard>
      </ScoreContainer>
    )
  }

  private updateGameScore(frameNumber: number) {
    const { metadata } = DataManager.getInstance()

    let team0Score = 0
    let team1Score = 0
    metadata.gameMetadata.goals.forEach((goal: Goal) => {
      if (goal.frameNumber <= frameNumber) {
        const player = getPlayerById(metadata, goal.playerId.id)
        if (player) {
          if (player.isOrange) {
            team1Score++
          } else {
            team0Score++
          }
        }
      }
    })
    if (
      team0Score !== this.state.team0Score ||
      team1Score !== this.state.team1Score
    ) {
      this.setState({ team0Score, team1Score })
    }
  }
}

const ScoreContainer = styled("div")({
  display: "flex",
  alignItems: "stretch",
  top: 0,
  position: "absolute",
  zIndex: 10,
  left: "50%",
  textAlign: "center",
  transform: "translateX(-50%)",
  width: 400,
  borderStyle: "solid",
  borderWidth: 3,
  borderColor: "#fffa",
  borderBottomRightRadius: 10,
  borderBottomLeftRadius: 10,
})

const OrangeScoreCard = styled("div")({
  backgroundColor: "#e27740aa",
  borderBottomRightRadius: 5,
  flex: 1,
})

const BlueScoreCard = styled("div")({
  backgroundColor: "#4874efaa",
  borderBottomRightRadius: 5,
  flex: 1,
})

const Score = styled("div")({
  color: "#fff",
  fontFamily: "monospace",
  fontSize: "xx-large",
})

const GameTimeCard = styled("div")({
  backgroundColor: "#000a",
})

const GameTime = styled("div")({
  color: "#fff",
  fontFamily: "monospace",
  fontSize: "xx-large",
  width: 100,
})
