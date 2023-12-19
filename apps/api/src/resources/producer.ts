import amqp from "amqplib";

const CONFIG = {
    url: process.env.ZAP_RABBIT_MQ_URL as string,
    exchangeName: process.env.ZAP_EVENT_EXCHANGE_NAME,
}

class Producer {
  channel:any;

  async createChannel() {
    const connection = await amqp.connect(CONFIG.url);
    this.channel = await connection.createChannel();
  }

  async publishMessage(routingKey:any, payload: any) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchangeName = CONFIG.exchangeName;
    await this.channel.assertExchange(exchangeName, "direct");

    const msgPayload = {
      ...payload,
      dateTime: new Date()
    };
    await this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(msgPayload))
    );

    console.log(
      `Published to routingKey: ${routingKey} through Exchange: ${exchangeName}`
    );
  }

  async consumeMessage(routingKey: any){
    if(!routingKey) return;
    if (!this.channel) {
      await this.createChannel();
    }

    const exchangeName = CONFIG.exchangeName;
    await this.channel.assertExchange(exchangeName, "direct");
    const q = await this.channel.assertQueue("EventExecutedQueue");
    await this.channel.bindQueue(
      q.queue,
      exchangeName,
      routingKey
    );

    this.channel.consume(q.queue, async (msg: any) => {
      console.log(`Event Flow Executed ***`);
      const msgData = JSON.parse(msg.content);  
      global.socketIo.emit(routingKey, JSON.stringify(msgData));

      this.channel.ack(msg);
    }); 
    console.log(`Listening / Consuming ${routingKey}`);
  }
}

export default Producer;