import { TPromise } from '../lib/TPromise';

test('duplicate resolve', done => {
  new TPromise(resolve => {
    resolve(1);
    resolve(2);
  }).then(res => {
    expect(res).toBe(1);
    done();
  });
});

test('duplicate reject', done => {
  new TPromise((resolve, reject) => {
    reject(1);
    reject(2);
  }).then(
    res => {},
    reason => {
      expect(reason).toBe(1);
      done();
    }
  );
});

test('duplicate resolve reject', done => {
  new TPromise((resolve, reject) => {
    resolve(1);
    reject(2);
  }).then(res => {
    expect(res).toBe(1);
    done();
  });
});

test('duplicate reject resolve', done => {
  new TPromise((resolve, reject) => {
    reject(1);
    resolve(2);
  }).then(
    res => {},
    reason => {
      expect(reason).toBe(1);
      done();
    }
  );
});
