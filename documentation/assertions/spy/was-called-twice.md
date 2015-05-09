Passes if spy was called exactly twice.

```js
var increment = sinon.spy();
increment(41);
increment(42);
expect(increment, 'was called twice');
```

In case of a failing expectation you get the following output:

```js
var add = sinon.spy();
add(41, 42);
expect(add, 'was called twice');
```

```output
expected spy to be called twice but was called once
    spy(41, 42)
```
