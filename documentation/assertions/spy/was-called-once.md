Passes if spy was called at least once.

```js
var increment = sinon.spy();
increment(42);
expect(increment, 'was called once');
```

In case of a failing expectation you get the following output:

```js
expect(sinon.spy(), 'was called once');
```

```output
expected spy to be called once but was called 0 times
```
