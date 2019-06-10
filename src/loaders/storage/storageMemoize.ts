const STORAGE: { [key: string]: any } = {}

export const storageMemoize = async <T>(
  loaderFunction: () => Promise<T>,
  objectName: string
) => {
  if (STORAGE[objectName]) {
    return Promise.resolve<T>(STORAGE[objectName])
  }
  return loaderFunction().then(value => {
    STORAGE[objectName] = value
    return value
  })
}
