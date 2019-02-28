import { TPromise } from '../lib/TPromise';

test('async resolve', done => {
  new TPromise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, 100);
  }).then(res => {
    expect(res).toBe(1);
    done();
  });
});

test('async reject', done => {
  new TPromise((resolve, reject) => {
    setTimeout(() => {
      reject('this is error reason');
    }, 100);
  }).then(
    res => {},
    reason => {
      expect(reason).toBe('this is error reason');
      done();
    }
  );
});
