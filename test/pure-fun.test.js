import * as pf from '../src/pure-fun';
import { always } from '../src/higher-order-fun';

describe('generateString', () => {
  const result = pf.generateString(always('a'), 10);

  test('should return a string of a specific length', () => {
    expect(result.constructor).toBe(String);
    expect(result.length).toBe(10);
  });

  test('should return a string congruent with its char generator', () => {
    expect(result).toEqual('aaaaaaaaaa');
  });
});

describe('pure functions and immutability', () => {
  test('should merge', () => {
    const person = { fname: 'Simon' };
    expect(pf.merge(person, { lname: 'Petrikov' }, { age: 28 }, { age: 108 }))
      .toEqual({ age: 108, lname: 'Petrikov', fname: 'Simon' });
    expect(person).toEqual({ fname: 'Simon' });
  });
});

describe('controlling change', () => {
  const aNumber = new pf.Container(42);

  test('should update', () => {
    expect(aNumber.update((n) => n + 1)).toBe(43);
    expect(aNumber).toEqual({ value: 43 });
  });
});
