import CircularProgress from "@material-ui/core/CircularProgress"
import Typography from "@material-ui/core/Typography"
import { styled } from "@material-ui/styles"
import React, { Component } from "react"
import { LoadingManager } from "three"

import { GameBuilderOptions } from "../../builders/GameBuilder"
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
    if (this.state.gameManager) {
      this.state.gameManager.destruct()
    }
  }

  handleProgress = (item: any, loaded: number, total: number) => {
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
          <CircularProgress />
          <Type variant="caption">{`Importing assets: ${percentLoaded}%`}</Type>
        </LoadingContainer>
      )
    }
    return children
  }
}

const LoadingContainer = styled("div")({
  width: "100%",
  position: "relative",
  textAlign: "center",
})
const Type = styled(Typography)({
  paddingTop: 16,
})

export default GameManagerLoader
