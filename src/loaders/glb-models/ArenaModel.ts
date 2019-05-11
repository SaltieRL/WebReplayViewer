import { Object3D } from "three"

import { _Model } from "./_Model"

export default class ArenaModel implements _Model {
  private arena: Object3D

  constructor(arena: Object3D) {
    this.arena = arena
    this.initialize()
  }

  getThreeObject() {
    return this.arena
  }

  private initialize() {
    this.arena.scale.setScalar(24)
  }
}
