import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import React, { useEffect, useRef } from "react"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import styled from "styled-components"

import { dispatchCanvasResizeEvent } from "../../eventbus/events/canvasResize"
import { dispatchPlayPauseEvent } from "../../eventbus/events/playPause"
import { GameManager } from "../../managers/GameManager"
import FullscreenExitIcon from "./icons/FullscreenExitIcon"
import FullscreenIcon from "./icons/FullscreenIcon"
import Scoreboard from "./ScoreBoard"

interface Props {
  gameManager: GameManager;
  autoplay?: boolean;
  children?: React.ReactNode;
}

const ReplayViewer = (props: Props): JSX.Element => {
  const mount = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!mount.current) {
      throw new Error("Did not mount replay viewer correctly")
    }
    const { gameManager, autoplay } = props
    // Mount and resize canvas
    mount.current.appendChild(gameManager.getDOMNode())
    handleResize()

    // Set the play/pause status to match autoplay property
    dispatchPlayPauseEvent({ paused: !autoplay })

    addEventListener("resize", handleResize)
  }, [])

  const handleResize = () => {
    const { clientWidth: width, clientHeight: height } = mount.current!
    dispatchCanvasResizeEvent({ width, height })
  }

  const handle = useFullScreenHandle()
  return (
    <ViewerContainer>
      <FullScreen
        handle={handle}
      >
        <div style={{ width: "100%", height: "100%" }} ref={mount} />
        <Scoreboard />
        <FullscreenToggle>
          <Button onClick={handle.enter}>
            <Typography style={{ color: "#fff" }}>
              {handle.active ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </Typography>
          </Button>
        </FullscreenToggle>
        {props.children}
      </FullScreen>
    </ViewerContainer>
  )
}

const ViewerContainer = styled.div`
  width: 100%;
  height: 480px;
  position: relative;
  .fullscreen {
    width: 100%;
    height: 100%;
  }
`

const FullscreenToggle = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`

export default ReplayViewer
