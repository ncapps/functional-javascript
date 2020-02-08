import _ from 'underscore';
import { existy, fail, doWhen } from './intro-to-fun';

export function finder(valueFun, bestFun, coll) {
  return _.reduce(coll, (bestVal, current) => {
    const bestValue = valueFun(bestVal);
    const currentValue = valueFun(current);
    return (bestValue === bestFun(bestValue, currentValue)) ? bestVal : current;
  });
}

export function best(fun, coll) {
  return _.reduce(coll, (x, y) => fun(x, y) ? x : y);
}

export function repeat(times, value) {
  return _.map(_.range(times), () => value);
}

export function repeatedly(times, fun) {
  return _.map(_.range(times), fun);
}

export function iterateUntil(fun, check, init) {
  const ret = [];
  let result = fun(init);

  while (check(result)) {
    ret.push(result);
    result = fun(result);
  }

  return ret;
}

export function always(value) {
  return () => value;
}

export function invoker(name, method) {
  return function (target, ...args) {
    if (!existy(target)) fail('Must provide a target');

    const targetMethod = target[name];
    return doWhen((existy(targetMethod) && method === targetMethod),
      () => targetMethod.apply(target, args));
  };
}

export function makeUniqueStringFunction(start) {
  let counter = start;
  return (prefix) => {
    counter += 1;
    return `${prefix}${counter}`;
  };
}

export const omgenerator = (function omgenerator(init) {
  let counter = init;
  return {
    unique(prefix) {
      counter += 1;
      return `${prefix}${counter}`;
    },
  };
}(0));
