'use strict';

var reduce;
if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');
  if (typeof JSON === 'undefined') {
    JSON = {};
  }
  require('json3').runInContext(null, JSON);
  require('es6-shim');
  var es7 = require('es7-shim');
  Object.keys(es7).forEach(function (key) {
    var obj = es7[key];
    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  reduce = require('../../index.js');
} else {
  reduce = returnExports;
}

var createArrayLike = function (arr) {
  var o = {};
  arr.forEach(function (e, i) {
    o[i] = e;
  });

  o.length = arr.length;
  return o;
};

describe('reduce', function () {
  var testSubject;

  beforeEach(function () {
    testSubject = [
      1,
      2,
      3
    ];
  });

  it('is a function', function () {
    expect(typeof reduce).toBe('function');
  });

  it('should throw when array is null or undefined', function () {
    expect(function () {
      reduce();
    }).toThrow();

    expect(function () {
      reduce(void 0);
    }).toThrow();

    expect(function () {
      reduce(null);
    }).toThrow();
  });

  describe('Array', function () {
    it('should pass the correct arguments to the callback', function () {
      var spy = jasmine.createSpy().andReturn(0);
      reduce(testSubject, spy);
      expect(spy.calls[0].args).toEqual([
        1,
        2,
        1,
        testSubject
      ]);
    });

    it('should start with the right initialValue', function () {
      var spy = jasmine.createSpy().andReturn(0);
      reduce(testSubject, spy, 0);
      expect(spy.calls[0].args).toEqual([
        0,
        1,
        0,
        testSubject
      ]);
    });

    it('should not affect elements added to the array after it has begun', function () {
      var arr = [
        1,
        2,
        3
      ];

      var i = 0;
      reduce(arr, function (a, b) {
        i += 1;
        if (i <= 4) {
          arr.push(a + 3);
        }
        return b;
      });

      expect(arr).toEqual([
        1,
        2,
        3,
        4,
        5
      ]);

      expect(i).toBe(2);
    });

    it('should work as expected for empty arrays', function () {
      var spy = jasmine.createSpy();
      expect(function () {
        reduce([], spy);
      }).toThrow();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should throw correctly if no callback is given', function () {
      expect(function () {
        reduce(testSubject);
      }).toThrow();
    });

    it('should return the expected result', function () {
      expect(reduce(testSubject, function (a, b) {
        return String(a || '') + String(b || '');
      })).toBe(testSubject.join(''));
    });

    it('should not directly affect the passed array', function () {
      var copy = testSubject.slice();
      reduce(testSubject, function (a, b) {
        return a + b;
      });

      expect(testSubject).toEqual(copy);
    });

    it('should skip non-set values', function () {
      delete testSubject[1];
      var visited = {};
      reduce(testSubject, function (a, b) {
        if (a) {
          visited[a] = true;
        }

        if (b) {
          visited[b] = true;
        }

        return 0;
      });

      expect(visited).toEqual({ 1: true, 3: true });
    });
  });

  describe('Array-like objects', function () {
    var testObject;

    beforeEach(function () {
      testObject = createArrayLike(testSubject);
    });

    it('should pass the correct arguments to the callback', function () {
      var spy = jasmine.createSpy().andReturn(0);
      reduce(testObject, spy);
      expect(spy.calls[0].args).toEqual([
        1,
        2,
        1,
        testObject
      ]);
    });

    it('should start with the right initialValue', function () {
      var spy = jasmine.createSpy().andReturn(0);
      reduce(testObject, spy, 0);
      expect(spy.calls[0].args).toEqual([
        0,
        1,
        0,
        testObject
      ]);
    });

    it('should not affect elements added to the array after it has begun', function () {
      var arr = createArrayLike([
        1,
        2,
        3
      ]);

      var i = 0;
      reduce(arr, function (a, b) {
        i += 1;
        if (i <= 4) {
          arr[i + 2] = a + 3;
        }

        return b;
      });

      expect(arr).toEqual({
        0: 1,
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        length: 3
      });

      expect(i).toBe(2);
    });

    it('should work as expected for empty arrays', function () {
      var spy = jasmine.createSpy();
      expect(function () {
        reduce({ length: 0 }, spy);
      }).toThrow();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should throw correctly if no callback is given', function () {
      expect(function () {
        reduce(testObject);
      }).toThrow();
    });

    it('should return the expected result', function () {
      expect(reduce(testObject, function (a, b) {
        return String(a || '') + String(b || '');
      })).toBe('123');
    });

    it('should not directly affect the passed array', function () {
      var copy = createArrayLike(testSubject);
      reduce(testObject, function (a, b) {
        return a + b;
      });

      expect(testObject).toEqual(copy);
    });

    it('should skip non-set values', function () {
      delete testObject[1];
      var visited = {};
      reduce(testObject, function (a, b) {
        if (a) {
          visited[a] = true;
        }

        if (b) {
          visited[b] = true;
        }

        return 0;
      });

      expect(visited).toEqual({ 1: true, 3: true });
    });
  });

  it('should have a boxed object as list argument of callback', function () {
    var actual;
    // eslint-disable-next-line max-params
    reduce('foo', function (accumulator, item, index, list) {
      actual = list;
    });

    expect(typeof actual).toBe('object');
    expect(Object.prototype.toString.call(actual)).toBe('[object String]');
  });

});
