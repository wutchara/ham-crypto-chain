const {
  GENESIS_DATA,
  MINE_RATE
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
      hash: lastHash,
    } = lastBlock;
    let nonce = 0,
      hash, timestamp;
    let {
      difficulty
    } = lastBlock;

    let checkHash = '0'.repeat(difficulty);

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp
      });
      checkHash = '0'.repeat(difficulty);
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

  static adjustDifficulty({
    originalBlock,
    timestamp,
  }) {
    const {
      difficulty
    } = originalBlock;

    if (difficulty < 1) return 1;
    const difference = timestamp - originalBlock.timestamp;

    if (difference > MINE_RATE) {
      return difficulty - 1;
    }

    return difficulty + 1;
  }
}

module.exports = Block;