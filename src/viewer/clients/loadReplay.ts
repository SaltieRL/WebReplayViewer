import { ReplayData } from "../../models/ReplayData"
import { ReplayMetadata } from "../../models/ReplayMetadata"

const fetchByURL = (url: string, local?: boolean) =>
  fetch(
    url,
    local
      ? {}
      : {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
  ).then((response) => response.json())

const cache: { [key: string]: [ReplayData, ReplayMetadata] } = {}

export const loadReplay = async (
  replayId: string,
  cached?: boolean,
  local?: boolean,
  usecgg = true
): Promise<[ReplayData, ReplayMetadata]> => {
  let remoteAddress
  if (usecgg) {
    remoteAddress = "https://calculated.gg/api"
  } else {
    remoteAddress = location.protocol + "//" + location.host
  }

  const url = local ? "../examples/" : remoteAddress + "/replay/"
  const fetch = () =>
    Promise.all([
      fetchByURL(`${url + replayId}/positions${local ? ".json" : ""}`, local),
      fetchByURL(
        `${url + replayId}${local ? "/metadata.json" : "?key=1"}`,
        local
      ),
    ])
  if (cached) {
    if (!cache[replayId]) {
      return fetch().then((data) => {
        cache[replayId] = data
        return data
      })
    }
    return Promise.resolve(cache[replayId])
  }
  return fetch()
}
