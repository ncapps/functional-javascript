import _ from 'underscore';
import { existy, fail, doWhen } from './intro-to-fun';
import { cat } from './first-class-fun';

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
    uniqueString(prefix) {
      counter += 1;
      return `${prefix}${counter}`;
    },
  };
}(0));

export function fnull(fun, ...defaults) {
  return function (...args) {
    const safeArgs = _.map(args, (e, i) => existy(e) ? e : defaults[i]);
    return fun(...safeArgs);
  };
}

export function defaults(d) {
  return function (o, k) {
    const val = fnull(_.identity, d[k]);
    return o && val(o[k]);
  };
}

export function doSomething(config) {
  const lookup = defaults({ critical: 108 });
  return lookup(config, 'critical');
}

export function checker(...args) {
  const validators = args.slice();

  return function (obj) {
    return _.reduce(validators, (errs, check) => {
      if (check(obj)) return errs;
      return _.chain(errs).push(check.message).value();
    }, []);
  };
}

export function validator(message, fun) {
  const f = (...args) => fun.apply(fun, args);
  f.message = message;
  return f;
}

export function aMap(obj) {
  return _.isObject(obj);
}

export function hasKeys(...args) {
  const keys = args;
  const fun = function (obj) {
    return _.every(keys, (k) => _.has(obj, k));
  };
  fun.message = cat(['Must have values for keys:'], keys).join(' ');
  return fun;
}
