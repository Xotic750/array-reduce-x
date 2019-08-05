import $reduce, {implementation} from '../src/array-reduce-x';

const createArrayLike = function(arr) {
  const o = {};
  arr.forEach(function(e, i) {
    o[i] = e;
  });

  o.length = arr.length;

  return o;
};

[implementation, $reduce].forEach((reduce, testNum) => {
  describe(`reduce ${testNum}`, function() {
    let testSubject;

    beforeEach(function() {
      testSubject = [1, 2, 3];
    });

    it('is a function', function() {
      expect.assertions(1);
      expect(typeof reduce).toBe('function');
    });

    it('should throw when array is null or undefined', function() {
      expect.assertions(3);
      expect(function() {
        reduce();
      }).toThrowErrorMatchingSnapshot();

      expect(function() {
        reduce(void 0);
      }).toThrowErrorMatchingSnapshot();

      expect(function() {
        reduce(null);
      }).toThrowErrorMatchingSnapshot();
    });

    describe('array', function() {
      it('should pass the correct arguments to the callback', function() {
        expect.assertions(1);
        const spy = jest.fn().mockReturnValue(0);
        reduce(testSubject, spy);
        expect(spy).toHaveBeenCalledWith(1, 2, 1, testSubject);
      });

      it('should start with the right initialValue', function() {
        expect.assertions(1);
        const spy = jest.fn().mockReturnValue(0);
        reduce(testSubject, spy, 0);
        expect(spy).toHaveBeenCalledWith(0, 1, 0, testSubject);
      });

      it('should not affect elements added to the array after it has begun', function() {
        expect.assertions(2);
        const arr = [1, 2, 3];

        let i = 0;
        reduce(arr, function(a, b) {
          i += 1;

          if (i <= 4) {
            arr.push(a + 3);
          }

          return b;
        });

        expect(arr).toStrictEqual([1, 2, 3, 4, 5]);

        expect(i).toBe(2);
      });

      it('should work as expected for empty arrays', function() {
        expect.assertions(2);
        const spy = jest.fn();
        expect(function() {
          reduce([], spy);
        }).toThrowErrorMatchingSnapshot();

        expect(spy).not.toHaveBeenCalled();
      });

      it('should throw correctly if no callback is given', function() {
        expect.assertions(1);
        expect(function() {
          reduce(testSubject);
        }).toThrowErrorMatchingSnapshot();
      });

      it('should return the expected result', function() {
        expect.assertions(1);
        expect(
          reduce(testSubject, function(a, b) {
            return String(a || '') + String(b || '');
          }),
        ).toBe(testSubject.join(''));
      });

      it('should not directly affect the passed array', function() {
        expect.assertions(1);
        const copy = testSubject.slice();
        reduce(testSubject, function(a, b) {
          return a + b;
        });

        expect(testSubject).toStrictEqual(copy);
      });

      it('should skip non-set values', function() {
        expect.assertions(1);
        delete testSubject[1];
        const visited = {};
        reduce(testSubject, function(a, b) {
          if (a) {
            visited[a] = true;
          }

          if (b) {
            visited[b] = true;
          }

          return 0;
        });

        expect(visited).toStrictEqual({1: true, 3: true});
      });
    });

    describe('array-like objects', function() {
      let testObject;

      beforeEach(function() {
        testObject = createArrayLike(testSubject);
      });

      it('should pass the correct arguments to the callback', function() {
        expect.assertions(1);
        const spy = jest.fn().mockReturnValue(0);
        reduce(testObject, spy);
        expect(spy).toHaveBeenCalledWith(1, 2, 1, testObject);
      });

      it('should start with the right initialValue', function() {
        expect.assertions(1);
        const spy = jest.fn().mockReturnValue(0);
        reduce(testObject, spy, 0);
        expect(spy).toHaveBeenCalledWith(0, 1, 0, testObject);
      });

      it('should not affect elements added to the array after it has begun', function() {
        expect.assertions(2);
        const arr = createArrayLike([1, 2, 3]);

        let i = 0;
        reduce(arr, function(a, b) {
          i += 1;

          if (i <= 4) {
            arr[i + 2] = a + 3;
          }

          return b;
        });

        expect(arr).toStrictEqual({
          0: 1,
          1: 2,
          2: 3,
          3: 4,
          4: 5,
          length: 3,
        });

        expect(i).toBe(2);
      });

      it('should work as expected for empty arrays', function() {
        expect.assertions(2);
        const spy = jest.fn();
        expect(function() {
          reduce({length: 0}, spy);
        }).toThrowErrorMatchingSnapshot();

        expect(spy).not.toHaveBeenCalled();
      });

      it('should throw correctly if no callback is given', function() {
        expect.assertions(1);
        expect(function() {
          reduce(testObject);
        }).toThrowErrorMatchingSnapshot();
      });

      it('should return the expected result', function() {
        expect.assertions(1);
        expect(
          reduce(testObject, function(a, b) {
            return String(a || '') + String(b || '');
          }),
        ).toBe('123');
      });

      it('should not directly affect the passed array', function() {
        expect.assertions(1);
        const copy = createArrayLike(testSubject);
        reduce(testObject, function(a, b) {
          return a + b;
        });

        expect(testObject).toStrictEqual(copy);
      });

      it('should skip non-set values', function() {
        expect.assertions(1);
        delete testObject[1];
        const visited = {};
        reduce(testObject, function(a, b) {
          if (a) {
            visited[a] = true;
          }

          if (b) {
            visited[b] = true;
          }

          return 0;
        });

        expect(visited).toStrictEqual({1: true, 3: true});
      });
    });

    it('should have a boxed object as list argument of callback', function() {
      expect.assertions(2);

      let actual = void 0;
      reduce('foo', function(accumulator, item, index, list) {
        actual = list;
      });

      expect(typeof actual).toBe('object');
      expect(Object.prototype.toString.call(actual)).toBe('[object String]');
    });
  });
});
