import { TPromise } from './lib/TPromise';

new TPromise(resolve => {
  console.log('setTimeout TPromise');
  setTimeout(() => {
    resolve(1);
  });
}).then(res => {
  console.log('setTimeout then', res);
});

new TPromise(resolve => {
  resolve(1);
}).then(res => {
  console.log('then', res);
});

new TPromise((resolve, reject) => {
  reject(1);
}).then(res => {
  console.log('reject then', res);
});

new TPromise((resolve, reject) => {
  reject(1);
}).then(
  res => {
    console.log('reject then', res);
  },
  reason => {
    console.log('reject catch', reason);
  }
);
