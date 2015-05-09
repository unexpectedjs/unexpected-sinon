Passes if spy was never called.

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
expected spy to not have been called but was called once
    spy(42, 42)
```
