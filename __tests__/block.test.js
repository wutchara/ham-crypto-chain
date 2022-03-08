const Block = require("../block");
const { GENESIS_DATA } = require("../config");
const cryptoHash = require('../crypto-hash');

describe('Block', () => {
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

  test('has a timestamp, lastHash, hash, and data property', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  describe('generis function', () => {
    const genesisBlock = Block.genesis();
    
    test('returns a Block instance', () => {
      expect(genesisBlock).toBeInstanceOf(Block);
    });

    test('returns the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe('mineBlock function', () => {
    const lastBlock = Block.genesis();
    const data = 'mined data';
    const minedBlock = Block.mineBlock({ lastBlock, data});

    test('returns the Block instance', () => {
      expect(minedBlock).toBeInstanceOf(Block);
    });

    test('sets the `lastHash` to be `hash` of the lastBlock', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    test('sets the `data`', () => {
      expect(minedBlock.data).toEqual(data);
    });

    test('sets a `timestamp`', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    test('creates a SHA-256 `hash` based on the proper inputs', () => {
      expect(minedBlock.hash)
      .toEqual(cryptoHash(lastBlock.hash, minedBlock.timestamp, data));
    });
  });
});