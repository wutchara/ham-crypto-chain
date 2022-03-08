const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
  constructor({
    timestamp,
    lastHash,
    hash,
    data,
  }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  static genesis() {
    return new Block(GENESIS_DATA);
  };

  static mineBlock({ lastBlock, data}) {
    const timestamp = Date.now();
    return new this({
      timestamp,
      lastHash: lastBlock.hash,
      hash: cryptoHash(timestamp, lastBlock.hash, data),
      data,
    });
  }
}

module.exports = Block;
