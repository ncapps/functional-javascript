import _ from 'underscore';
import * as fcf from '../src/first-class-fun';

describe('applicative functions', () => {
  const nums = [1, 2, 3, 4, 5];
  test('should doubleAll', () => {
    expect(fcf.doubleAll(nums))
      .toEqual([2, 4, 6, 8, 10]);
  });

  test('should average', () => {
    expect(fcf.average(nums)).toBe(3);
  });

  test('should onlyEven', () => {
    expect(fcf.onlyEven(nums)).toEqual([2, 4]);
  });

  test('should cat', () => {
    expect(fcf.cat([1, 2, 3], [4, 5], [6, 7, 8]))
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('should construct', () => {
    expect(fcf.construct(42, [1, 2, 3]))
      .toEqual([42, 1, 2, 3]);
  });

  test('should mapcat', () => {
    expect(fcf.mapcat((e) => fcf.construct(e, [',']), [1, 2, 3]))
      .toEqual([1, ',', 2, ',', 3, ',']);
  });

  test('should butLast', () => {
    expect(fcf.butLast([1, 2, 3])).toEqual([1, 2]);
  });

  test('should interpose', () => {
    expect(fcf.interpose(',', [1, 2, 3]))
      .toEqual([1, ',', 2, ',', 3]);
  });
});

describe('collection-centric', () => {
  const obj = { a: 1, b: 2 };
  test('should identity', () => {
    expect(_.map(obj, _.identity)).toEqual([1, 2]);
  });

  test('should key/value', () => {
    expect(_.map(obj, (v, k) => [k, v]))
      .toEqual([['a', 1], ['b', 2]]);
  });

  test('should key/value/collection', () => {
    expect(_.map(obj, (v, k, coll) => [k, v, _.keys(coll)]))
      .toEqual([['a', 1, ['a', 'b']], ['b', 2, ['a', 'b']]]);
  });
});

describe('reduceRight', () => {
  function T() { return true; }
  function F() { return false; }

  test('should allOf', () => {
    expect(fcf.allOf()).toBeTruthy();
    expect(fcf.allOf(T, T)).toBeTruthy();
    expect(fcf.allOf(T, T, T, T, F)).toBeFalsy();
  });

  test('should anyOf', () => {
    expect(fcf.anyOf(T, T, T, T, F)).toBeTruthy();
    expect(fcf.anyOf(F, F, F, F)).toBeFalsy();
    expect(fcf.anyOf()).toBeFalsy();
  });
});

describe('reject/filter/complement', () => {
  const arr = ['a', 'b', 3, 'd'];
  test('should reject', () => {
    expect(_.reject(arr, _.isNumber)).toEqual(['a', 'b', 'd']);
  });

  test('should filter', () => {
    expect(_.filter(arr, _.isNumber)).toEqual([3]);
  });

  test('should complement', () => {
    expect(_.filter(arr, fcf.complement(_.isNumber)))
      .toEqual(['a', 'b', 'd']);
  });
});

describe('table-like data', () => {
  const library = [
    { title: 'SICP', isbn: '0262010771', ed: 1 },
    { title: 'SICP', isbn: '0262510871', ed: 2 },
    { title: 'Joy of Clojure', isbn: '1935182641', ed: 1 }];

  test('should project', () => {
    const editionResults = fcf.project(library, ['title', 'isbn']);
    expect(editionResults)
      .toEqual([
        { isbn: '0262010771', title: 'SICP' },
        { isbn: '0262510871', title: 'SICP' },
        { isbn: '1935182641', title: 'Joy of Clojure' },
      ]);
    const isbnResults = fcf.project(editionResults, ['isbn']);
    expect(isbnResults).toEqual([
      { isbn: '0262010771' },
      { isbn: '0262510871' },
      { isbn: '1935182641' },
    ]);
    expect(_.pluck(isbnResults, 'isbn'))
      .toEqual(['0262010771', '0262510871', '1935182641']);
  });

  test('should rename', () => {
    expect(fcf.rename({ a: 1, b: 2 }, { a: 'AAA' }))
      .toEqual({ AAA: 1, b: 2 });
  });

  test('should as', () => {
    expect(fcf.as(library, { ed: 'edition' }))
      .toEqual([
        { title: 'SICP', isbn: '0262010771', edition: 1 },
        { title: 'SICP', isbn: '0262510871', edition: 2 },
        { title: 'Joy of Clojure', isbn: '1935182641', edition: 1 },
      ]);
  });

  test('should project(as)', () => {
    expect(fcf.project(fcf.as(library, { ed: 'edition' }), ['edition']))
      .toEqual([{ edition: 1 }, { edition: 2 }, { edition: 1 }]);
  });

  test('should restrict', () => {
    expect(fcf.restrict(library, (book) => book.ed > 1))
      .toEqual([{ title: 'SICP', isbn: '0262510871', ed: 2 }]);
  });
});
