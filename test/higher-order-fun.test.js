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

    expect(hof.omgenerator.uniqueString('lichking-')).toBe('lichking-1');
    expect(hof.omgenerator.uniqueString('lichking-')).toBe('lichking-2');
  });

  test('should fnull', () => {
    const nums = [1, 2, 3, null, 5];
    const safeMult = hof.fnull((total, n) => total * n, 1, 1);
    expect(_.reduce(nums, safeMult)).toBe(30);
  });

  test('should defaults', () => {
    expect(hof.doSomething({ critical: 9 })).toBe(9);
    expect(hof.doSomething({})).toBe(108);
  });

  test('should checker', () => {
    const alwaysPasses = hof.checker(hof.always(true), hof.always(true));
    expect(alwaysPasses({})).toEqual([]);
    const fails = hof.always(false);
    fails.message = 'a failure in life';
    const alwaysFails = hof.checker(fails);
    expect(alwaysFails({})).toEqual(['a failure in life']);
  });

  test('should valdiator', () => {
    const gonnnaFail = hof.checker(hof.validator('ZOMG!', hof.always(false)));
    expect(gonnnaFail(100)).toEqual(['ZOMG!']);
    const checkCommand = hof.checker(hof.validator('must be a map', hof.aMap));
    expect(checkCommand({})).toBeTruthy();
    expect(checkCommand(42)).toEqual(['must be a map']);
  });

  test('should checkCommand', () => {
    const checkCommand = hof.checker(hof.validator('must be a map', hof.aMap), hof.hasKeys('msg', 'type'));
    expect(checkCommand({ msg: 'blah', type: 'display' })).toEqual([]);
    expect(checkCommand(32)).toEqual(['must be a map', 'Must have values for keys: msg type']);
    expect(checkCommand({})).toEqual(['Must have values for keys: msg type']);
  });
});
