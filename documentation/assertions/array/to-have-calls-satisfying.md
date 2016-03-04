Passes if the "timeline" of all the calls of a set of spies [satisfies](http://unexpected.js.org/assertions/any/to-satisfy/) a given spec:

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

increment(
  456 // should equal 123
); at theFunction (theFileName:xx:yy)
noop( 987 ); at theFunction (theFileName:xx:yy)
increment( 123 ); at theFunction (theFileName:xx:yy)
  // returned: expected 124 to equal 557
noop( 555 ); at theFunction (theFileName:xx:yy)
increment( 666 ); at theFunction (theFileName:xx:yy)
  // threw: expected Error('No, I won\'t do that')
  //        to satisfy { message: expect.it('not to match', /^No/) }
  //
  //        {
  //          message:
  //            'No, I won\'t do that' // should not match /^No/
  //                                   //
  //                                   // No, I won't do that
  //                                   // ^^
  //        }
```

Note that the individual arguments are matched with
[`to satisfy`](http://unexpected.js.org/assertions/any/to-satisfy/)
semantics, which means that objects are allowed to have more properties than you
specify, so the following passes:

```js
var mySpy = sinon.spy().named('mySpy');
mySpy({foo: 123, bar: 456});
expect([ mySpy ], 'to have calls satisfying', [
    { args: [ { foo: 123 } ] }
]);
```

If that's not what you want, consider using the `exhaustively` flag:

```js
expect([ mySpy ], 'to have calls exhaustively satisfying', [
    { args: [ { foo: 123 } ] }
]);
```

```output
expected [ mySpy ] to have calls exhaustively satisfying [ { args: [ ... ] } ]

mySpy(
  {
    foo: 123,
    bar: 456 // should be removed
  }
); at theFunction (theFileName:xx:yy)
```

If you only care about certain call numbers, you can specify an object with
numerical properties:

```js
var foo = sinon.spy().named('foo');
foo(1);
foo(2);

expect(foo, 'to have calls satisfying', {
    1: [ 3 ]
});
```

```output
expected foo to have calls satisfying { 1: [ 3 ] }

foo( 1 ); at theFunction (theFileName:xx:yy)
foo(
  2 // should equal 3
); at theFunction (theFileName:xx:yy)
```

You can also specify expected calls as a function that performs them:

```js
var spy1 = sinon.spy().named('spy1');
var spy2 = sinon.spy().named('spy2');

spy1(123);
spy2(456);
spy1(false);
spy2(789);

expect([ spy1, spy2 ], 'to have calls satisfying', function () {
    spy1(123);
    spy2(456);
    spy1(expect.it('to be a string'));
    spy2(789);
});
```

```output
expected [ spy1, spy2 ] to have calls satisfying
spy1( 123 );
spy2( 456 );
spy1( expect.it('to be a string') );
spy2( 789 );

spy1( 123 ); at theFunction (theFileName:xx:yy)
spy2( 456 ); at theFunction (theFileName:xx:yy)
spy1(
  false // should be a string
); at theFunction (theFileName:xx:yy)
spy2( 789 ); at theFunction (theFileName:xx:yy)
```
