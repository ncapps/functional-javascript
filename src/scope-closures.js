import _ from 'underscore';
import { average } from './first-class-fun';

export function whatWasTheLocal() {
  const captured = 'Oh hai';

  return function () {
    return `The local was: ${captured}`;
  };
}

export function createScaleFunction(factor) {
  return function (v) {
    return _.map(v, (n) => n * factor);
  };
}

export function makeAdder(captured) {
  return function (free) {
    return free + captured;
  };
}

export function averageDamp(fun) {
  return function (n) {
    return average([n, fun(n)]);
  };
}

export function showObject(obj) {
  return function () {
    return obj;
  };
}

export const pingpong = (function pingpong() {
  let pri = 0;

  return {
    inc(n) {
      pri += n;
      return pri;
    },
    dec(n) {
      pri -= n;
      return pri;
    },
  };
}());

export function plucker(field) {
  return function (obj) {
    return (obj && obj[field]);
  };
}
