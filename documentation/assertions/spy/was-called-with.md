Passes if the spy was called with the provided arguments.

```js
var spy = sinon.spy();
spy({ foo: 'bar' }, 'baz', 'qux', 'quux');
expect(spy, 'was called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
```

In case of a failing expectation you get the following output:

```js
expect(spy, 'was called with', 'baz', { foo: 'bar' });
```

```output
expected spy to be called with arguments baz, { foo: "bar" }
    spy({ foo: "bar" }, baz, qux, quux)
```
