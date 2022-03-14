const Blockchain = require('../blockchain');
const Block = require('../block');

describe('Blockchain', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
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

      describe('and the chain does not contains any invalid field', () => {
        test('return true', () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toEqual(true);
        });
      });
    });
  });
});