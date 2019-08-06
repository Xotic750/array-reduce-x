<a
  href="https://travis-ci.org/Xotic750/array-reduce-x"
  title="Travis status">
<img
  src="https://travis-ci.org/Xotic750/array-reduce-x.svg?branch=master"
  alt="Travis status" height="18">
</a>
<a
  href="https://david-dm.org/Xotic750/array-reduce-x"
  title="Dependency status">
<img src="https://david-dm.org/Xotic750/array-reduce-x/status.svg"
  alt="Dependency status" height="18"/>
</a>
<a
  href="https://david-dm.org/Xotic750/array-reduce-x?type=dev"
  title="devDependency status">
<img src="https://david-dm.org/Xotic750/array-reduce-x/dev-status.svg"
  alt="devDependency status" height="18"/>
</a>
<a
  href="https://badge.fury.io/js/array-reduce-x"
  title="npm version">
<img src="https://badge.fury.io/js/array-reduce-x.svg"
  alt="npm version" height="18">
</a>
<a
  href="https://www.jsdelivr.com/package/npm/array-reduce-x"
  title="jsDelivr hits">
<img src="https://data.jsdelivr.com/v1/package/npm/array-reduce-x/badge?style=rounded"
  alt="jsDelivr hits" height="18">
</a>
<a
  href="https://bettercodehub.com/results/Xotic750/array-reduce-x"
  title="bettercodehub score">
<img src="https://bettercodehub.com/edge/badge/Xotic750/array-reduce-x?branch=master"
  alt="bettercodehub score" height="18">
</a>
<a
  href="https://coveralls.io/github/Xotic750/array-reduce-x?branch=master"
  title="Coverage Status">
<img src="https://coveralls.io/repos/github/Xotic750/array-reduce-x/badge.svg?branch=master"
  alt="Coverage Status" height="18">
</a>

<a name="module_array-reduce-x"></a>

## array-reduce-x

Reduce an array (from left to right) to a single value.

<a name="exp_module_array-reduce-x--module.exports"></a>

### `module.exports` ⇒ <code>\*</code> ⏏

This method applies a function against an accumulator and each element in the
array (from left to right) to reduce it to a single value.

**Kind**: Exported member  
**Returns**: <code>\*</code> - The value that results from the reduction.  
**Throws**:

- <code>TypeError</code> If array is null or undefined.
- <code>TypeError</code> If callBack is not a function.
- <code>TypeError</code> If called on an empty array without an initial value.

| Param          | Type                  | Description                                                                                                                                                                                                                |
| -------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| array          | <code>array</code>    | The array to iterate over.                                                                                                                                                                                                 |
| callBack       | <code>function</code> | Function to execute for each element.                                                                                                                                                                                      |
| [initialValue] | <code>\*</code>       | Value to use as the first argument to the first call of the callback. If no initial value is supplied, the first element in the array will be used. Calling reduce on an empty array without an initial value is an error. |

**Example**

```js
import reduce from 'array-reduce-x';

console.log(
  reduce(
    [0, 1, 2, 3],
    function(a, b) {
      return a + b;
    },
    0,
  ),
); // sum is 6
```
