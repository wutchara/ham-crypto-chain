const {
  GENESIS_DATA
} = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
  constructor({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty,
  }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new Block(GENESIS_DATA);
  };

  static mineBlock({
    lastBlock,
    data
  }) {
    // const timestamp = Date.now();
    const {
      difficulty,
      hash: lastHash,
    } = lastBlock;
    let nonce = 0,
      hash, timestamp;

    const checkHash = '0'.repeat(difficulty);

    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

    } while (hash.substring(0, difficulty) !== checkHash);

    return new this({
      timestamp,
      lastHash,
      hash,
      data,
      nonce,
      difficulty
    });
  }
}

module.exports = Block;