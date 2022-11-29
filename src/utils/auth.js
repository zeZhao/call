/**
    * 设置、清空Storage中的对象
    * @param key
    * @param value
    */
 export function setStorage(key, value) {
  if (value === undefined) {
    window.sessionStorage.removeItem(key);
  } else {
    if (typeof value === "object") {
      value = JSON.stringify(value)
    }
    window.sessionStorage.setItem(key, value);
  }
}

/**
 * 获取storage中的对象
 * @param key
 */
export function getStorage(key) {
  let value = window.sessionStorage.getItem(key);
  try {
    value = value;
  } catch (e) {
    console.error(e, key, value);
    return null;
  }
  return value;
}
