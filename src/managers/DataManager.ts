import { ReplayData } from "../models/ReplayData"

interface DataManagerOptions {
  replayData: ReplayData
}

export default class DataManager {
  private data: ReplayData

  private constructor({ replayData }: DataManagerOptions) {
    this.data = replayData
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
