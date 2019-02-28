import { TPromise } from '../lib/TPromise';

test('sync resolve', done => {
  new TPromise(resolve => {
    resolve(1);
  }).then(res => {
    expect(res).toBe(1);
    done();
  });
});

test('sync reject', done => {
  new TPromise((resolve, reject) => {
    reject('this is error reason');
  }).then(
    res => {},
    reason => {
      expect(reason).toBe('this is error reason');
      done();
    }
  );
});
