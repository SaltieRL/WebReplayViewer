import { CAR_SUFFIX, GROUP_SUFFIX } from "../../constants/gameObjectNames"
import { hashCode } from "../../utils/hashCode"

export const getCarName = (playerName: string) => {
  return `${hashCode(playerName)}${CAR_SUFFIX}`
}

export const getGroupName = (playerName: string) => {
  return `${hashCode(playerName)}${GROUP_SUFFIX}`
}
