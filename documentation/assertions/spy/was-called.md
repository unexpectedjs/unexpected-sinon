Passes if spy was called at least once.

```js
var increment = sinon.spy();
increment(42);
expect(increment, 'was called');
```

In case of a failing expectation you get the following output:

```js
expect(sinon.spy(), 'was called');
```

```output
expected spy was called
```

This assertion can be negated using the `not` flag:

```js
expect(sinon.spy(), 'was not called');
```

In case of a failing expectation you get the following output:

```js
var add = sinon.spy();
add(42, 42);
expect(add, 'was not called');
```

```output
expected spy was not called

[
  spy( 42, 42 ) at theFunction (theFileName:xx:yy) // should be removed
]
```
