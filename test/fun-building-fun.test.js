import _ from 'underscore';
import {
  invoker, always, checker, validator, hasKeys,
} from '../src/higher-order-fun';
import * as fbf from '../src/fun-building-fun';
import { complement } from '../src/first-class-fun';

describe('function-building functions', () => {
  function div(n, d) { return n / d; }

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

    const songsPlayed = fbf.curry3(_.uniq)(false)(fbf.songToString);
    expect(songsPlayed(plays)).toEqual([
      { artist: 'Burial', track: 'Archangel' },
      { artist: 'Ben Frost', track: 'Stomp' },
      { artist: 'Emeralds', track: 'Snores' },
    ]);
  });

  test('should rgbToHexString', () => {
    expect(fbf.rgbToHexString(255, 255, 255)).toBe('#ffffff');
    const blueGreenish = fbf.curry3(fbf.rgbToHexString)(255)(200);
    expect(blueGreenish(0)).toBe('#00c8ff');
  });

  test('should withinRange', () => {
    const withinRange = checker(
      validator('arg must be greater than 10', fbf.greaterThan(10)),
      validator('arg must be less than 20', fbf.lessThan(20)),
    );

    expect(withinRange(15)).toEqual([]);
    expect(withinRange(1)).toEqual(['arg must be greater than 10']);
    expect(withinRange(100)).toEqual(['arg must be less than 20']);
  });

  test('should partial applications', () => {
    const over10Part1 = fbf.partial1(div, 10);
    expect(over10Part1(5)).toBe(2);

    const div10By2By4By5000 = fbf.partial(div, 10, 2, 4, 5000);
    expect(div10By2By4By5000()).toBe(5);
  });

  test('should sqr', () => {
    function zero(n) { return n === 0; }
    const sqrPre = fbf.condition1(
      validator('arg must not be zero', complement(zero)),
      validator('arg must be a number', _.isNumber),
    );
    expect(sqrPre(_.identity, 10)).toBe(10);
    expect(() => { sqrPre(_.identity, ''); }).toThrow(/number/);
    expect(() => { sqrPre(_.identity, 0); }).toThrow(/zero/);

    function uncheckedSqr(n) { return n * n; }
    expect(uncheckedSqr('')).toBe(0);

    const checkedSqr = fbf.partial1(sqrPre, uncheckedSqr);
    expect(checkedSqr(10)).toBe(100);
    expect(() => checkedSqr('')).toThrow(/number/);
    expect(() => checkedSqr(0)).toThrow(/zero/);

    const sqrPost = fbf.condition1(
      validator('result should be a number', _.isNumber),
      validator('result should not be zero', complement(zero)),
      validator('result should be positive', fbf.greaterThan(0)),
    );
    expect(() => sqrPost(_.identity, 0)).toThrow(/zero/);
    expect(() => sqrPost(_.identity, -1)).toThrow(/positive/);
    expect(() => sqrPost(_.identity, '')).toThrow(/number.*positive/);

    const megaCheckedSqr = _.compose(fbf.partial(sqrPost, _.identity), checkedSqr);
    expect(megaCheckedSqr(10)).toBe(100);
    expect(() => megaCheckedSqr(0)).toThrow(/zero/);
    expect(() => megaCheckedSqr(NaN)).toThrow(/result.*positive/);
  });

  test('should validateCommand', () => {
    const validateCommand = fbf.condition1(
      validator('arg must be a map', _.isObject),
      validator('arg must have the correct keys', hasKeys('msg', 'type')),
    );
    const createCommand = fbf.partial(validateCommand, _.identity);
    expect(() => createCommand({})).toThrow(/keys/);
    expect(() => createCommand(21)).toThrow(/map/);
    expect(createCommand({ msg: '', type: '' })).toEqual({ msg: '', type: '' });
  });
});
