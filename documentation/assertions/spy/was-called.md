Passes if spy was called at least once.

```js
var increment = sinon.spy();
increment(42);
expect(increment, 'was called');
```

In case of a failing expectation you get the following output:

```js
expect(sinon.spy().named('mySpy'), 'was called');
```

```output
expected mySpy was called
```

This assertion can be negated using the `not` flag:

```js
expect(sinon.spy(), 'was not called');
```

In case of a failing expectation you get the following output:

```js
var add = sinon.spy().named('add');
add(42, 42);
expect(add, 'was not called');
```

```output
expected add was not called

add( 42, 42 ); at theFunction (theFileName:xx:yy) // should be removed
```
