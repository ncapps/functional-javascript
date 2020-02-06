import * as sc from '../src/scope-closures';

describe('closure examples', () => {
  test('should report local', () => {
    const reportLocal = sc.whatWasTheLocal();
    expect(reportLocal()).toBe('The local was: Oh hai');
  });

  test('should scale', () => {
    const scale10 = sc.createScaleFunction(10);
    expect(scale10([1, 2, 3])).toEqual([10, 20, 30]);
  });

  test('should adder', () => {
    const add10 = sc.makeAdder(10);
    const add1024 = sc.makeAdder(1024);
    expect(add10(32)).toBe(42);
    expect(add10(98)).toBe(108);
    expect(add1024(11)).toBe(1035);
  });

  test('should averageDampe', () => {
    const averageSq = sc.averageDamp((n) => n * n);
    expect(averageSq(10)).toBe(55);
  });

  test('should showObject', () => {
    const o = { a: 42 };
    const showO = sc.showObject(o);
    expect(showO()).toEqual({ a: 42 });
    o.newField = 108;
    expect(showO()).toEqual({ a: 42, newField: 108 });
  });

  test('should pingpong', () => {
    expect(sc.pingpong.inc(10)).toBe(10);
    expect(sc.pingpong.inc(10)).toBe(20);
    expect(sc.pingpong.dec(7)).toBe(13);
  });
});
