import _ from 'underscore';

export function existy(x) { return x != null; }

export function truthy(x) { return (x !== false) && existy(x); }

function fail(thing) {
  throw new Error(thing);
}

function warn(thing) {
  console.log(`WARNING: ${thing}`);
}

function note(thing) {
  console.log(`NOTE: ${thing}`);
}

export function splat(fun) {
  return function (array) {
    return fun(...array);
  };
}

export function unsplat(fun) {
  return function (...args) {
    return fun.call(null, Array.from([...args]));
  };
}

export function parseAge(age) {
  if (!_.isString(age)) fail('Expecting a string');
  note('Attempting to parse an age');
  let a = parseInt(age, 10);
  if (_.isNaN(a)) {
    warn(`Could not parse age ${age}`);
    a = 0;
  }
  return a;
}

export function naiveNth(a, index) {
  return a[index];
}

export function isIndexed(data) {
  return _.isArray(data) || _.isString(data);
}

export function nth(a, index) {
  if (!_.isNumber(index)) fail('Expected a number as the index');
  if (!isIndexed(a)) fail('Not supported on non-indexed type');
  if ((index < 0) || (index > a.length - 1)) fail('Index value is out of bounds');

  return a[index];
}

export function second(a) {
  return nth(a, 1);
}

export function lessOrEqual(x, y) {
  return x <= y;
}

export function comparator(pred) {
  return function (x, y) {
    if (truthy(pred(x, y))) return -1;
    if (truthy(pred(y, x))) return 1;
    return 0;
  };
}

export function lameCSV(str) {
  return _.reduce(str.split('\n'), (table, row) => {
    table.push(_.map(row.split(','), (c) => c.trim()));
    return table;
  }, []);
}

export function selectNames(table) {
  return _.rest(_.map(table, _.first));
}

export function selectAges(table) {
  return _.rest(_.map(table, second));
}

export function selectHairColor(table) {
  return _.rest(_.map(table, (row) => nth(row, 2)));
}

export function mergeResults(...arrays) {
  return _.zip(...arrays);
}

export function doWhen(cond, action) {
  if (truthy(cond)) return action();
  return undefined;
}

export function executeIfHasField(target, name) {
  return doWhen(existy(target[name]), () => _.result(target, name));
}
