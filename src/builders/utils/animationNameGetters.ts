import PlayerModel from "../../loaders/glb-models/PlayerModel"

const getName = (objectName: string, suffix: string, isCar: boolean) => {
  return `${objectName}${isCar ? PlayerModel.CAR_SUFFIX : ""}${suffix}`
}

export const getActionClipName = (objectName: string, isCar: boolean) => {
  return getName(objectName, "Action", isCar)
}

export const getPositionName = (objectName: string, isCar: boolean) => {
  return getName(objectName, ".position", isCar)
}

export const getRotationName = (objectName: string, isCar: boolean) => {
  return getName(objectName, ".quaternion", isCar)
}
