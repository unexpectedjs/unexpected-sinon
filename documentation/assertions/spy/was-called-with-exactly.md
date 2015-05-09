Passes if the spy was called with the provided arguments and no
others.

```js
var spy = sinon.spy();
spy({ foo: 'bar' }, 'baz', 'qux', 'quux');
expect(spy, 'was called with exactly', { foo: 'bar' }, 'baz', sinon.match.truthy, 'quux');
```

In case of a failing expectation you get the following output:

```js
expect(spy, 'was called with exactly', { foo: 'bar' }, 'baz', sinon.match.truthy);
```

```output
expected spy to be called with exact arguments { foo: "bar" }, baz, truthy
    spy({ foo: "bar" }, baz, qux, quux)
```
