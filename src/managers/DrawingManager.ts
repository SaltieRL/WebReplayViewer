import { Group, Camera, Raycaster, SphereBufferGeometry, MeshBasicMaterial, Mesh, Vector3, BufferGeometry, LineBasicMaterial, Line, BufferAttribute, Material, BoxBufferGeometry } from "three"

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

export type DrawableMeshIndex = "box" | "sphere" | "line"

export interface DrawingState {
  color?: string 
  meshScale?: number
  drawObject?: DrawableMeshIndex
  is3dMode?: boolean
}

type DrawableMeshes = {
  [k in DrawableMeshIndex]: Mesh | Line
}

interface Canvas {
  domNode: HTMLCanvasElement
  width: number
  height: number
}


export default class DrawingManager {
  color: string
  drawObject: DrawableMeshIndex
  is3dMode: boolean
  meshScale: number
  
  private MAX_POINTS: number
  private isDrawing: boolean = false
  private field: Group
  private activeCamera: Camera
  private canvas: Canvas
  private cloneArray: Array<string>
  private activeLinePointIndex: number
  private drawableMeshes: DrawableMeshes
  
  private constructor({color,meshScale,drawObject,is3dMode}: DrawingState = {}) {
    this.color = color || "ff0000"
    this.drawObject = drawObject || 'line'
    this.is3dMode = is3dMode || false
    this.meshScale = meshScale || 200
    this.MAX_POINTS = 500
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
    this.color = newColor
    const meshMat = this.drawableMeshes.sphere.material as MeshBasicMaterial
    meshMat.color.set(newColor)
    const lineMat = this.drawableMeshes.line.material as LineBasicMaterial
    lineMat.color.set(newColor)
    this.isPaused() && this.refreshFrame()
  }

  private readonly getDrawableMeshes = () => {
    const basicMaterial = new MeshBasicMaterial({ color: this.color })
    const boxGeometry = new BoxBufferGeometry(0.2, 0.2, 0.2)
    const box = new Mesh(boxGeometry, basicMaterial)

    const sphereGeometry = new SphereBufferGeometry(0.1, 32, 32)
    const sphere = new Mesh(sphereGeometry, basicMaterial)

    const lineMaterial = new LineBasicMaterial({ color: this.color })
    const lineGeometry = new BufferGeometry()
    const positions = new Float32Array(this.MAX_POINTS * 3)
    lineGeometry.setAttribute('position', new BufferAttribute(positions, 3))
    const line = new Line(lineGeometry, lineMaterial)

    this.cloneArray.push(sphere.uuid, line.uuid, box.uuid)

    return { box, sphere, line }
  }

  private readonly getCanvas = () => {
    const domNode = GameManager.getInstance().getDOMNode()
    const { width, height } = domNode.getBoundingClientRect()

    return { domNode, width, height }
  }

  private readonly onMouseDown = ({ offsetX, offsetY, ctrlKey, altKey }: MouseEvent) => {
    this.handleDrawing(offsetX, offsetY)
    this.isDrawing = true
  }

  private readonly onMouseMove = ({ offsetX, offsetY, ctrlKey, altKey }: MouseEvent) => {
    if (this.isDrawing) {
      this.handleDrawing(offsetX, offsetY)
    }
  }

  private readonly onMouseUp = ({ offsetX, offsetY, ctrlKey, altKey }: MouseEvent) => {
    this.isDrawing = false
  }

  private handleDrawing(offsetX: number, offsetY: number) {
    switch (this.drawObject) {
      case 'line':
          this.drawLine(offsetX, offsetY)
        break
      default:
          this.drawMesh(offsetX, offsetY, this.drawObject)
        break
    }
  }

  private readonly getMouseVector = (offsetX: number, offsetY: number) => {
    const cam = this.activeCamera
    const scale = this.canvas.width / 2
    const x = (offsetX / this.canvas.width) * 2 - 1
    const y = -(offsetY / this.canvas.height) * 2 + 1
    const rayCaster = new Raycaster()
    rayCaster.setFromCamera({ x, y }, cam)
    const rayDir = new Vector3(rayCaster.ray.direction.x * scale, rayCaster.ray.direction.y * scale, rayCaster.ray.direction.z * scale)
    const rayVector = new Vector3(cam.position.x + rayDir.x, cam.position.y + rayDir.y, cam.position.z + rayDir.z)
    if (this.is3dMode) {
      const intersections = rayCaster.intersectObjects([this.field], true)
      return intersections.length ? intersections[0].point : undefined
    }

    return rayVector
  }

  private readonly drawLine = (offsetX: number, offsetY: number) => {
    const mouseVec = this.getMouseVector(offsetX, offsetY)
    if (!mouseVec) return
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

    positions[index * 3 + 0] = mouseVec.x
    positions[index * 3 + 1] = mouseVec.y
    positions[index * 3 + 2] = mouseVec.z

    geo.setDrawRange(0, ++this.activeLinePointIndex)
    positionAttribute.needsUpdate = true

    this.isPaused() && this.refreshFrame()
  }

  private readonly drawMesh = (offsetX: number, offsetY: number, mesh: keyof DrawableMeshes) => {
    const rayVector = this.getMouseVector(offsetX, offsetY)
    if (rayVector) {
      const clone = this.drawableMeshes[mesh].clone()
      this.cloneArray.push(clone.uuid)
      if (this.is3dMode) rayVector.y += (this.meshScale*0.1)
      clone.position.copy(rayVector)
      clone.scale.setScalar(this.meshScale)
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
  static init(state?: DrawingState) {
    DrawingManager.instance = new DrawingManager(state)
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