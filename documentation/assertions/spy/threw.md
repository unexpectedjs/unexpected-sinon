Passes if the spy threw the given exception.

The exception can be a string denoting its type, or an actual
object. If only one argument is provided, the assertion passes if the
spy ever threw any exception.

```js
var stub = sinon.stub();
var error = new TypeError('wat');
stub.throws(error);
try { stub(); } catch (e) {}

expect(stub, 'threw');
expect(stub, 'threw', 'TypeError');
expect(stub, 'threw', error);
```

In case of a failing expectation you get the following output:

```js
expect(sinon.spy(), 'threw', 'SyntaxError');
```

```output
spy did not throw exception
```

You can make this assertion more strict using the `always` flag. Then
it passes if the spy always threw the given exception.

```js
var stub = sinon.stub();
var error = new TypeError('wat');
stub.throws(error);
try { stub(); } catch (e) {}

expect(stub, 'always threw');
expect(stub, 'always threw', 'TypeError');
expect(stub, 'always threw', error);
```

In case of a failing expectation you get the following output:

```js
stub.throws(new SyntaxError('waat'));
try { stub(); } catch (e) {}

expect(stub, 'always threw', 'TypeError');
```

```output
stub did not always throw exception
    stub() !TypeError(wat)
    stub() !SyntaxError(waat)
```
