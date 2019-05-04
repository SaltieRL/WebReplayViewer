import React, { PureComponent } from "react"
import ModelLoader from "../../loaders/ModelLoader"
import Ball from "./Ball.glb"
import {
  WebGLRenderer,
  PerspectiveCamera,
  HemisphereLight,
  AmbientLight,
  PlaneBufferGeometry,
  MeshPhongMaterial,
  Mesh,
} from "three"

interface Props {}

class ReplayViewer extends PureComponent<Props> {
  private mount: HTMLDivElement | null = null

  componentDidMount() {
    ModelLoader.loadObject(Ball).then(gltf => {
      const geometry = new PlaneBufferGeometry(8192, 10240, 1, 1)
      const material = new MeshPhongMaterial({ color: "#4CAF50" })
      const ground = new Mesh(geometry, material)
      ground.position.y = -1
      ground.rotation.x = -Math.PI / 2
      gltf.scene.add(ground)
      const renderer = new WebGLRenderer({ antialias: true })
      const camera = new PerspectiveCamera(80, 2, 0.1, 20000)
      gltf.scene.add(new HemisphereLight(0xffffbb, 0x080820, 1))
      gltf.scene.add(new AmbientLight(0x444444))
      const w = window as any
      w.camera = camera
      camera.position.y = 200
      const ball = gltf.scene.children[2]
      ball.scale.setScalar(100)
      camera.lookAt(ball.position)
      renderer.render(gltf.scene, camera)
      this.mount!.appendChild(renderer.domElement)
    })
  }

  render() {
    return (
      <div
        ref={mount => {
          this.mount = mount
        }}
      >
        Hello There Obi Wan
      </div>
    )
  }
}

export default ReplayViewer
