import _ from 'underscore';
import * as hof from '../src/higher-order-fun';
import { plucker } from '../src/scope-closures';

describe('higher-order functions', () => {
  test('should finder', () => {
    const people = [{ name: 'Fred', age: 65 }, { name: 'Lucy', age: 36 }];
    expect(hof.finder(_.identity, Math.max, [1, 2, 3, 4, 5])).toBe(5);
    expect(hof.finder(plucker('age'), Math.max, people))
      .toEqual({ name: 'Fred', age: 65 });
    expect(hof.finder(plucker('name'), Math.max, people))
      .toEqual({ name: 'Lucy', age: 36 });
  });

  test('should best', () => {
    expect(hof.best((x, y) => x > y, [1, 2, 3, 4, 5])).toBe(5);
  });

  test('should repeat', () => {
    expect(hof.repeat(4, 'Major'))
      .toEqual(['Major', 'Major', 'Major', 'Major']);
  });

  test('should repeatedly', () => {
    expect(hof.repeatedly(3, () => 'Hi'))
      .toEqual(['Hi', 'Hi', 'Hi']);
    expect(hof.repeatedly(3, (n) => n))
      .toEqual([0, 1, 2]);
  });

  test('should iterateUntil', () => {
    expect(hof.iterateUntil((n) => n + n, (n) => n <= 1024, 1))
      .toEqual([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);
  });

  test('should always', () => {
    const f = hof.always(() => {});
    const g = hof.always(() => {});
    expect(f() === f()).toBeTruthy();
    expect(f() === g()).toBeFalsy();
    expect(hof.repeatedly(3, hof.always('Odelay!')))
      .toEqual(['Odelay!', 'Odelay!', 'Odelay!']);
  });

  test('should invoker', () => {
    const rev = hof.invoker('reverse', Array.prototype.reverse);
    expect(_.map([[1, 2, 3]], rev)).toEqual([[3, 2, 1]]);
  });

  test('should makeUniqueString', () => {
    const uniqueString = hof.makeUniqueStringFunction(0);
    expect(uniqueString('dari')).toBe('dari1');
    expect(uniqueString('dari')).toBe('dari2');
  });
});
