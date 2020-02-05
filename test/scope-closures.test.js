import * as sc from '../src/scope-closures';

describe('closure examples', () => {
  test('should report local', () => {
    const reportLocal = sc.whatWasTheLocal();
    expect(reportLocal()).toBe('The local was: Oh hai');
  });
});
