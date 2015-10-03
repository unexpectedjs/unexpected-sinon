Passes if the "timeline" of all the calls of a set of spies satisfy a given spec:

```js
var noop = sinon.spy().named('noop');

var increment = sinon.spy(function increment(n) {
    if (n === 666) {
        throw new Error("No, I won't do that");
    }
    return n + 1;
});

increment(456);
noop(987);
increment(123);
noop(555);
try {
    increment(666);
} catch (e) {}

expect([noop, increment], 'to have calls satisfying', [
    { spy: increment, args: [ 456 ], returned: 457 },
    noop,
    increment,
    noop,
    { spy: increment, args: [ 666 ], threw: /^No/ }
]);
```

In case of a failing expectation you get the following output:

```js
expect([increment, noop], 'to have calls satisfying', [
    { spy: increment, args: [ 123 ] },
    noop,
    { spy: increment, returned: 557 },
    noop,
    { spy: increment, args: [ 666 ], threw: { message: expect.it('not to match', /^No/) } }
]);
```

```output
expected [ increment, noop ] to have calls satisfying
[
  { spy: increment, args: [ 123 ] },
  noop,
  { spy: increment, returned: 557 },
  noop,
  {
    spy: increment,
    args: [ 666 ],
    threw: { message: expect.it('not to match', ...) }
  }
]

[
  increment(
    456 // should equal 123
  ) at theFunction (theFileName:xx:yy)
  noop( 987 ) at theFunction (theFileName:xx:yy)
  increment( 123 ) at theFunction (theFileName:xx:yy)
    // returned: expected 124 to equal 557
  noop( 555 ) at theFunction (theFileName:xx:yy)
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
