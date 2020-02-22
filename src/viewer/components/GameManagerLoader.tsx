import CircularProgress from "@material-ui/core/CircularProgress"
import Typography, { TypographyProps } from "@material-ui/core/Typography"
import React, { Component } from "react"
import styled from "styled-components"
import { LoadingManager } from "three/src/loaders/LoadingManager"

import { GameBuilderOptions } from "../../builders/GameBuilder"
import {
  addRestartListener,
  removeRestartListener,
} from "../../eventbus/events/restart"
import { GameManager } from "../../managers/GameManager"

interface Props {
  options: GameBuilderOptions
  onLoad: (manager: GameManager) => void
}

interface State {
  loadingManager: LoadingManager
  percentLoaded: number
  gameManager?: GameManager
}

class GameManagerLoader extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      percentLoaded: 0,
      loadingManager: props.options.loadingManager || new LoadingManager(),
    }
    this.state.loadingManager.onProgress = this.handleProgress
    this.load = this.load.bind(this)
    this.restart = this.restart.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  componentWillUnmount() {
    GameManager.destruct()
    removeRestartListener(this.restart)
  }

  handleProgress = (_: any, loaded: number, total: number) => {
    const newPercent = Math.round((loaded / total) * 1000) / 10
    const { percentLoaded } = this.state
    const stateValue = newPercent > percentLoaded ? newPercent : percentLoaded
    this.setState({
      percentLoaded: stateValue,
    })
  }

  render() {
    const { children } = this.props
    const { gameManager, percentLoaded } = this.state
    if (!gameManager) {
      return (
        <LoadingContainer>
          <CircularProgressContainer>
            <CircularProgress />
          </CircularProgressContainer>
          <Type variant="caption">{`Importing assets: ${percentLoaded}%`}</Type>
        </LoadingContainer>
      )
    }
    return children
  }

  private restart() {
    removeRestartListener(this.restart)
    GameManager.destruct()
    this.setState({ gameManager: undefined }, this.load)
  }

  private load() {
    GameManager.builder({
      ...this.props.options,
      loadingManager: this.state.loadingManager,
    }).then(gameManager => {
      this.props.onLoad(gameManager)
      this.setState({
        gameManager,
      })
      addRestartListener(this.restart)
    })
  }
}

const LoadingContainer = styled.div`
  width: 100%;
  position: relative;
  text-align: center;
`
const CircularProgressContainer = styled.div`
  width: 100%;
`
const Type = styled(Typography)`
  width: 100%;
  padding-top: 16px;
` as React.ComponentType<TypographyProps>

export default GameManagerLoader
