import { CAR_SUFFIX, GROUP_SUFFIX } from "../../constants/gameObjectNames"

export const getCarName = (playerName: string) => {
  return `${playerName}${CAR_SUFFIX}`
}

export const getGroupName = (playerName: string) => {
  return `${playerName}${GROUP_SUFFIX}`
}
