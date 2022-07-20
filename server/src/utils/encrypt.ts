import * as bcrypt from 'bcrypt';

/**
 * @description 设置盐并返回
 * @date 20/07/2022
 * @export
 * @param {number} saltRounds
 * @return {*}  {string}
 */
export function setSalt(saltRounds: number): string {
  return bcrypt.genSaltSync(saltRounds);
}

/**
 * @description 密码加密并返回
 * @date 20/07/2022
 * @export
 * @param {string} password
 * @param {string} salt
 * @return {*}  {string}
 */
export function handleEncrypt(password: string, salt: string): string {
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
