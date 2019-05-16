import { Group } from "three"

class FieldManager {
  readonly field: Group

  constructor(field: Group) {
    this.field = field
  }
}

export default FieldManager
