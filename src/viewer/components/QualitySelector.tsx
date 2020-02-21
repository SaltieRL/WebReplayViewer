import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Typography from "@material-ui/core/Typography"
import React, { useEffect, useState } from "react"
import styled from "styled-components"

import { dispatchPlayPauseEvent } from "../../eventbus/events/playPause"
import QualityManager, { QualityOptions } from "../../managers/QualityManager"
import QualityIcon from "./icons/QualityIcon"

interface Props {
  qualityManager: QualityManager
}

const qualityOptions = [
  { option: QualityOptions.HIGH, text: "High" },
  { option: QualityOptions.MEDIUM, text: "Medium" },
  { option: QualityOptions.LOW, text: "Low" },
]

const QualitySelector = ({ qualityManager }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [qualitySetting, setQualitySetting] = useState(
    qualityManager.getQuality()
  )
  useEffect(() => {
    qualityManager.setQuality(qualitySetting)
    if (dialogOpen) {
      setDialogOpen(false)
      dispatchPlayPauseEvent({
        paused: true,
      })
      location.reload()
    }
  }, [qualitySetting])
  
  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>
        <QualityIcon />
      </Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <List>
          {qualityOptions.map(({ option, text }) => (
            <StyledListItem
              key={option}
              button
              selected={qualitySetting === option}
              onClick={() => setQualitySetting(option)}
            >
              <Typography>{text}</Typography>
            </StyledListItem>
          ))}
        </List>
      </Dialog>
    </>
  )
}

const StyledListItem = styled(ListItem)`
  cursor: pointer;
`

export default QualitySelector
