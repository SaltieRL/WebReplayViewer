import { Camera, OrthographicCamera } from "three"

export const isOrthographicCamera = (camera: Camera) =>
  !!(camera as OrthographicCamera).isOrthographicCamera
