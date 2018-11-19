const isEmptyObject = obj => (Object.getOwnPropertyNames(obj).length === 0);

const isEmptyArray = array => array.length === 0;

const isPositiveInteger = str => /^\+?(0|[1-9]\d*)$/.test(str);

module.exports = {
  isEmptyObject,
  isEmptyArray,
  isPositiveInteger,
};
