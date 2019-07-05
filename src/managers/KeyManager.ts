import { FREE_CAMERA } from "../constants/gameObjectNames"
import {
  addCameraChangeListener,
  CameraChangeEvent,
  removeCameraChangeListener,
} from "../eventbus/events/cameraChange"
import {
  dispatchKeyControlEvent,
  KeyControlEvent,
} from "../eventbus/events/keyControl"

class KeyManager {
  private listening: boolean

  private constructor() {
    this.listening = false

    addCameraChangeListener(this.onCameraChange)
  }

  onCameraChange = ({ camera }: CameraChangeEvent) => {
    const isFreeCam = camera.name === FREE_CAMERA
    if (isFreeCam !== this.listening) {
      this.toggleKeyListener()
    }
  }

  toggleKeyListener() {
    this.listening = !this.listening
    if (this.listening) {
      document.addEventListener("keydown", this.onKeyEvent)
    } else {
      document.removeEventListener("keydown", this.onKeyEvent)
    }

    return this.listening
  }

  onKeyEvent = ({ key, shiftKey, ctrlKey }: KeyboardEvent) => {
    let direction: KeyControlEvent["direction"] | undefined
    switch (key.toLowerCase()) {
      case "a":
      case "arrowleft":
        direction = "left"
        break
      case "s":
      case "arrowdown":
        direction = "backward"
        break
      case "w":
      case "arrowup":
        direction = "forward"
        break
      case "d":
      case "arrowright":
        direction = "right"
        break
      case " ":
        direction = "up"
        break
      case "escape":
        if (this.listening) {
          this.toggleKeyListener()
        }
        break
      default:
        if (ctrlKey) {
          direction = "down"
        }
    }
    if (direction) {
      dispatchKeyControlEvent({
        direction,
        speed: shiftKey,
      })
    }
  }

  /**
   * ========================================
   * Managers are singletons
   * ========================================
   */
  private static instance?: KeyManager
  static getInstance() {
    if (!KeyManager.instance) {
      throw new Error("KeyManager not initialized with call to `init`")
    }
    return KeyManager.instance
  }
  static init() {
    KeyManager.instance = new KeyManager()
    return KeyManager.instance
  }
  static destruct() {
    const { instance } = KeyManager
    if (instance) {
      removeCameraChangeListener(instance.onCameraChange)
      KeyManager.instance = undefined
    }
  }
}

export default KeyManager
