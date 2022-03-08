const cryptoHash = require('../crypto-hash');

describe('cryptoHash', () => {
  test('generates a SHA-256 hashed output', () => {
    expect(cryptoHash('test')).toEqual('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
  });

  test('produces the same hash with the same input args in any order', () => {
    expect(cryptoHash('test-1', 'test-2', 'test-3'))
      .toEqual(cryptoHash('test-3', 'test-1', 'test-2'));
  });
});
