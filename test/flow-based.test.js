import * as fb from '../src/flow-based';

describe('LazyChain', () => {
  test('should terminate a lazy chain', () => {
    expect(new fb.LazyChain([2, 1, 3]).invoke('sort').force())
      .toEqual([1, 2, 3]);
  });

  test('should add more links to the chain', () => {
    expect(new fb.LazyChain([2, 1, 3])
      .invoke('concat', [8, 5, 7, 6])
      .invoke('sort')
      .invoke('join', ' ')
      .force()).toBe('1 2 3 5 6 7 8');
  });
});

describe('pipelining', () => {
  test('should pipeline', () => {
    expect(fb.pipeline()).toBeUndefined();
    expect(fb.pipeline(42)).toBe(42);
    expect(fb.pipeline(42, (n) => -n)).toBe(-42);
  });
});
