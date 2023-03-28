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

export function randomNum() {
  // 0-9的随机数
  var arr = [];//容器
  for (var i = 0; i < 16; i++) {//循环七次
    var num = Math.random() * 9;//Math.random();每次生成(0-1)之间的数;
    num = parseInt(num, 10);
    arr.push(num);
  }
  return arr.join('')
}
export function getTime() {
  //new Date() new一个data对象，当前日期和时间
  //toLocaleString() 方法可根据本地时间把 Date 对象转换为字符串，并返回结果。
  return Date.parse(new Date()) / 1000
}
