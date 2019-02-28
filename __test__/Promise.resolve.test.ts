import { TPromise } from '../lib/TPromise';

test('Promise.then', done => {
  TPromise.resolve({ a: 1, b: 3 }).then(res => {
    expect(res).toEqual({ a: 1, b: 3 });
    done();
  });
});
