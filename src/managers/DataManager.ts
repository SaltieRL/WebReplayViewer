import { ReplayData } from "../models/ReplayData"
import { ReplayMetadata } from "../models/ReplayMetadata"

interface DataManagerOptions {
  replayData: ReplayData
  replayMetadata: ReplayMetadata
}

export default class DataManager {
  data: ReplayData
  metadata: ReplayMetadata

  private constructor({ replayData, replayMetadata }: DataManagerOptions) {
    this.data = replayData
    this.metadata = replayMetadata
  }

  public getData() {
    return this.data
  }

  /**
   * ========================================
   * Managers are singletons
   * ========================================
   */
  private static instance?: DataManager
  static getInstance() {
    if (!DataManager.instance) {
      throw new Error("DataManager not initialized with call to `init`")
    }
    return DataManager.instance
  }
  static init(options: DataManagerOptions) {
    DataManager.instance = new DataManager(options)
    return DataManager.instance
  }
}
