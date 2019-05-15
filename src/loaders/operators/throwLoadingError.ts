class MissingAssetError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "MissingAssetError"
  }
}

export const throwLoadingError = (assetName: string) => {
  throw new MissingAssetError(`Unable to load ${assetName} asset`)
}
