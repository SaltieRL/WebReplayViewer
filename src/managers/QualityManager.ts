import { getItem, setItem } from "../utils/localStorage"

const LOCAL_STORAGE_QUALITY = "REPLAY_VIEWER_QUALITY"

export enum QualityOptions {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

interface QualityManagerOptions {
  quality?: QualityOptions
}

export default class QualityManager {
  private quality: QualityOptions

  private constructor({ quality }: QualityManagerOptions) {
    if (quality) {
      this.quality = quality
    } else {
      const storedQuality = this.getStoredQuality()
      if (storedQuality) {
        quality = storedQuality
      } else {
        this.setQuality(QualityOptions.HIGH)
        quality = QualityOptions.HIGH
      }
      this.quality = quality
    }
  }

  public getQuality(): QualityOptions {
    return this.quality
  }

  public setQuality(quality: QualityOptions) {
    this.quality = quality
    setItem(LOCAL_STORAGE_QUALITY, quality)
  }

  private getStoredQuality(): QualityOptions | undefined {
    const storedOption: keyof typeof QualityOptions =
      getItem(LOCAL_STORAGE_QUALITY) || ("" as any)
    return QualityOptions[storedOption]
  }

  /**
   * ========================================
   * Managers are singletons
   * ========================================
   */
  private static instance?: QualityManager
  static getInstance() {
    if (!QualityManager.instance) {
      throw new Error("QualityManager not initialized with call to `init`")
    }
    return QualityManager.instance
  }
  static init(options: QualityManagerOptions) {
    QualityManager.instance = new QualityManager(options)
    return QualityManager.instance
  }
}
