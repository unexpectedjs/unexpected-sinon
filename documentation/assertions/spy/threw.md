Passes if the spy threw the given exception.

The exception can be a string denoting its type, or an actual
object. If only one argument is provided, the assertion passes if the
spy ever threw any exception.

```js
var stub = sinon.stub().named('myStub');
var error = new TypeError('wat');
stub.throws(error);
try { stub(); } catch (e) {}

expect(stub, 'threw');
expect(stub, 'threw', 'wat');
expect(stub, 'threw', error);
expect(stub, 'threw', { name: 'TypeError' });
```

In case of a failing expectation you get the following output:

```js
expect(sinon.spy().named('mySpy'), 'threw', new SyntaxError());
```

```output
expected mySpy threw SyntaxError()
  spy did not throw exception
```

You can make this assertion more strict using the `always` flag. Then
it passes if the spy always threw the given exception.

```js
expect(stub, 'always threw');
expect(stub, 'always threw', 'wat');
expect(stub, 'always threw', error);
expect(stub, 'always threw', { name: 'TypeError' });
```

In case of a failing expectation you get the following output:

```js
stub.throws(new SyntaxError('waat'));
try { stub(); } catch (e) {}

expect(stub, 'always threw', /waat/);
```

```output
expected myStub always threw /waat/

myStub(); at theFunction (theFileName:xx:yy)
// expected: threw /waat/
//   expected TypeError('wat') to satisfy /waat/
myStub(); at theFunction (theFileName:xx:yy)
```
