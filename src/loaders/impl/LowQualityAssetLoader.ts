import { BodyModel } from "rl-loadout-lib"
import {
  Group,
  LoadingManager,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
} from "three"

import { getCarName } from "../../builders/utils/playerNameGetters"
import { ReplayPlayer } from "../../models/ReplayPlayer"
import { AssetLoader } from "../AssetLoader"
import { loadObject } from "../operators/loadObject"
import { storageMemoize } from "../storage/storageMemoize"

export default class LowQualityAssetLoader implements AssetLoader {
  async loadBall(): Promise<Object3D> {
    const sphereGeometry = new SphereGeometry(92.5, 10, 10)
    const spherMaterial = new MeshStandardMaterial()
    return new Mesh(sphereGeometry, spherMaterial)
  }

  async loadField(loadingManager?: LoadingManager): Promise<Object3D> {
    return storageMemoize(async () => {
      const { default: glb } = await import(
        // @ts-ignore
        /* webpackChunkName: "Field" */ "../../assets/models/draco/Field.glb"
      )
      const fieldGLTF = await loadObject(glb, loadingManager)
      const field = new Group()
      field.name = "Field"
      field.add(...fieldGLTF.scene.children)
      return field
    }, "FIELD")
  }

  async loadCar(player: ReplayPlayer): Promise<Object3D> {
    const body = await this.buildBody(player)
    this.setMaterials(body)
    body.scene.name = getCarName(player.name)
    return body.scene
  }

  private async buildBody(player: ReplayPlayer): Promise<BodyModel> {
    // const paintConfig = createPaintConfig(player.isOrange)
    // const body = new BodyModel(
    //   Body.DEFAULT,
    //   Decal.NONE,
    //   paintConfig,
    //   this.manager.config
    // )
    // const wheels = new WheelsModel(
    //   Wheel.DEFAULT,
    //   paintConfig,
    //   this.manager.config
    // )
    // await body.load()
    // await wheels.load()
    // body.addWheelsModel(wheels)

    // return body
    return null as any
  }

  private setMaterials(body: BodyModel) {
    body.scene.traverse(object => {
      // @ts-ignore
      if (object.isMesh) {
        const mesh = object as Mesh
        mesh.receiveShadow = true
        mesh.castShadow = true

        // Phong material is less physically accurate but has noticably better performance
        const oldMaterial = mesh.material as MeshStandardMaterial
        const phongMaterial = new MeshPhongMaterial()
        phongMaterial.name = oldMaterial.name
        phongMaterial.map = oldMaterial.map
        phongMaterial.normalMap = oldMaterial.normalMap
        phongMaterial.color = oldMaterial.color
        phongMaterial.shininess = (1 - oldMaterial.roughness) * 100
        phongMaterial.skinning = oldMaterial.skinning

        mesh.material = phongMaterial
        mesh.material.needsUpdate = true

        oldMaterial.dispose()
      }
    })
  }
}
