/**
 * @example ?id=123&a=b
 * @return Object {id=123,a=b}
 */
export function urlParse() {
  let url = window.location.href;
  let obj = {};
  let arr = [];
  let arr1 = [];
  arr = url.substr(url.indexOf('?') + 1).split('&');
  for (let i = 0; i < arr.length; i++) {
    arr1 = arr[i].split('=');
    obj[arr1[0]] = arr1[1];
  }
  return obj;
}
