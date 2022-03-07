const Block = require("../block");

describe('Block', () => {

  test('has a timestamp, lastHash, hash, and data property', () => {
    const timestamp = 'date';
    const lastHash = 'a';
    const hash = 'b';
    const data = ['a', 'b'];
    const block = new Block({
      timestamp,
      lastHash,
      hash,
      data,
    });

    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });
});