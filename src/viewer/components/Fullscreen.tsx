import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import React, { PropsWithChildren } from "react"
import { FullScreen as FS, useFullScreenHandle } from "react-full-screen"
import styled from "styled-components"

import FullscreenExitIcon from "./icons/FullscreenExitIcon"
import FullscreenIcon from "./icons/FullscreenIcon"

type Props = PropsWithChildren<unknown>

const Fullscreen = ({ children }: Props) => {
  const handle = useFullScreenHandle()
  return (
    <FullscreenWrapper handle={handle}>
      <FullscreenToggle>
        <Button onClick={handle.active ? handle.exit : handle.enter}>
          <Typography style={{ color: "#fff" }} component="div">
            {handle.active ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </Typography>
        </Button>
      </FullscreenToggle>
      {children}
    </FullscreenWrapper>
  )
}

const FullscreenToggle = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`
const FullscreenWrapper = styled(FS)`
  width: 100%;
  height: 100%;
  position: relative;
`

export default Fullscreen
