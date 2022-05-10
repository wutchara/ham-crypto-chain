const redis = require('redis');

const channels = {
  TEST: 'TEST',
};
const redisPass = 'redis-pass';

class PubSub {
  async initializeAsync() {
    this.publisher = redis.createClient({
      password: redisPass,
    });
    await this.publisher.connect();
    console.log('this.publisher.ping', await this.publisher.ping());

    this.subscriber = this.publisher.duplicate();
    await this.subscriber.connect();
    console.log('this.subscriber.ping', await this.subscriber.ping());

    await this.subscriber.subscribe(channels.TEST, this.handleMessage);

    return this;
  }

  handleMessage(message, channel) {
    console.log('channel', channel);
    console.log('message', message);
  }
}

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