Passes if the spy always threw the given exception.

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
