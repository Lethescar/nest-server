import { EncryptMiddleware } from './encrypt.middleware';

describe('EncryptMiddleware', () => {
  it('should be defined', () => {
    expect(new EncryptMiddleware()).toBeDefined();
  });
});
