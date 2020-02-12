import _ from 'underscore';

export class LazyChain {
  constructor(obj) {
    this.calls = [];
    this.target = obj;
  }

  invoke(methodName, ...args) {
    this.calls.push((target) => {
      const meth = target[methodName];
      return meth.apply(target, args);
    });

    return this;
  }

  force() {
    return _.reduce(this.calls, (target, thunk) => thunk(target), this.target);
  }

  tap(fun) {
    this.calls.push((target) => {
      fun(target);
      return target;
    });

    return this;
  }
}

export function pipeline(seed, ...args) {
  return _.reduce(args, (l, r) => r(l), seed);
}
