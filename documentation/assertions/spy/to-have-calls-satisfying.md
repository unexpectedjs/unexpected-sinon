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
