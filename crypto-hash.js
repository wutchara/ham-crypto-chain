const crypto = require('crypto');
// const hexToBinary = require('hex-to-binary');

const cryptoHash = (...args) => {
  const hash = crypto.createHash('sha256');
  hash.update(args.sort().join(' '));

  return hash.digest('hex');
  // return hexToBinary(hash.digest('hex')); // 'hexToBinary' convert hex to binary, to increase time to mine Block
};

module.exports = cryptoHash;
