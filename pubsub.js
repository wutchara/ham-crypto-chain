const redis = require('redis');

const channels = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
};
const redisPass = 'redis-pass';

class PubSub {
  constructor({
    blockchain
  }) {
    this.blockchain = blockchain;
  }

  async initializeAsync() {
    this.publisher = redis.createClient({
      password: redisPass,
    });
    await this.publisher.connect();
    console.log('this.publisher.ping', await this.publisher.ping());

    this.subscriber = this.publisher.duplicate();
    await this.subscriber.connect();
    console.log('this.subscriber.ping', await this.subscriber.ping());

    await this.subscribeToChannels();

    return this;
  }

  async subscribeToChannels() {
    Object.keys(channels).map(async (c) => {
      await this.subscriber.subscribe(c, (message, channel) => this.handleMessage(message, channel));
    });
  }

  async publish({
    channel,
    message
  }) {
    await this.publisher.publish(channel, message);
  }

  async broadcastChain() {
    await this.publish({
      channel: channels.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  handleMessage(message, channel) {
    console.log('channel', channel);
    console.log('message', message);

    const parseMessage = JSON.parse(message);
    if (channel === channels.BLOCKCHAIN) {
      this.blockchain.replaceChain(parseMessage);
    }
  }
}

module.exports = PubSub;

// const testPubSub = new PubSub();
// testPubSub.initializeAsync()
//   .then((pubsub) => {
//     setInterval(async () => {
//       console.log('====================');
//       pubsub.publisher.publish(channels.TEST, 'foo');
//     }, 1500);
//   }).catch(e => {
//     console.error(e);
//   });