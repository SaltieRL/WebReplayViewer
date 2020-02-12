export const setItem = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value)
  } catch (e) {
    console.error(e)
  }
}

export const getItem = (key: string): string | undefined => {
  try {
    return window.localStorage.getItem(key) || undefined
  } catch (e) {
    console.error(e)
    return undefined
  }
}
