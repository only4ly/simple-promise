import { TPromise } from '../lib/TPromise';

test('chain', done => {
  new TPromise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, 100);
  })
    .then(res => {
      return Number(res) * 100;
    })
    .then(res => {
      expect(res).toBe(100);
      done();
    });
});
