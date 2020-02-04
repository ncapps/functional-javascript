import _ from 'underscore';

export function whatWasTheLocal() {
  const captured = 'Oh hai';

  return function() {
    return `The local was: ${captured}`;
  }
}
