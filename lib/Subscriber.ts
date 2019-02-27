export class Subscriber {
  publisher: Publisher;
  onResolve: Function;
  onReject: Function;

  constructor(publisher: Publisher) {
    this.publisher = publisher;
    this.publisher.addSubscriber(this);
  }

  triggerReject(reason: Error | String) {
    try {
      this.onReject(reason);
    } catch (error) {
      this.triggerReject(error);
    }
  }

  triggerResolve(value: any) {
    this.onResolve(value);
  }

  subscribe(publisher: Publisher) {
    this.publisher = publisher;
    this.publisher.addSubscriber(this);
  }
}

export class Publisher {
  private subscribers: Subscriber[];
  constructor() {
    this.subscribers = [];
  }

  addSubscriber(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }

  removeSubscribers() {
    this.subscribers = [];
  }

  trigerResolve(value: any) {
    this.subscribers.forEach(subscriber => {
      subscriber.triggerResolve(value);
    });
    this.removeSubscribers();
  }

  trigerReject(reason: any) {
    this.subscribers.forEach(subscriber => {
      subscriber.triggerReject(reason);
    });
    this.removeSubscribers();
  }
}
