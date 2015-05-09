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
expected spy to have been called at least once but was never called
```
