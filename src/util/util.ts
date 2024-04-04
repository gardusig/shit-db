type DeepCopyable = Record<string, any> | any[];

function deepCopyMap<K, V>(originalMap: Map<K, V>): Map<K, V> {
  const newMap = new Map()
  originalMap.forEach(
    (value, key) => {
      const copiedValue = (typeof value === 'object') ? deepCopy(value) : value
      newMap.set(key, copiedValue)
    }
  )
  return newMap
}

function deepCopy<T extends DeepCopyable>(obj: T | null): T | null {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(element => deepCopy(element)) as T
  }
  const newObj = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepCopy((obj as any)[key])
    }
  }
  return newObj
}
