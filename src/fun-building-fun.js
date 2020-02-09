import _ from 'underscore';
import { existy } from './intro-to-fun';
import { construct, mapcat, cat } from './first-class-fun';

export function dispatch(...functions) {
  const funs = functions.slice();
  const size = funs.length;

  return function (target, ...args) {
    let ret;
    for (let funIndex = 0; funIndex < size; funIndex += 1) {
      const fun = funs[funIndex];
      ret = fun.apply(fun, construct(target, args));

      if (existy(ret)) return ret;
    }
    return ret;
  };
}

export function stringReverse(s) {
  if (!_.isString(s)) return undefined;
  return s.split('').reverse().join('');
}

export function isa(type, action) {
  return function (obj) {
    if (type === obj.type) return action(obj);
    return undefined;
  };
}

export function rightAwayInvoker(...args) {
  const method = args.shift();
  const target = args.shift();
  return method.apply(target, args);
}

export function curry(fun) {
  return (arg) => fun(arg);
}

export function curry2(fun) {
  return (secondArg) => (firstArg) => fun(firstArg, secondArg);
}

export function songToString(song) {
  return [song.artist, song.track].join('-');
}

export const songCount = curry2(_.countBy)(songToString);

export function curry3(fun) {
  return (last) => (middle) => (first) => fun(first, middle, last);
}

export function toHex(n) {
  const hex = n.toString(16);
  return (hex.length < 2) ? [0, hex].join('') : hex;
}

export function rgbToHexString(r, g, b) {
  return ['#', toHex(r), toHex(g), toHex(b)].join('');
}

export const greaterThan = curry2((lhs, rhs) => lhs > rhs);

export const lessThan = curry2((lhs, rhs) => lhs < rhs);

export function partial1(fun, arg1) {
  return function (...arglist) {
    const args = construct(arg1, arglist);
    return fun(...args);
  };
}

export function partial(fun, ...pargs) {
  return function (...args) {
    const arr = cat(pargs, args);
    return fun(...arr);
  };
}

export function condition1(...vargs) {
  const validators = vargs;
  return function (fun, arg) {
    const errors = mapcat(
      (isValid) => isValid(arg) ? [] : [isValid.message],
      validators,
    );
    if (!_.isEmpty(errors)) throw new Error(errors.join(', '));
    return fun(arg);
  };
}
