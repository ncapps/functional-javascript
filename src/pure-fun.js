import _ from 'underscore';
import { partial1 } from './fun-building-fun';
import { repeatedly } from './higher-order-fun';
import { construct } from './first-class-fun';

const rand = partial1(_.random, 1);

export function generateRandomCharacter() {
  return rand(26).toString(36);
}

export function generateString(charGen, len) {
  return repeatedly(len, charGen).join('');
}

export function merge(...args) {
  return _.extend.apply(null, construct({}, args));
}

export class Container {
  constructor(init) {
    this.value = init;
  }

  update(fun, ...args) {
    const oldValue = this.value;
    this.value = fun.apply(this, construct(oldValue, args));
    return this.value;
  }
}
