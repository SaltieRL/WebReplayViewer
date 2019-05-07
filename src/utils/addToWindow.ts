export const addToWindow = (name: string, object: any) => {
  const w = window as any
  w[name] = object
}
