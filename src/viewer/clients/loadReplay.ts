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

const cache: { [key: string]: [ReplayData, ReplayMetadata] } = {}

export const loadReplay = async (
  replayId: string,
  cached?: boolean
): Promise<[ReplayData, ReplayMetadata]> => {
  const fetch = () =>
    Promise.all([
      fetchByURL(`https://calculated.gg/api/replay/${replayId}/positions`),
      fetchByURL(`https://calculated.gg/api/v1/replay/${replayId}?key=1`),
    ])
  if (cached) {
    if (!cache[replayId]) {
      return fetch().then(data => {
        cache[replayId] = data
        return data
      })
    }
    return Promise.resolve(cache[replayId])
  }
  return fetch()
}
