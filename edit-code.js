var unique = (array) => {
  const container = {};
  return array.filter((e) =>
    container.hasOwnProperty(e) ? false : (container[e] = true)
  );
};

var unique = (array) => array.filter((e, i) => array.indexOf(e) === i);
var unique = (array) => Array.from(new Set(array));
var unique = (array) => [...new Set(array)];

var unique = (array) => {
  array.sort((a, b) => a - b);
  const result = [];
  let pre = 0;
  for (let i = 0; i < array.length; i++) {
    if (!i || array[i] !== array[pre]) {
      result.push(array[i]);
    }
    pre = i;
  }

  return result;
};

var unique = (array) =>
  array.filter((e) => array.indexOf(e) === array.lastIndexOf(e));

var flat = (array) => {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      result = result.concat(flat(array[i]));
    } else {
      result.push(array[i]);
    }
  }

  return result;
};

var flatten = (array) =>
  array.reduce(
    (target, current) =>
      Array.isArray(current) ? target.concat(flatten(current)) : target.concat(current),
    []
  );

var flattenByDeep = (array, deep = 1) => {
  return array.reduce(
    (target, current) =>
      Array.isArray(current) && deep > 1
        ? target.concat(flattenByDeep(current, deep - 1))
        : target.concat(current),
    []
  );
};

var max = array => array.reduce((pre, val) => Math.max(pre, val));

var max = array => Math.max.apply(null, array);
var max = array => Math.max(...array);

Array.prototype.reduceToMap = function(handler) {
  return this.reduce((target, current, index) => {
    target.push(handler.call(this, current, index))
  }, []);
}

Array.prototype.reduceToFilter = function (handler) {
  return this.reduce((target, current, index) => {
    if (handler.call(this, current, index)) {
      target.push(current);
    }

    return target;
  }, []);
}
