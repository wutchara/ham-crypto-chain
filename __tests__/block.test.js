const Block = require("../block");
const {
  GENESIS_DATA,
  MINE_RATE
} = require("../config");
const cryptoHash = require('../crypto-hash');
const hexToBinary = require('hex-to-binary');

describe('Block', () => {
  const nonce = 1;
  const difficulty = 1;
  const timestamp = 2000; //Date.now();
  const lastHash = 'a';
  const hash = 'b';
  const data = ['a', 'b'];
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty,
  });

  test('has a timestamp, lastHash, hash, and data property', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
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
    const minedBlock = Block.mineBlock({
      lastBlock,
      data
    });

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
        .toEqual(cryptoHash(lastBlock.hash,
          minedBlock.nonce,
          minedBlock.difficulty,
          minedBlock.timestamp,
          data));
    });

    test('create a SHA-256 `hash` based on the proper inputs', () => {

    });

    test('sets a `hash` that matches the difficulty criteria', () => {
      expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty))
        .toEqual('0'.repeat(minedBlock.difficulty));
    });

    test('adjusts the difficulty', () => {
      const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];
      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe('adjustDifficulty()', () => {
    test('raises the difficulty for quickly mined block', () => {
      expect(Block.adjustDifficulty({
        originalBlock: block,
        timestamp: block.timestamp +
          MINE_RATE - 100,
      })).toEqual(block.difficulty + 1);
    });

    test('lowers the difficulty for slowly mined block', () => {
      expect(Block.adjustDifficulty({
        originalBlock: block,
        timestamp: block.timestamp +
          MINE_RATE + 100,
      })).toEqual(block.difficulty - 1);
    });

    test('hash a lower limit of 1', () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({
        originalBlock: block
      })).toEqual(1);
    });
  });
});