const getName = (objectName: string, suffix: string) => {
  return `${objectName}${suffix}`
}

export const getActionClipName = (objectName: string) => {
  return getName(objectName, "AnimationClip")
}

export const getPositionName = (objectName: string) => {
  return getName(objectName, ".position")
}

export const getRotationName = (objectName: string) => {
  return getName(objectName, ".quaternion")
}
