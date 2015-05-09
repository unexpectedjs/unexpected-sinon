Passes if the spy was always called with the provided arguments.

```js
var spy = sinon.spy();
spy({ foo: 'bar' }, 'baz', 'qux', 'quux');
spy({ foo: 'bar' }, 'baz', 'qux', 'quux');
expect(spy, 'was always called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
```

In case of a failing expectation you get the following output:

```js
spy({ foo: 'bar' }, 'baz');
expect(spy, 'was always called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
```

```output
expected spy to always be called with arguments { foo: "bar" }, baz, truthy
    spy({ foo: "bar" }, baz, qux, quux)
    spy({ foo: "bar" }, baz, qux, quux)
    spy({ foo: "bar" }, baz)
```
