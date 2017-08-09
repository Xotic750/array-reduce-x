/**
 * @file Reduce an array (from left to right) to a single value.
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-reduce-x
 */

'use strict';

var nativeReduce = Array.prototype.reduce;

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
var reduceCoercesToObject = false;
if (nativeReduce) {
  try {
    // eslint-disable-next-line max-params
    reduceCoercesToObject = typeof nativeReduce.call('es5', function (_, __, ___, list) {
      return list;
    }) === 'object';
  } catch (ignore) {
    nativeReduce = null;
  }
}

var $reduce;
if (nativeReduce && reduceCoercesToObject) {
  $reduce = function reduce(array, callBack /* , initialValue */) {
    var args = [callBack];
    if (arguments.length > 2) {
      args.push(arguments[2]);
    }

    return nativeReduce.apply(array, args);
  };
} else {
  // Check failure of by-index access of string characters (IE < 9)
  // and failure of `0 in boxedString` (Rhino)
  var boxedString = Object('a');
  var splitString = boxedString[0] !== 'a' || (0 in boxedString) === false;
  var toObject = require('to-object-x');
  var assertIsFunction = require('assert-is-function-x');
  var isString = require('is-string');
  var toLength = require('to-length-x');
  var errMsg = 'reduce of empty array with no initial value';
  $reduce = function reduce(array, callBack /* , initialValue*/) {
    var object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    var iterable = splitString && isString(object) ? object.split('') : object;
    var length = toLength(iterable.length);
    // no value to return if no initial value and an empty array
    if (length === 0 && arguments.length === 2) {
      throw new TypeError(errMsg);
    }

    var i = 0;
    var result;
    if (arguments.length > 2) {
      result = arguments[2];
    } else {
      // eslint-disable-next-line no-constant-condition
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
          throw new TypeError(errMsg);
        }
      } while (true);
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
 * @return {*} The value that results from the reduction.
 * @example
 * var reduce = require('array-reduce-x');
 *
 * var sum = reduce([0, 1, 2, 3], function (a, b) {
 *   return a + b;
 * }, 0);
 * // sum is 6
 */
module.exports = $reduce;
