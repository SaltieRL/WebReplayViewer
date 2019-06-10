import { addToWindow } from "./addToWindow"

// tslint:disable
export const hashCode = (s: string) => {
  return s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
}

addToWindow("hash", hashCode)
