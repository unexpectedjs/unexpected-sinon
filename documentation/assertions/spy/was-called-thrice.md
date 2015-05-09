Passes if spy was called exactly three times.

```js
var increment = sinon.spy();
increment(41);
increment(42);
increment(43);
expect(increment, 'was called thrice');
```

In case of a failing expectation you get the following output:

```js
var add = sinon.spy();
add(41, 42);
add(41, 43);
add(41, 44);
add(41, 45);
expect(add, 'was called thrice');
```

```output
expected spy to be called thrice but was called 4 times
    spy(41, 42)
    spy(41, 43)
    spy(41, 44)
    spy(41, 45)
```
