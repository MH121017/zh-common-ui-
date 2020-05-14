/**
 * @description: 一些常用方法
 */

/**
 *  随机获取guid
 */
export function getGuidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

/**
 * 判断字符串是否为null或空
 * @param {String} str
 */
export function isNullOrEmpty(str) {
	return str == null || str == ''
}
/**
 * 判断字符串不为null或空
 * @param {String} str
 */
export function isNotNullOrEmpty(str) {
	return str != null && str != ''
}