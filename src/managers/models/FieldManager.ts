import { Camera, Object3D } from "three"

class FieldManager {
  readonly field: Object3D
  readonly cameras: Camera[]

  constructor(field: Object3D, cameras: Camera[]) {
    this.field = field
    this.cameras = cameras
  }

  getCamera(cameraName: string) {
    return this.cameras.find(camera => camera.name === cameraName)
  }
}

export default FieldManager
