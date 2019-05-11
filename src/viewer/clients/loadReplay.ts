import { ReplayData } from "../../models/ReplayData"
import { ReplayMetadata } from "../../models/ReplayMetadata"

const fetchByURL = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => response.json())

export const loadReplay = (
  replayId: string
): Promise<[ReplayData, ReplayMetadata]> => {
  return Promise.all([
    fetchByURL(`https://calculated.gg/api/replay/${replayId}/positions`),
    fetchByURL(`https://calculated.gg/api/v1/replay/${replayId}?key=1`),
  ])
}
