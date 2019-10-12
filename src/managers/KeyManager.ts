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
  private keysPressed: number[]
  private interval?: number
  private lastKeyPress: number

  private constructor() {
    this.listening = false
    this.keysPressed = []
    this.lastKeyPress = 0

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
      document.addEventListener("keyup", this.onKeyUpEvent)
      document.addEventListener("keydown", this.onKeyDownEvent)
      // If we don't remove these keys on blur/focus, they get "stuck" when refocusing the document
      document.addEventListener("focus", this.resetKeyCodes)
      document.addEventListener("blur", this.resetKeyCodes)
      this.interval = setInterval(this.sendDispatch, 1000 / 30) as any
    } else {
      document.removeEventListener("keyup", this.onKeyUpEvent)
      document.removeEventListener("keydown", this.onKeyDownEvent)
      document.removeEventListener("focus", this.resetKeyCodes)
      document.removeEventListener("blur", this.resetKeyCodes)
      if (this.interval) {
        clearInterval(this.interval)
      }
    }

    return this.listening
  }

  private readonly onKeyUpEvent = ({ keyCode }: KeyboardEvent) => {
    this.keysPressed = this.keysPressed.filter(code => keyCode !== code)
  }

  private readonly onKeyDownEvent = ({ keyCode }: KeyboardEvent) => {
    // Kill listeners on escape key
    if (keyCode === 27 && this.listening) {
      this.toggleKeyListener()
    }

    this.lastKeyPress = performance.now()

    if (!this.keysPressed.includes(keyCode)) {
      this.keysPressed.push(keyCode)
    }
  }

  private readonly resetKeyCodes = () => {
    this.keysPressed = []
  }

  private readonly sendDispatch = () => {
    // The last key press was detected 2000ms ago, shut off dispatch
    // TODO: This will shut off dispatches if you press a new key and then release the new key
    // without keyup on the first. Should fix for edge case.
    if (performance.now() - this.lastKeyPress > 2000) {
      this.keysPressed = []
      return
    }

    if (this.keysPressed.length) {
      const directions: KeyControlEvent["directions"] = []
      let speed = true
      this.keysPressed.forEach(keyCode => {
        switch (keyCode) {
          case 70: // F
            speed = false
            break
          case 37: // Left arrow
          case 65: // A
            directions.push("left")
            break
          case 38: // Up arrow
          case 87: // W
            directions.push("forward")
            break
          case 39: // Right arrow
          case 68: // D
            directions.push("right")
            break
          case 40: // Down arrow
          case 83: // S
            directions.push("backward")
            break
          case 32: // Space
            directions.push("up")
            break
          case 16: // Shift
            // speed = true
            directions.push("down")
            break
        }
      })
      dispatchKeyControlEvent({
        directions,
        speed,
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
