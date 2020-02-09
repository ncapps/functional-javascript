import _ from 'underscore';
import { existy } from './intro-to-fun';
import { construct } from './first-class-fun';

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
