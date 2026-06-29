import {ls} from './$.js'

let persistenceHalted = false

// Call before wiping localStorage so trailing state mutations (e.g. event
// handlers firing during the same click) don't re-persist the old state.
export function haltPersistence() {
  persistenceHalted = true
}

export function createDeepProxy(target, cb) {
  return new Proxy(target, {
    set(obj, key, val) {
      obj[key] = val

      if (typeof val !== 'function') cb(obj, key, val)

      return Reflect.set(...arguments)
    },
    get(obj, key) {
      return obj[key] && typeof obj[key] === 'object'
        ? createDeepProxy(obj[key], cb)
        : obj[key]
    },
  })
}

function deepMerge(init, stored) {
  const result = {...init}
  for (const [key, storedVal] of Object.entries(stored)) {
    const initVal = init[key]
    if (typeof initVal === 'function') continue
    if (storedVal && typeof storedVal === 'object' && initVal && typeof initVal === 'object') {
      result[key] = deepMerge(initVal, storedVal)
    } else {
      result[key] = storedVal
    }
  }
  return result
}

export function persist(lsKey, init={}) {
  const ctx = deepMerge(init, ls.get(lsKey) || {})

  const set = () => {
    if (persistenceHalted) return
    ls.set(lsKey, JSON.stringify(ctx))
  }

  set()

  return createDeepProxy(ctx, set)
}