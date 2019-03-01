import { Publisher, Subscriber } from './Subscriber';

interface Resolve {
  (value?: {} | PromiseLike<{}> | undefined): void;
}

interface Reject {
  (reason?: any): void;
}

interface Executor {
  (resolve: Resolve, reject: Reject): void;
}

interface OnResolve {
  (value?: {} | PromiseLike<{}> | undefined): any;
}

interface OnReject {
  (reason?: any): any;
}

interface OnFinally {
  (): void;
}

enum PromiseStatus {
  fullfill = 'FULLFILL',
  reject = 'REJECT',
  pendding = 'PENDDING'
}

export class TPromise {
  static resolve(value: any) {
    return new TPromise(resolve => {
      resolve(value);
    });
  }

  static reject(reason: any) {
    return new TPromise((resolve, reject) => {
      reject(reason);
    });
  }

  private promiseStatus: PromiseStatus;
  private promiseValue: any;
  private promiseReason: any;

  private publisher: Publisher;
  constructor(executor: Executor) {
    this.promiseStatus = PromiseStatus.pendding;
    this.publisher = new Publisher();
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  /**
   * 是否为终态
   */
  get isEventual(): Boolean {
    return this.promiseStatus !== PromiseStatus.pendding;
  }

  private resolve(promiseValue: any) {
    if (!this.isEventual) {
      this.promiseValue = promiseValue;
      this.promiseStatus = PromiseStatus.fullfill;
      this.publisher.trigerResolve(promiseValue);
    }
  }

  private reject(reason?: any) {
    if (!this.isEventual) {
      this.promiseStatus = PromiseStatus.reject;
      this.promiseReason = reason;
      this.publisher.trigerReject(reason);
    }
  }

  generaterThenExecutor(onResolve: OnResolve, onReject?: OnReject): Executor {
    const subscriber = new Subscriber(this.publisher);
    return (resolve, reject) => {
      subscriber.onResolve = (value: any) => {
        try {
          resolve(onResolve(value));
        } catch (error) {
          reject(error);
        }
      };
      if (onReject) {
        subscriber.onReject = (reason: any) => {
          try {
            resolve(onReject(reason));
          } catch (error) {
            reject(error);
          }
        };
      }
    };
  }

  then(onResolve: OnResolve, onReject?: OnReject): TPromise {
    switch (this.promiseStatus) {
      case PromiseStatus.fullfill:
        try {
          return TPromise.resolve(onResolve(this.promiseValue));
        } catch (error) {
          return TPromise.reject(error);
        }
      case PromiseStatus.reject:
        if (onReject) {
          try {
            return TPromise.reject(onReject(this.promiseReason));
          } catch (error) {
            return TPromise.reject(error);
          }
        } else {
          return TPromise.reject(this.promiseReason);
        }

      default:
        return new TPromise(this.generaterThenExecutor(onResolve, onReject));
    }
  }

  catch(onReject: OnReject) {
    return this.then(() => {}, onReject);
  }

  finally(onFinally: OnFinally) {
    onFinally();
    return this;
  }
}
