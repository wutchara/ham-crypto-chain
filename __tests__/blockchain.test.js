const Blockchain = require('../blockchain');
const Block = require('../block');
const cryptoHash = require('../crypto-hash');

describe('Blockchain', () => {
  let originalChain;
  let blockchain;
  let newChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;
  });

  test('contains a `chain` Array instance', () => {
    expect(blockchain.chain).toBeInstanceOf(Array);
  });

  test('starts with genersis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  test('Add a new block into the chain', () => {
    const newData = 'foo bar';
    blockchain.addBlock({ data: newData});

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe('isValidChain', () => {
    describe('when the chain does not start with the genersis block', () => {
      test('return false', () => {
        blockchain.chain[0] = { data: 'fake-genersis' };
        expect(Blockchain.isValidChain(blockchain.chain)).toEqual(false);
      });
    });

    describe('when the chain starts with the genersis block and has multiple blocks', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: 'Bears' });
        blockchain.addBlock({ data: 'Beets' });
        blockchain.addBlock({ data: 'Battlestar' });
      });

      describe('and a lastHash reference has changed', () => {
        test('returns false', () => {
          blockchain.chain[2].lastHash = 'broken-lastHash';
          expect(Blockchain.isValidChain(blockchain.chain)).toEqual(false);
        });
      });

      describe('and the chain contains a block with an invalid field', () => {
        test('return false', () => {
          blockchain.chain[2].data = 'some-bad-and-evil-data';
          expect(Blockchain.isValidChain(blockchain.chain)).toEqual(false);
        });
      });

      describe('and the chain contains a block with a jumped difficulty', () => {
        it('return false', () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;

          const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);


          const badBlock = new Block({
            timestamp, lastHash, hash, nonce, difficulty, data
          });

          blockchain.chain.push(badBlock);
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain does not contains any invalid field', () => {
        test('return true', () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toEqual(true);
        });
      });
    });
  });

  describe('replaceChain', () => {
    let errorMock;
    let logMock;
    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock;
    });
    describe('when the new chain is not longer', () => {
      beforeEach(() => {
        newChain.chain[0] = { new: 'chain' };
        blockchain.replaceChain(newChain.chain);
      });
      test('does not replace the chain', () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      test('logs an error', () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('when the new chain is longer', () => {
      beforeEach(() => {
        newChain.addBlock({ data: 'Bears' });
        newChain.addBlock({ data: 'Beets' });
        newChain.addBlock({ data: 'Battlestar' });
      });

      describe('chain is invalid', () => {
        beforeEach(() => {
          newChain.chain[2].hash = 'some-fake-hash';
          blockchain.replaceChain(newChain.chain);
        });

        test('does not replace the chain', () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        test('logs an error', () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe('chain is valid', () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });
        test('replace the chain', () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        test('logs about the chain replacement', () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});