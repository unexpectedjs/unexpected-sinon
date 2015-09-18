Passes if the "timeline" of all the calls of a set of spies satisfy a given spec:

```js
var obj = {
    increment: function (n) {
        if (n === 666) {
            throw new Error("No, I won't do that");
        }
        return n + 1;
    },
    decrement: function (n) {
        return n - 1;
    }
};
sinon.spy(obj, 'increment');
sinon.spy(obj, 'decrement');

obj.increment(456);
obj.decrement(987);
obj.increment(123);
obj.decrement(555);
try {
    obj.increment(666);
} catch (e) {}

expect([obj.increment, obj.decrement], 'to have calls satisfying', [
    { spy: obj.increment, args: [ 456 ] },
    obj.decrement,
    obj.increment,
    { spy: obj.decrement, returned: 554 },
    { spy: obj.increment, args: [ 666 ], threw: /^No/ }
]);
```

In case of a failing expectation you get the following output:

```js
expect([obj.increment, obj.decrement], 'to have calls satisfying', [
    { spy: obj.increment, args: [ 123 ] },
    obj.decrement,
    { spy: obj.increment, returned: 557 },
    obj.decrement,
    { spy: obj.increment, args: [ 666 ], threw: { message: expect.it('not to match', /^No/) } }
]);
```

```output
expected [ increment, decrement ] to have calls satisfying
[
  { spy: increment, args: [ 123 ] },
  decrement,
  { spy: increment, returned: 557 },
  decrement,
  {
    spy: increment,
    args: [ 666 ],
    threw: { message: expect.it('not to match', /^No/) }
  }
]

[
  increment(
    456 // should equal 123
  ) at theFunction (theFileName:xx:yy)
  decrement( 987 ) at theFunction (theFileName:xx:yy)
  increment( 123 ) at theFunction (theFileName:xx:yy)
    // returned: expected 124 to equal 557
  decrement( 555 ) at theFunction (theFileName:xx:yy)
  increment( 666 ) at theFunction (theFileName:xx:yy)
    // threw: expected Error('No, I won\'t do that')
    //        to satisfy { message: expect.it('not to match', /^No/) }
    //
    //        {
    //          message: 'No, I won\'t do that' // should not match /^No/
    //                                          //
    //                                          // No, I won't do that
    //                                          // ^^
    //        }
]
```
