import attempt from 'attempt-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import toLength from 'to-length-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';
import toBoolean from 'to-boolean-x';
import requireObjectCoercible from 'require-object-coercible-x';

const natRed = [].reduce;
const castObject = {}.constructor;
const nativeReduce = typeof natRed === 'function' && natRed;

const test1 = function test1() {
  return attempt.call([], nativeReduce, function attemptee(acc) {
    return acc;
  }).threw;
};

const test2 = function test2() {
  const res = attempt.call(
    castObject('abc'),
    nativeReduce,
    function attemptee(acc, c) {
      return acc + c;
    },
    'x',
  );

  return res.threw === false && res.value === 'xabc';
};

const test3 = function test3() {
  const res = attempt.call(
    (function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    })(1, 2, 3),
    nativeReduce,
    function attempte(acc, arg) {
      return acc + arg;
    },
    1,
  );

  return res.threw === false && res.value === 7;
};

const test4 = function test4() {
  const res = attempt.call(
    {0: 1, 1: 2, 3: 3, 4: 4, length: 4},
    nativeReduce,
    function attempte(acc, arg) {
      return acc + arg;
    },
    2,
  );

  return res.threw === false && res.value === 8;
};

const test5 = function test5() {
  const doc = typeof document !== 'undefined' && document;

  if (doc) {
    const fragment = doc.createDocumentFragment();
    const div = doc.createElement('div');
    fragment.appendChild(div);

    const atemptee = function attempte(acc, node) {
      acc[acc.length] = node;

      return acc;
    };

    const res = attempt.call(fragment.childNodes, nativeReduce, atemptee, []);

    return res.threw === false && res.value.length === 1 && res.value[0] === div;
  }

  return true;
};

const test6 = function test6() {
  const res = attempt.call('ab', nativeReduce, function attempte() {
    /* eslint-disable-next-line prefer-rest-params */
    return arguments[3];
  });

  return res.threw === false && typeof res.value === 'object';
};

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
const isWorking = toBoolean(nativeReduce) && test1() && test2() && test3() && test4() && test5() && test6();

const patchedReduce = function reduce(array, callBack /* , initialValue */) {
  requireObjectCoercible(array);
  const args = [assertIsFunction(callBack)];

  if (arguments.length > 2) {
    /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
    args[1] = arguments[2];
  }

  return nativeReduce.apply(array, args);
};

const implementation = function reduce(array, callBack /* , initialValue */) {
  const object = toObject(array);
  // If no callback function or if callback is not a callable function
  assertIsFunction(callBack);
  const iterable = splitIfBoxedBug(object);
  const length = toLength(iterable.length);
  const argsLength = arguments.length;

  // no value to return if no initial value and an empty array
  if (length === 0 && argsLength < 3) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  let i = 0;
  let result;

  if (argsLength > 2) {
    /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
    result = arguments[2];
  } else {
    do {
      if (i in iterable) {
        result = iterable[i];
        i += 1;
        break;
      }

      // if array contains no values, no initial value to return
      i += 1;

      if (i >= length) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
    } while (true); /* eslint-disable-line no-constant-condition */
  }

  while (i < length) {
    if (i in iterable) {
      result = callBack(result, iterable[i], i, object);
    }

    i += 1;
  }

  return result;
};

/*
 * This method applies a function against an accumulator and each element in the
 * array (from left to right) to reduce it to a single value.
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to execute for each element.
 * @param {*} [initialValue] - Value to use as the first argument to the first
 *  call of the callback. If no initial value is supplied, the first element in
 *  the array will be used. Calling reduce on an empty array without an initial
 *  value is an error.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @throws {TypeError} If called on an empty array without an initial value.
 * @returns {*} The value that results from the reduction.
 */
const $reduce = isWorking ? patchedReduce : implementation;

export default $reduce;
