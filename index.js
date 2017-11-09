/**
 * @file Reduce an array (from left to right) to a single value.
 * @version 2.1.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-reduce-x
 */

'use strict';

var cachedCtrs = require('cached-constructors-x');
var ArrayCtr = cachedCtrs.Array;
var castObject = cachedCtrs.Object;
var nativeReduce = typeof ArrayCtr.prototype.reduce === 'function' && ArrayCtr.prototype.reduce;

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
var isWorking;
if (nativeReduce) {
  var attempt = require('attempt-x');
  isWorking = attempt.call([], nativeReduce, function (acc) {
    return acc;
  }).threw;

  var res;
  if (isWorking) {
    res = attempt.call(castObject('abc'), nativeReduce, function (acc, c) {
      return acc + c;
    }, 'x');

    isWorking = res.threw === false && res.value === 'xabc';
  }

  if (isWorking) {
    res = attempt.call((function () {
      return arguments;
    }(1, 2, 3)), nativeReduce, function (acc, arg) {
      return acc + arg;
    }, 1);

    isWorking = res.threw === false && res.value === 7;
  }

  if (isWorking) {
    res = attempt.call({
      0: 1,
      1: 2,
      3: 3,
      4: 4,
      length: 4
    }, nativeReduce, function (acc, arg) {
      return acc + arg;
    }, 2);

    isWorking = res.threw === false && res.value === 8;
  }

  if (isWorking) {
    var doc = typeof document !== 'undefined' && document;
    if (doc) {
      var fragment = doc.createDocumentFragment();
      var div = doc.createElement('div');
      fragment.appendChild(div);
      res = attempt.call(fragment.childNodes, nativeReduce, function (acc, node) {
        acc[acc.length] = node;
        return acc;
      }, []);

      isWorking = res.threw === false && res.value.length === 1 && res.value[0] === div;
    }
  }

  if (isWorking) {
    // eslint-disable-next-line max-params
    res = attempt.call('ab', nativeReduce, function (_, __, ___, list) {
      return list;
    });

    isWorking = res.threw === false && typeof res.value === 'object';
  }
}

var $reduce;
if (nativeReduce && isWorking) {
  $reduce = function reduce(array, callBack /* , initialValue */) {
    var args = [callBack];
    if (arguments.length > 2) {
      args[1] = arguments[2];
    }

    return nativeReduce.apply(array, args);
  };
} else {
  // Check failure of by-index access of string characters (IE < 9)
  // and failure of `0 in boxedString` (Rhino)
  var splitIfBoxedBug = require('split-if-boxed-bug-x');
  var toLength = require('to-length-x').toLength2018;
  var toObject = require('to-object-x');
  var assertIsFunction = require('assert-is-function-x');

  $reduce = function reduce(array, callBack /* , initialValue*/) {
    var object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    var iterable = splitIfBoxedBug(object);
    var length = toLength(iterable.length);
    var argsLength = arguments.length;
    // no value to return if no initial value and an empty array
    if (length === 0 && argsLength < 3) {
      throw new TypeError('reduce of empty array with no initial value');
    }

    var i = 0;
    var result;
    if (argsLength > 2) {
      result = arguments[2];
    } else {
      do {
        if (i in iterable) {
          result = iterable[i];
          i += 1;
          // eslint-disable-next-line no-restricted-syntax
          break;
        }

        // if array contains no values, no initial value to return
        i += 1;
        if (i >= length) {
          throw new TypeError('reduce of empty array with no initial value');
        }
      } while (true); // eslint-disable-line no-constant-condition
    }

    while (i < length) {
      if (i in iterable) {
        result = callBack(result, iterable[i], i, object);
      }

      i += 1;
    }

    return result;
  };
}

/**
 * This method applies a function against an accumulator and each element in the
 * array (from left to right) to reduce it to a single value.
 *
 * @param {array} array - The array to iterate over.
 * @param {Function} callBack - Function to execute for each element.
 * @param {*} [initialValue] - Value to use as the first argument to the first
 *  call of the callback. If no initial value is supplied, the first element in
 *  the array will be used. Calling reduce on an empty array without an initial
 *  value is an error.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @throws {TypeError} If called on an empty array without an initial value.
 * @returns {*} The value that results from the reduction.
 * @example
 * var reduce = require('array-reduce-x');
 *
 * var sum = reduce([0, 1, 2, 3], function (a, b) {
 *   return a + b;
 * }, 0);
 * // sum is 6
 */
module.exports = $reduce;
