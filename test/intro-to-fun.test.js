import * as fjs from '../src/intro-to-fun';

const letters = ['a', 'b', 'c', 'd'];
const peopleCSV = 'name,age,hair\nMerble,35,red\nBob,64,blonde';

describe('intro to functional JS', () => {
  test('should add elements', () => {
    const addArrayElements = fjs.splat((x, y) => x + y);
    expect(addArrayElements([1, 2])).toBe(3);
  });

  test('should join elements', () => {
    const joinElements = fjs.unsplat((array) => array.join(' '));
    expect(joinElements(1, 2)).toBe('1 2');
    expect(joinElements('-', '$', '/', '!', ':'))
      .toBe('- $ / ! :');
  });

  test('should parseAge', () => {
    console.log = jest.fn();
    expect(fjs.parseAge('42')).toBe(42);
    expect(() => { fjs.parseAge(42); }).toThrow();
    expect(fjs.parseAge('frob')).toBe(0);
  });

  test('should naiveNth', () => {
    expect(fjs.naiveNth(letters, 1)).toBe('b');
    expect(fjs.naiveNth({}, 1)).toBeUndefined();
  });

  test('should nth', () => {
    expect(fjs.nth(letters, 1)).toBe('b');
    expect(fjs.nth('abc', 0)).toBe('a');
    expect(() => { fjs.nth({}, 1); }).toThrow();
    expect(() => { fjs.nth(letters, 4000); }).toThrow();
    expect(() => { fjs.nth(letters, 'aaaa'); }).toThrow();
  });

  test('should second', () => {
    expect(fjs.second(letters)).toBe('b');
    expect(fjs.second('fogus')).toBe('o');
    expect(() => { fjs.second({}); }).toThrow();
  });

  test('should sort', () => {
    expect([2, 3, -1, -6, 0, -108, 42, 10]
      .sort(fjs.lessOrEqual))
      .toEqual([42, 10, 3, 2, 0, -1, -6, -108]);

    expect([2, 3, -1, -6, 0, -108, 42, 10]
      .sort(fjs.comparator(fjs.lessOrEqual)))
      .toEqual([-108, -6, -1, 0, 2, 3, 10, 42]);
  });

  test('should lameCSV', () => {
    const peopleTable = fjs.lameCSV(peopleCSV);
    expect(peopleTable)
      .toEqual([
        ['name', 'age', 'hair'],
        ['Merble', '35', 'red'],
        ['Bob', '64', 'blonde']]);

    const sortedPeopleTable = peopleTable.slice();
    expect(sortedPeopleTable.sort())
      .toEqual([
        ['Bob', '64', 'blonde'],
        ['Merble', '35', 'red'],
        ['name', 'age', 'hair']]);

    expect(fjs.selectNames(peopleTable)).toEqual(['Merble', 'Bob']);

    expect(fjs.selectAges(peopleTable)).toEqual(['35', '64']);

    expect(fjs.mergeResults(
      fjs.selectNames(peopleTable),
      fjs.selectAges(peopleTable),
    )).toEqual([['Merble', '35'], ['Bob', '64']]);
  });

  test('should existy', () => {
    expect(fjs.existy(null)).toBeFalsy();
    expect(fjs.existy(undefined)).toBeFalsy();
    expect(fjs.existy({}.notHere)).toBeFalsy();
    expect(fjs.existy((function () {})())).toBeFalsy();
    expect(fjs.existy(0)).toBeTruthy();
    expect(fjs.existy(false)).toBeTruthy();
  });

  test('should truthy', () => {
    expect(fjs.truthy(false)).toBeFalsy();
    expect(fjs.truthy(undefined)).toBeFalsy();
    expect(fjs.truthy(0)).toBeTruthy();
    expect(fjs.truthy('')).toBeTruthy();
  });

  test('should executeIfHasField', () => {
    expect(fjs.executeIfHasField([1, 2, 3], 'reverse'))
      .toEqual([3, 2, 1]);
    expect(fjs.executeIfHasField({ foo: 32 }, 'foo'))
      .toBe(32);
    expect(fjs.executeIfHasField([1, 2, 3], 'notHere'))
      .toBeUndefined();
  });

  test('should map', () => {
    expect([null, undefined, 1, 2, false].map(fjs.existy))
      .toEqual([false, false, true, true, true]);
    expect([null, undefined, 1, 2, false].map(fjs.truthy))
      .toEqual([false, false, true, true, false]);
  });
});
