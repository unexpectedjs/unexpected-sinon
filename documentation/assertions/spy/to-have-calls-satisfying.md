Passes if all the calls of a spy satisfy a given spec:

```js
var increment = sinon.spy(function increment(n) {
    return n + 1;
});
increment(42);
increment(46);
expect(increment, 'to have calls satisfying', [
    { args: [ 42 ] },
    { args: [ 46 ], returned: 47 }
]);
```

In case of a failing expectation you get the following output:

```js
var increment = sinon.spy().named('increment');
increment(42);
increment(46, 'yadda');

expect(increment, 'to have calls satisfying', [
    { args: [ 42 ] },
    { args: [ 20 ] }
]);
```

```output
expected increment to have calls satisfying [ { args: [ 42 ] }, { args: [ 20 ] } ]

[
  increment( 42 ) at theFunction (theFileName:xx:yy)
  increment(
    46, // should equal 20
    'yadda' // should be removed
  ) at theFunction (theFileName:xx:yy)
]
```

You can also specify expected calls as a function that performs them:

```js
var increment = sinon.spy().named('increment');
increment(1);
increment(2);
increment(3);

expect(increment, 'to have calls satisfying', function () {
    increment(1);
    increment(expect.it('to be a number'));
});
```

```output
expected increment to have calls satisfying
[
  increment( 1 )
  increment( expect.it('to be a number') )
]

[
  increment( 1 ) at theFunction (theFileName:xx:yy)
  increment( 2 ) at theFunction (theFileName:xx:yy)
  increment( 3 ) at theFunction (theFileName:xx:yy) // should be removed
]
```
