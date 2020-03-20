import CircularProgress from "@material-ui/core/CircularProgress"
import Typography, { TypographyProps } from "@material-ui/core/Typography"
import React, { Component } from "react"
import styled from "styled-components"
import { LoadingManager } from "three/src/loaders/LoadingManager"

import { GameBuilderOptions } from "../../builders/GameBuilder"
import { GameManager } from "../../managers/GameManager"
import ErrorIcon from "./icons/ErrorIcon"

interface Props {
  options: GameBuilderOptions
  onLoad: (manager: GameManager) => void
}

interface State {
  loadingManager: LoadingManager
  percentLoaded: number
  gameManager?: GameManager
  error?: string
}

class GameManagerLoader extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      percentLoaded: 0,
      loadingManager: props.options.loadingManager || new LoadingManager(),
    }
    this.state.loadingManager.onProgress = this.handleProgress
    if (!this.state.loadingManager.onError) {
      this.state.loadingManager.onError = this.handleError
    }
  }

  componentDidMount() {
    GameManager.builder({
      ...this.props.options,
      loadingManager: this.state.loadingManager,
    }).then(gameManager => {
      this.props.onLoad(gameManager)
      this.setState({
        gameManager,
      })
    })
  }

  componentWillUnmount() {
    GameManager.destruct()
  }

  handleProgress = (_: any, loaded: number, total: number) => {
    const newPercent = Math.round((loaded / total) * 1000) / 10
    const { percentLoaded } = this.state
    const stateValue = newPercent > percentLoaded ? newPercent : percentLoaded
    this.setState({
      percentLoaded: stateValue,
    })
  }

  handleError = (message: string) => {
    this.setState({
      error: `An error occurred while loading: ${message}`,
    })
  }

  render() {
    const { children } = this.props
    const { gameManager } = this.state
    if (!gameManager) {
      return (
        <LoadingContainer>
          <CircularProgressContainer>
            {this.renderIcon()}
          </CircularProgressContainer>
          <Type variant="caption">{this.getHintText()}</Type>
        </LoadingContainer>
      )
    }
    return children
  }

  private renderIcon(): JSX.Element {
    const { error, percentLoaded } = this.state
    if (error) {
      return <ErrorIcon />
    }
    const variant = percentLoaded === 100 ? "indeterminate" : "static"
    return <CircularProgress variant={variant} value={percentLoaded} />
  }

  private getHintText(): string {
    const { percentLoaded, error } = this.state
    if (error) {
      return error
    } else if (percentLoaded === 100) {
      return "Building scene..."
    } else {
      return `Importing assets: ${percentLoaded}%`
    }
  }
}

const LoadingContainer = styled.div`
  width: 100%;
  position: relative;
  text-align: center;
`
const CircularProgressContainer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Type = styled(Typography)`
  width: 100%;
  padding-top: 16px;
` as React.ComponentType<TypographyProps>

export default GameManagerLoader
