import _ from 'underscore';
import * as r from '../src/recursion';
import { construct, complement } from '../src/first-class-fun';

describe('recursion examples', () => {
  const influences = [
    ['Lisp', 'Smalltalk'],
    ['Lisp', 'Scheme'],
    ['Smalltalk', 'Self'],
    ['Scheme', 'JavaScript'],
    ['Scheme', 'Lua'],
    ['Self', 'Lua'],
    ['Self', 'JavaScript'],
  ];

  test('should myLength', () => {
    expect(r.myLength(_.range(10))).toBe(10);
    expect(r.myLength([])).toBe(0);
    expect(r.myLength(_.range(1000))).toBe(1000);

    const a = _.range(10);
    expect(r.myLength(a)).toBe(10);
    expect(a).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('should cycle', () => {
    expect(r.cycle(2, [1, 2, 3])).toEqual([1, 2, 3, 1, 2, 3]);
    expect(_.take(r.cycle(20, [1, 2, 3]), 11))
      .toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2]);
  });

  test('should unzip', () => {
    expect(r.constructPair(['a', 1], [[], []])).toEqual([['a'], [1]]);
    expect(_.zip([1, 2, 3], [4, 5, 6])).toEqual([[1, 4], [2, 5], [3, 6]]);
    expect(r.unzip(_.zip([1, 2, 3], [4, 5, 6]))).toEqual([[1, 2, 3], [4, 5, 6]]);
  });

  test('should graph walk', () => {
    expect(r.nexts(influences, 'Lisp')).toEqual(['Smalltalk', 'Scheme']);

    expect(r.depthSearch(influences, ['Lisp'], []))
      .toEqual(['Lisp', 'Smalltalk', 'Self', 'Lua', 'JavaScript', 'Scheme']);
    expect(r.depthSearch(influences, ['Smalltalk', 'Self'], []))
      .toEqual(['Smalltalk', 'Self', 'Lua', 'JavaScript']);
    expect(r.depthSearch(construct(['Lua', 'Io'], influences), ['Lisp'], []))
      .toEqual(['Lisp', 'Smalltalk', 'Self', 'Lua', 'Io', 'JavaScript', 'Scheme']);
  });

  test('should conjoin and disjoin', () => {
    function isEven(n) { return n % 2 === 0; }
    const evenNums = r.andify(_.isNumber, isEven);
    expect(evenNums(1, 2)).toBeFalsy();
    expect(evenNums(2, 4, 6, 8)).toBeTruthy();
    expect(evenNums(1, 4, 6, 8, 9)).toBeFalsy();

    const isOdd = complement(isEven);
    function zero(n) { return n === 0; }
    const zeroOrOdd = r.orify(isOdd, zero);
    expect(zeroOrOdd()).toBeFalsy();
    expect(zeroOrOdd(0, 2, 4, 6)).toBeTruthy();
    expect(zeroOrOdd(2, 4, 6)).toBeFalsy();
    expect(zeroOrOdd(1, 2, 3)).toBeTruthy();
  });

  test('should visit', () => {
    expect(r.visit(_.identity, _.isNumber, 42)).toBeTruthy();
    expect(r.visit(_.isNumber, _.identity, [1, 2, null, 3]))
      .toEqual([true, true, false, true]);
    expect(r.visit((n) => n * 2, r.rev, _.range(10)))
      .toEqual([18, 16, 14, 12, 10, 8, 6, 4, 2, 0]);
  });

  test('should postDepth', () => {
    expect(r.postDepth(_.identity, influences))
      .toEqual([
        ['Lisp', 'Smalltalk'],
        ['Lisp', 'Scheme'],
        ['Smalltalk', 'Self'],
        ['Scheme', 'JavaScript'],
        ['Scheme', 'Lua'],
        ['Self', 'Lua'],
        ['Self', 'JavaScript'],
      ]);

    expect(r.postDepth((x) => {
      if (x === 'Lisp') {
        return 'LISP';
      }
      return x;
    }, influences))
      .toEqual([
        ['LISP', 'Smalltalk'],
        ['LISP', 'Scheme'],
        ['Smalltalk', 'Self'],
        ['Scheme', 'JavaScript'],
        ['Scheme', 'Lua'],
        ['Self', 'Lua'],
        ['Self', 'JavaScript'],
      ]);
  });

  test('should influenceWithStrategy', () => {
    expect(r.influenceWithStrategy(r.postDepth, 'Lisp', influences))
      .toEqual(['Smalltalk', 'Scheme']);
  });

  test('should influenced', () => {
    expect(r.influenced(influences, 'Lisp'))
      .toEqual(['Smalltalk', 'Scheme']);
  });
});
