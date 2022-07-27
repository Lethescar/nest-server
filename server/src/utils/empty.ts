/**
 * @description 判断是否为空
 * @return {*}  {boolean}
 */
export function ifEmpty(value: any): boolean {
  return [undefined, null, ''].includes(value);
}
