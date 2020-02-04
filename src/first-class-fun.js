import _ from 'underscore';
import { existy, truthy } from './intro-to-fun';

export function doubleAll(array) {
  return _.map(array, (n) => n * 2);
}

export function average(array) {
  const sum = _.reduce(array, (a, b) => a + b);
  return sum / _.size(array);
}

export function onlyEven(array) {
  return _.filter(array, (n) => (n % 2) === 0);
}

export function allOf(...args) {
  return _.reduceRight(args, (truth, f) => truth && f(), true);
}

export function anyOf(...args) {
  return _.reduceRight(args, (truth, f) => truth || f(), false);
}

export function complement(pred) {
  return function (...args) {
    return !pred(...args);
  };
}

export function cat(...args) {
  const head = _.first(args);
  if (existy(head)) return head.concat(..._.rest(args));
  return [];
}

export function construct(head, tail) {
  return cat([head], _.toArray(tail));
}

export function mapcat(fun, coll) {
  return cat(..._.map(coll, fun));
}

export function butLast(coll) {
  return _.toArray(coll).slice(0, -1);
}

export function interpose(inter, coll) {
  return butLast(mapcat((e) => construct(e, [inter]), coll));
}

export function project(table, keys) {
  return _.map(table, (obj) => _.pick(...construct(obj, keys)));
}

export function rename(obj, newNames) {
  return _.reduce(newNames, (o, nu, old) => {
    if (_.has(obj, old)) {
      const newO = { ...o };
      newO[nu] = obj[old];
      return newO;
    }
    return o;
  }, _.omit(...construct(obj, _.keys(newNames))));
}

export function as(table, newNames) {
  return _.map(table, (obj) => rename(obj, newNames));
}

export function restrict(table, pred) {
  return _.reduce(table, (newTable, obj) => {
    if (truthy(pred(obj))) return newTable;
    return _.without(newTable, obj);
  }, table);
}
