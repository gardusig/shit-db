function deepCopyMap(originalMap) {
  const newMap = new Map();
  originalMap.forEach(
    (value, key) => {
      const copiedValue = (typeof value === 'object') ? deepCopy(value) : value;
      newMap.set(key, copiedValue);
    }
  );
  return newMap;
}

function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepCopy);
  }
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepCopy(obj[key]);
    }
  }
  return newObj;
}
