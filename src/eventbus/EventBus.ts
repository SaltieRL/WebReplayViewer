interface Listener<T> {
  type: string
  callback: (args: T) => void
  scope?: any
}

type Callback<A> = (arg: A) => void

class EventBus {
  private readonly listeners: { [key: string]: Listener<any>[] }

  constructor() {
    this.listeners = {}
  }

  buildEvent<EventBusArg>(type: string, scope?: any) {
    const addEventListener = (callback: Callback<EventBusArg>) =>
      this.addEventListener<EventBusArg>(type, callback, scope)
    const removeEventListener = (callback: Callback<EventBusArg>) =>
      this.removeEventListener(type, callback, scope)
    const dispatch = (args: EventBusArg) => this.dispatch(type, args)

    return {
      addEventListener,
      removeEventListener,
      dispatch,
    }
  }

  addEventListener<A>(type: string, callback: Callback<A>, scope?: any) {
    if (!this.listeners[type]) {
      this.listeners[type] = []
    }
    // Remove duplicate event listeners
    this.removeEventListener(type, callback, scope)
    // Add this listener to the list
    this.listeners[type].push({ type, callback, scope })
  }

  removeEventListener<A>(type: string, callback: Callback<A>, scope?: any) {
    if (!this.listeners[type]) {
      return
    }
    this.listeners[type] = this.listeners[type].filter(
      ({ type: t, callback: c, scope: s }) =>
        !(type === t && callback === c && scope === s)
    )
  }

  dispatch<A>(type: string, arg: A) {
    if (!this.listeners[type]) {
      return
    }
    this.listeners[type].forEach(listener => {
      if (type === listener.type) {
        listener.callback.call(listener.scope || null, arg)
      }
    })
  }

  reset() {
    Object.keys(this.listeners).forEach(key => {
      delete this.listeners[key]
    })
  }
}

export default new EventBus()
