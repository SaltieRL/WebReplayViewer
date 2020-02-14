import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneBufferGeometry,
  SphereGeometry,
} from "three"

import { getCarName } from "../../builders/utils/playerNameGetters"
import { ReplayPlayer } from "../../models/ReplayPlayer"
import { AssetLoader } from "../AssetLoader"

export default class LowQualityAssetLoader implements AssetLoader {
  async loadBall(): Promise<Object3D> {
    const sphereGeometry = new SphereGeometry(92.5, 10, 10)
    const spherMaterial = new MeshStandardMaterial()
    return new Mesh(sphereGeometry, spherMaterial)
  }

  async loadField(): Promise<Object3D> {
    const geometry = new PlaneBufferGeometry(8192, 10240, 1, 1)
    const material = new MeshBasicMaterial({ color: "#4CAF50" })
    const fieldMesh = new Mesh(geometry, material)
    fieldMesh.rotation.x = -Math.PI / 2
    return fieldMesh
  }

  async loadCar(player: ReplayPlayer): Promise<Object3D> {
    const body = this.buildBody(player)
    this.setMaterials(body)
    body.name = getCarName(player.name)
    return body
  }

  private buildBody(player: ReplayPlayer): Object3D {
    // 0xff9800 is orange, 0x2196f3 is blue
    const carColor = player.isOrange ? 0xff9800 : 0x2196f3
    const bodyBox = new BoxGeometry(160, 100, 100)
    const material = new MeshBasicMaterial({ color: carColor })
    const carObject = new Mesh(bodyBox, material)
    carObject.position.y = 50
    const carGroup = new Group()
    carGroup.add(carObject)
    return carGroup
  }

  private setMaterials(body: Object3D) {
    const mesh = body as Mesh
    mesh.receiveShadow = true
    mesh.castShadow = true
  }
}
