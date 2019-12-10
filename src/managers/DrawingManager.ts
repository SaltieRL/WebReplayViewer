import { Group, Camera, Raycaster, SphereBufferGeometry, MeshBasicMaterial, Mesh, Vector3, BufferGeometry, LineBasicMaterial, Line, BufferAttribute, Material } from "three"

import {
  addCameraChangeListener,
  CameraChangeEvent,
  removeCameraChangeListener,
} from "../eventbus/events/cameraChange"
import {
  addCanvasResizeListener,
  CanvasResizeEvent,
  removeCanvasResizeListener,
} from "../eventbus/events/canvasResize"
import SceneManager from "./SceneManager"
import CameraManager from "./CameraManager"
import { GameManager } from "./GameManager"

interface DrawableMeshes {
  sphere: Mesh
  line: Line
}

interface Canvas {
  domNode: HTMLCanvasElement
  width: number
  height: number
}

export default class DrawingManager {
  private MAX_POINTS: number
  private selectedColor: string
  private linewidth: number
  private isDrawing: boolean
  private field: Group
  private activeCamera: Camera
  private canvas: Canvas
  private cloneArray: Array<string>
  private activeLinePointIndex: number
  private drawableMeshes: DrawableMeshes

  private constructor() {
    // Max points for Line - for filling linepoint position buffer array
    this.MAX_POINTS = 500
    this.selectedColor = "#ff0000"
    this.linewidth = 2
    this.isDrawing = false
    this.field = SceneManager.getInstance().field.field
    this.activeCamera = CameraManager.getInstance().activeCamera
    this.canvas = this.getCanvas()
    this.cloneArray = []
    this.activeLinePointIndex = 0
    this.drawableMeshes = this.getDrawableMeshes()

    addCanvasResizeListener(this.updateSize)
    addCameraChangeListener(this.onCameraChange)

    this.canvas.domNode.addEventListener("mousedown", this.onMouseDown)
    this.canvas.domNode.addEventListener("mousemove", this.onMouseMove)
    this.canvas.domNode.addEventListener("mouseup", this.onMouseUp)
  }

  clearDrawings = () => {
    this.removeClones()
  }

  setColor = (newColor: string) => {
    this.selectedColor = newColor
    const meshMat = this.drawableMeshes.sphere.material as MeshBasicMaterial
    meshMat.color.set(newColor)
    const lineMat = this.drawableMeshes.line.material as LineBasicMaterial
    lineMat.color.set(newColor)
    this.isPaused() && this.refreshFrame()
  }

  setLineWidth = (newLinewidth: number) => {
    this.linewidth = newLinewidth
    const lineMat = this.drawableMeshes.line.material as LineBasicMaterial
    lineMat.setValues({linewidth: newLinewidth})
  }

  private readonly getDrawableMeshes = () => {
    const sphereGeometry = new SphereBufferGeometry(0.1, 32, 32);
    const sphereMaterial = new MeshBasicMaterial({ color: this.selectedColor });
    const sphere = new Mesh(sphereGeometry, sphereMaterial)

    const lineGeometry = new BufferGeometry()
    const lineMaterial = new LineBasicMaterial({ color: this.selectedColor, linewidth: this.linewidth })
    const positions = new Float32Array(this.MAX_POINTS * 3)
    lineGeometry.setAttribute('position', new BufferAttribute(positions, 3))
    const line = new Line(lineGeometry, lineMaterial)

    this.cloneArray.push(sphere.uuid, line.uuid)

    return { sphere, line }
  }

  private readonly getCanvas = () => {
    const domNode = GameManager.getInstance().getDOMNode()
    const { width, height } = domNode.getBoundingClientRect()

    return { domNode, width, height }
  }

  private readonly onMouseDown = ({ offsetX, offsetY, ctrlKey, altKey }: MouseEvent) => {
    if (altKey) {
      this.drawSpheres3D(offsetX, offsetY)
    } else {
      ctrlKey ? this.drawSpheres2D(offsetX, offsetY) : this.drawLine(offsetX, offsetY)
    }
    this.isDrawing = true
  }

  private readonly onMouseMove = ({ offsetX, offsetY, ctrlKey, altKey }: MouseEvent) => {
    if (this.isDrawing) {
      if (altKey) {
        this.drawSpheres3D(offsetX, offsetY)
      } else {
        ctrlKey ? this.drawSpheres2D(offsetX, offsetY) : this.drawLine(offsetX, offsetY)
      }
    }
  }

  private readonly onMouseUp = ({ offsetX, offsetY, ctrlKey, altKey }: MouseEvent) => {
    this.isDrawing = false
  }

  private readonly getMouseVector = (offsetX: number, offsetY: number) => {
    const cam = this.activeCamera
    const mouse3D = new Vector3(offsetX / this.canvas.width * 2 - 1, -offsetY / this.canvas.height * 2 + 1, 0.1).unproject(cam)
    mouse3D.sub(cam.position)
    mouse3D.normalize()
    const scale = this.canvas.width / 2
    const rayCaster = new Raycaster(cam.position, mouse3D);
    const rayDir = new Vector3(rayCaster.ray.direction.x * scale, rayCaster.ray.direction.y * scale, rayCaster.ray.direction.z * scale);
    const rayVector = new Vector3(cam.position.x + rayDir.x, cam.position.y + rayDir.y, cam.position.z + rayDir.z);
    return rayVector
  }

  private readonly drawLine = (offsetX: number, offsetY: number) => {
    const index = this.isDrawing ? this.activeLinePointIndex : this.activeLinePointIndex = 0
    const activeLine = this.isDrawing ? this.drawableMeshes.line : this.drawableMeshes.line.clone()
    if (!this.isDrawing) {
      activeLine.geometry = this.drawableMeshes.line.geometry.clone()
      this.cloneArray.push(activeLine.uuid)
      SceneManager.getInstance().scene.add(activeLine)
      this.drawableMeshes.line = activeLine
    }

    const geo = activeLine.geometry as BufferGeometry
    const positionAttribute = geo.attributes.position as BufferAttribute
    const positions = positionAttribute.array as any[]
    const mouseVec = this.getMouseVector(offsetX, offsetY)

    positions[index * 3 + 0] = mouseVec.x
    positions[index * 3 + 1] = mouseVec.y
    positions[index * 3 + 2] = mouseVec.z

    geo.setDrawRange(0, ++this.activeLinePointIndex);
    positionAttribute.needsUpdate = true

    this.isPaused() && this.refreshFrame()
  }

  private readonly drawSpheres2D = (offsetX: number, offsetY: number) => {
    const rayVector = this.getMouseVector(offsetX, offsetY)
    const clone = this.drawableMeshes.sphere.clone()
    this.cloneArray.push(clone.uuid)
    clone.position.copy(rayVector)
    clone.scale.set(10, 10, 10)
    SceneManager.getInstance().scene.add(clone)

    this.isPaused() && this.refreshFrame()
  }

  private readonly drawSpheres3D = (offsetX: number, offsetY: number) => {
    const x = (offsetX / this.canvas.width) * 2 - 1
    const y = -(offsetY / this.canvas.height) * 2 + 1
    const rayCaster = new Raycaster()
    rayCaster.setFromCamera({ x, y }, this.activeCamera)
    const intersections = rayCaster.intersectObjects([this.field], true);
    if (intersections.length) {
      const clone = this.drawableMeshes.sphere.clone()
      this.cloneArray.push(clone.uuid)
      clone.position.copy(intersections[0].point)
      clone.scale.set(200, 200, 200)
      SceneManager.getInstance().scene.add(clone)

      this.isPaused() && this.refreshFrame()
    }
  }

  private readonly removeClones = () => {
    const scene = SceneManager.getInstance().scene
    this.cloneArray.map((i: string) => {
      const clone = scene.getObjectByProperty('uuid', i) as Mesh
      if (clone) {
        (clone.geometry as BufferGeometry).dispose(),
          (clone.material as Material).dispose()
        scene.remove(clone)
      }
    })

    this.isPaused() && this.refreshFrame()
  }

  private readonly refreshFrame = () => {
    window.requestAnimationFrame(() => {
      const gameManager = GameManager.getInstance()
      gameManager.render()
      gameManager.clock.setFrame(gameManager.clock.currentFrame)
    })
  }

  private readonly isPaused = () => {
    return GameManager.getInstance().clock.isPaused()
  }

  private readonly updateSize = ({ width, height }: CanvasResizeEvent) => {
    this.canvas.width = width
    this.canvas.height = height
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
      instance.removeClones()
      instance.canvas.domNode.removeEventListener("mousedown", instance.onMouseDown)
      instance.canvas.domNode.removeEventListener("mousemove", instance.onMouseMove)
      instance.canvas.domNode.removeEventListener("mouseup", instance.onMouseUp)
      DrawingManager.instance = undefined
    }
  }
}