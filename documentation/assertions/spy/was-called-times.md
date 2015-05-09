Passes if the spy was called exactly the specified number of times.

```js
var increment = sinon.spy();
increment(41);
increment(42);
increment(43);
expect(increment, 'was called times', 3);
```

In case of a failing expectation you get the following output:

```js
var add = sinon.spy();
add(41, 42);
add(41, 43);
add(41, 44);
add(41, 45);
expect(add, 'was called times', 2);
```

```output
expected spy to be called twice but was called 4 times
    spy(41, 42)
    spy(41, 43)
    spy(41, 44)
    spy(41, 45)
```
