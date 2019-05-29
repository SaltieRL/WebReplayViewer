import { Camera, Group } from "three"

class FieldManager {
  readonly field: Group
  readonly cameras: Camera[]

  constructor(field: Group, cameras: Camera[]) {
    this.field = field
    this.cameras = cameras
  }

  getCamera(cameraName: string) {
    return this.cameras.find(camera => camera.name === cameraName)
  }
}

export default FieldManager
