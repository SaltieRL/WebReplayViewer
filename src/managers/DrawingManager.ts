import { Group, Camera, Raycaster, SphereBufferGeometry, MeshBasicMaterial, Mesh, Vector3, BufferGeometry, LineBasicMaterial, Line, BufferAttribute } from "three"

import {
  addCameraChangeListener,
  CameraChangeEvent,
  removeCameraChangeListener,
} from "../eventbus/events/cameraChange"
import {
  FrameEvent
} from "../eventbus/events/frame"
import {
  addCanvasResizeListener,
  CanvasResizeEvent,
  removeCanvasResizeListener,
} from "../eventbus/events/canvasResize"
import {
  addPlayPauseListener,
  PlayPauseEvent,
  removePlayPauseListener,
} from "../eventbus/events/playPause"
import SceneManager from "./SceneManager"
import CameraManager from "./CameraManager"
import { GameManager } from "./GameManager"

export default class DrawingManager {
  private isDrawing: boolean
  private paused: boolean
  private field: Group
  private activeCamera: Camera
  private sphere: Mesh = new Mesh
  private canvas: HTMLCanvasElement | undefined
  private canvasWidth: number
  private canvasHeight: number
  private lastFrameEvent: FrameEvent
  private cloneArray: Array<string>
  private currentLineClone: Line | undefined
  private lineClonePointIndex: number
  private linePointPositions: Float32Array
  private MAX_POINTS: number

  private constructor() {
    this.isDrawing = false
    this.paused = false
    this.field = SceneManager.getInstance().field.field
    this.activeCamera = CameraManager.getInstance().activeCamera
    this.canvasWidth = 640
    this.canvasHeight = 480
    this.lastFrameEvent = { frame: 0 } as FrameEvent
    this.cloneArray = []
    this.lineClonePointIndex = 0
    this.linePointPositions = new Float32Array
    this.MAX_POINTS = 500

    addCanvasResizeListener(this.updateSize)
  }

  toggleDrawingMode = (isDrawingMode: boolean) => {
    isDrawingMode ? this.initializeDrawing() : this.terminateDrawing()
  }

  private readonly terminateDrawing = () => {
    this.isDrawing = false
    removeCameraChangeListener(this.onCameraChange)
    removePlayPauseListener(this.onPlayPause)
    if (this.canvas) {
      this.canvas.removeEventListener("mousedown", this.onMouseDown)
      this.canvas.removeEventListener("mousemove", this.onMouseMove)
      this.canvas.removeEventListener("mouseup", this.onMouseUp)
    }
    this.removeClones()
    SceneManager.getInstance().scene.remove(this.sphere)
  }

  private readonly initializeDrawing = () => {
    this.canvas = GameManager.getInstance().getDOMNode()
    this.activeCamera = CameraManager.getInstance().activeCamera
    const sphereGeometry = new SphereBufferGeometry(0.1, 32, 32);
    const sphereMaterial = new MeshBasicMaterial({ color: 0xff0000 });
    this.sphere = new Mesh(sphereGeometry, sphereMaterial)

    addCameraChangeListener(this.onCameraChange)
    addPlayPauseListener(this.onPlayPause)

    this.canvas.addEventListener("mousedown", this.onMouseDown)
    this.canvas.addEventListener("mousemove", this.onMouseMove)
    this.canvas.addEventListener("mouseup", this.onMouseUp)
  }

  private readonly onMouseDown = ({ offsetX, offsetY, ctrlKey, altKey }: MouseEvent) => {
    if (altKey) {
      this.drawSpheres3D(offsetX, offsetY)
    } else {
      ctrlKey ? this.drawSpheres2D(offsetX, offsetY) : this.startLine(offsetX, offsetY)
    }
    this.isDrawing = true
  }

  private readonly onMouseMove = ({ offsetX, offsetY, ctrlKey, altKey }: MouseEvent) => {
    if (this.isDrawing) {
      if (altKey) {
        this.drawSpheres3D(offsetX, offsetY)
      } else {
        ctrlKey ? this.drawSpheres2D(offsetX, offsetY) : this.updateLine(offsetX, offsetY)
      }
    }
  }

  private readonly onMouseUp = ({ offsetX, offsetY, ctrlKey, altKey }: MouseEvent) => {
    if (this.isDrawing) {
      if (altKey) {
        this.drawSpheres3D(offsetX, offsetY)
      } else {
        ctrlKey ? this.drawSpheres2D(offsetX, offsetY) : this.updateLine(offsetX, offsetY)
      }
      this.isDrawing = false
    }
  }

  private readonly startLine = (offsetX: number, offsetY: number) => {
    this.lineClonePointIndex = 0
    const geometry = new BufferGeometry()
    const material = new LineBasicMaterial({ color: 0xff0000, linewidth: 2 })
    const positions = new Float32Array(this.MAX_POINTS * 3)
    const newLine = new Line(geometry, material)
    const mouseVec = this.getMouseVector(offsetX, offsetY)

    positions[0] = mouseVec.x
    positions[1] = mouseVec.y
    positions[2] = mouseVec.z

    this.linePointPositions = positions

    geometry.setAttribute('position', new BufferAttribute(this.linePointPositions, 3))
    geometry.setDrawRange(0, 0);
    SceneManager.getInstance().scene.add(newLine)
    this.cloneArray.push(newLine.uuid)
    this.currentLineClone = newLine
    this.lineClonePointIndex++
  }

  private readonly updateLine = (offsetX: number, offsetY: number) => {
    const clone = this.currentLineClone
    const index = this.lineClonePointIndex
    if (clone) {
      const mouseVec = this.getMouseVector(offsetX, offsetY)
      const geo = clone.geometry as BufferGeometry
      const position = geo.attributes.position as BufferAttribute

      this.linePointPositions[index * 3 + 0] = mouseVec.x
      this.linePointPositions[index * 3 + 1] = mouseVec.y
      this.linePointPositions[index * 3 + 2] = mouseVec.z
      position.needsUpdate = true;

      geo.setDrawRange(0, this.lineClonePointIndex++);
      this.paused && this.refreshFrame()
    }
  }

  private readonly getMouseVector = (offsetX: number, offsetY: number) => {
    const cam = this.activeCamera
    const mouse3D = new Vector3(offsetX / this.canvasWidth * 2 - 1, -offsetY / this.canvasHeight * 2 + 1, 0.1).unproject(cam)
    mouse3D.sub(cam.position)
    mouse3D.normalize()
    const scale = this.canvasWidth / 2
    const rayCaster = new Raycaster(cam.position, mouse3D);
    const rayDir = new Vector3(rayCaster.ray.direction.x * scale, rayCaster.ray.direction.y * scale, rayCaster.ray.direction.z * scale);
    const rayVector = new Vector3(cam.position.x + rayDir.x, cam.position.y + rayDir.y, cam.position.z + rayDir.z);
    return rayVector
  }

  private readonly drawSpheres2D = (offsetX: number, offsetY: number) => {
    const rayVector = this.getMouseVector(offsetX, offsetY)
    const clone = this.sphere.clone()
    this.cloneArray.push(clone.uuid)
    clone.position.copy(rayVector)
    clone.scale.set(10, 10, 10)
    SceneManager.getInstance().scene.add(clone)

    this.paused && this.refreshFrame()
  }

  private readonly drawSpheres3D = (offsetX: number, offsetY: number) => {
    const x = (offsetX / this.canvasWidth) * 2 - 1
    const y = -(offsetY / this.canvasHeight) * 2 + 1
    const rayCaster = new Raycaster()
    rayCaster.setFromCamera({ x, y }, this.activeCamera)
    const intersections = rayCaster.intersectObjects([this.field], true);
    if (intersections.length) {
      const clone = this.sphere.clone()
      this.cloneArray.push(clone.uuid)
      clone.position.copy(intersections[0].point)
      clone.scale.set(200, 200, 200)
      SceneManager.getInstance().scene.add(clone)

      this.paused && this.refreshFrame()
    }
  }

  private readonly removeClones = () => {
    const scene = SceneManager.getInstance().scene
    this.cloneArray.map((i: string) => {
      const clone = scene.getObjectByProperty('uuid', i) as Mesh
      if (clone) {
        (clone.geometry as SphereBufferGeometry).dispose();
        (clone.material as MeshBasicMaterial).dispose();
        scene.remove(clone);
      }
    })

    this.paused && this.refreshFrame()
  }

  private readonly refreshFrame = () => {
    window.requestAnimationFrame(() => {
      GameManager.getInstance().render()
      GameManager.getInstance().clock.setFrame(this.lastFrameEvent.frame)
    })
  }

  private readonly onPlayPause = ({ paused }: PlayPauseEvent) => {
    this.paused = paused
    if (paused) {
      this.lastFrameEvent.frame = GameManager.getInstance().clock.currentFrame
    }
  }

  private readonly updateSize = ({ width, height }: CanvasResizeEvent) => {
    this.canvasWidth = width
    this.canvasHeight = height
  }

  private readonly onCameraChange = ({ camera }: CameraChangeEvent) => {
    this.activeCamera = camera
  }

  /**
   * ========================================
   * Managers are singletons
   * ========================================
   */
  private static instance?: DrawingManager
  static getInstance() {
    if (!DrawingManager.instance) {
      throw new Error("DrawingManager not initialized with call to `init`")
    }
    return DrawingManager.instance
  }
  static init() {
    DrawingManager.instance = new DrawingManager()
    return DrawingManager.instance
  }
  static destruct() {
    const { instance } = DrawingManager
    if (instance) {
      removeCameraChangeListener(instance.onCameraChange)
      removeCanvasResizeListener(instance.updateSize)
      removePlayPauseListener(instance.onPlayPause)
      if (typeof instance.canvas !== "undefined") {
        instance.canvas.removeEventListener("mousedown", instance.onMouseDown)
        instance.canvas.removeEventListener("mousemove", instance.onMouseMove)
        instance.canvas.removeEventListener("mouseup", instance.onMouseUp)
      }
      DrawingManager.instance = undefined
    }
  }
}