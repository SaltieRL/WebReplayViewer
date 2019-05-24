import { Group, Object3D } from "three"

export const positionWheels = (wheelObject: Object3D) => {
  const LEFT_DISTANCE = 55
  const FORWARD_DISTANCE = 80
  const VERTICAL_DISTANCE = 0
  const wheelGroup = new Group()
  const frontLeft = wheelObject.clone()
  frontLeft.name = "Front Left"
  frontLeft.position.set(FORWARD_DISTANCE, VERTICAL_DISTANCE, -LEFT_DISTANCE)
  const frontRight = wheelObject.clone()
  frontRight.name = "Front Right"
  frontRight.position.set(FORWARD_DISTANCE, VERTICAL_DISTANCE, LEFT_DISTANCE)
  frontRight.scale.z = -1
  const backLeft = wheelObject.clone()
  backLeft.name = "Back Left"
  backLeft.position.set(-FORWARD_DISTANCE, VERTICAL_DISTANCE, -LEFT_DISTANCE)
  const backRight = wheelObject.clone()
  backRight.name = "Back Right"
  backRight.position.set(-FORWARD_DISTANCE, VERTICAL_DISTANCE, LEFT_DISTANCE)
  backRight.scale.z = -1

  wheelGroup.add(frontLeft, frontRight, backLeft, backRight)
  return wheelGroup
}
