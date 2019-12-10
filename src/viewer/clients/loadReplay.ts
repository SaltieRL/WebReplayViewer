import { ReplayData } from "../../models/ReplayData"
import { ReplayMetadata } from "../../models/ReplayMetadata"

const fetchByURL = (url: string, local?: boolean) =>
  fetch(url, local ? {} : {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => response.json())

const cache: { [key: string]: [ReplayData, ReplayMetadata] } = {}

export const loadReplay = async (
  replayId: string,
  cached?: boolean,
  local?: boolean
): Promise<[ReplayData, ReplayMetadata]> => {
  const url = local ? "../examples/" : "https://calculated.gg/api/replay/"
  const fetch = () =>
    Promise.all([
      fetchByURL(`${url+replayId}/positions${local && '.json'}`, local),
      fetchByURL(`${url+replayId}${local ? "/metadata.json" : "?key=1"}`, local),
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
