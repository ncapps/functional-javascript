import _ from 'underscore';
import { cat, construct } from './first-class-fun';
import { second } from './intro-to-fun';
import { invoker } from './higher-order-fun';
import { partial1, curry2 } from './fun-building-fun';

export function myLength(ary) {
  if (_.isEmpty(ary)) return 0;
  return 1 + myLength(_.rest(ary));
}

export function cycle(times, ary) {
  if (times <= 0) return [];
  return cat(ary, cycle(times - 1, ary));
}

export function constructPair(pair, rests) {
  return [
    construct(_.first(pair), _.first(rests)),
    construct(second(pair), second(rests)),
  ];
}

export function unzip(pairs) {
  if (_.isEmpty(pairs)) return [[], []];
  return constructPair(_.first(pairs), unzip(_.rest(pairs)));
}

export function nexts(graph, node) {
  if (_.isEmpty(graph)) return [];

  const pair = _.first(graph);
  const from = _.first(pair);
  const to = second(pair);
  const more = _.rest(graph);

  if (_.isEqual(node, from)) {
    return construct(to, nexts(more, node));
  }
  return nexts(more, node);
}

export const rev = invoker('reverse', Array.prototype.reverse);

export function depthSearch(graph, nodes, seen) {
  if (_.isEmpty(nodes)) return rev(seen);

  const node = _.first(nodes);
  const more = _.rest(nodes);

  if (_.contains(seen, node)) {
    return depthSearch(graph, more, seen);
  }
  return depthSearch(
    graph,
    cat(nexts(graph, node), more),
    construct(node, seen),
  );
}

export function andify(...preds) {
  return function (...args) {
    const everything = function eveything(ps, truth) {
      if (_.isEmpty(ps)) {
        return truth;
      }
      return _.every(args, _.first(ps))
        && everything(_.rest(ps), truth);
    };
    return everything(preds, true);
  };
}

export function orify(...preds) {
  return function (...args) {
    const something = function something(ps, truth) {
      if (_.isEmpty(ps)) {
        return truth;
      }
      return _.some(args, _.first(ps))
        || something(_.rest(ps), truth);
    };
    return something(preds, false);
  };
}

export function visit(mapFun, resultFun, array) {
  if (_.isArray(array)) {
    return resultFun(_.map(array, mapFun));
  }
  return resultFun(array);
}

export function postDepth(fun, ary) {
  return visit(partial1(postDepth, fun), fun, ary);
}

export function preDepth(fun, ary) {
  return visit(partial1(preDepth, fun), fun, fun(ary));
}

export function influenceWithStrategy(strategy, lang, graph) {
  const results = [];
  strategy((x) => {
    if (_.isArray(x) && _.first(x) === lang) {
      results.push(second(x));
    }
    return x;
  }, graph);

  return results;
}

export const groupFrom = curry2(_.groupBy)(_.first);

export const groupTo = curry2(_.groupBy)(second);

export function influenced(graph, node) {
  return _.map(groupFrom(graph)[node], second);
}
