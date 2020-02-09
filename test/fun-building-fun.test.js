import _ from 'underscore';
import { invoker, always } from '../src/higher-order-fun';
import * as fbf from '../src/fun-building-fun';

describe('function-building functions', () => {
  test('should dispatch', () => {
    const str = fbf.dispatch(invoker('toString', Array.prototype.toString),
      invoker('toString', String.prototype.toString));
    expect(str('a')).toBe('a');
    expect(str(_.range(5))).toBe('0,1,2,3,4');

    expect(fbf.stringReverse('abc')).toBe('cba');
    expect(fbf.stringReverse(1)).toBeUndefined();
    const rev = fbf.dispatch(invoker('reverse', Array.prototype.reverse),
      fbf.stringReverse);
    expect(rev([1, 2, 3])).toEqual([3, 2, 1]);
    expect(rev('abc')).toBe('cba');

    const sillyReverse = fbf.dispatch(rev, always(42));
    expect(sillyReverse([1, 2, 3])).toEqual([3, 2, 1]);
    expect(sillyReverse('abc')).toEqual('cba');
    expect(sillyReverse(100)).toBe(42);
  });

  test('should performCommand', () => {
    const performCommand = fbf.dispatch(
      fbf.isa('notify', (obj) => obj.message),
      fbf.isa('join', (obj) => obj.target),
      (obj) => obj.type,
    );
    const performAdminCommand = fbf.dispatch(
      fbf.isa('kill', (obj) => obj.hostname),
      performCommand,
    );

    expect(performAdminCommand({ type: 'kill', hostname: 'localhost' }))
      .toBe('localhost');
    expect(performAdminCommand({ type: 'flail' })).toBe('flail');
    expect(performAdminCommand({ type: 'join', target: 'foo' }))
      .toBe('foo');

    const performTrialUserCommand = fbf.dispatch(
      fbf.isa('join', () => 'cannot join until approved'),
      performCommand,
    );
    expect(performTrialUserCommand({ type: 'join', target: 'foo' }))
      .toBe('cannot join until approved');
    expect(performTrialUserCommand({ type: 'notify', message: 'Hi new user' }))
      .toBe('Hi new user');
  });

  test('should rightAwayInvoker', () => {
    expect(fbf.rightAwayInvoker(Array.prototype.reverse, [1, 2, 3]))
      .toEqual([3, 2, 1]);
    expect(invoker('reverse', Array.prototype.reverse)([1, 2, 3]))
      .toEqual([3, 2, 1]);
  });

  test('should curry', () => {
    const eleven = ['11', '11', '11', '11'];
    expect(eleven.map(parseInt)).toEqual([11, NaN, 3, 4]);
    expect(eleven.map(fbf.curry(parseInt))).toEqual([11, 11, 11, 11]);
  });

  test('should curry2', () => {
    function div(n, d) { return n / d; }
    const div10 = fbf.curry2(div)(10);
    expect(div10(50)).toBe(5);
    const parseBinaryString = fbf.curry2(parseInt)(2);
    expect(parseBinaryString('111')).toBe(7);
    expect(parseBinaryString('10')).toBe(2);
  });

  test('should soundCount', () => {
    const plays = [
      { artist: 'Burial', track: 'Archangel' },
      { artist: 'Ben Frost', track: 'Stomp' },
      { artist: 'Ben Frost', track: 'Stomp' },
      { artist: 'Emeralds', track: 'Snores' },
      { artist: 'Burial', track: 'Archangel' },
      { artist: 'Burial', track: 'Archangel' },
    ];

    expect(_.countBy(plays, (song) => [song.artist, song.track].join('-')))
      .toEqual({
        'Ben Frost-Stomp': 2,
        'Burial-Archangel': 3,
        'Emeralds-Snores': 1,
      });

    expect(fbf.songCount(plays)).toEqual({
      'Ben Frost-Stomp': 2,
      'Burial-Archangel': 3,
      'Emeralds-Snores': 1,
    });
  });
});
