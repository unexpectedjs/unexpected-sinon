Passes if the spy was ever called with obj as its `this` value.

```js
var obj = { spy: sinon.spy().named('mySpy') };
obj.spy();
expect(obj.spy, 'was called on', obj);
```

In case of a failing expectation you get the following output:

```js
var another = {};
expect(obj.spy, 'was called on', another);
```

```output
expected mySpy was called on {}

mySpy(); at theFunction (theFileName:xx:yy)
// expected: was called on {}
//   expected mySpy to be called with {} as this but was called with { spy: mySpy }
```

You can make this assertion more strict by using the `always`
flag. Then it passes if the spy was always called with obj as its this
value.

```js
expect(obj.spy, 'was always called on', obj);
```

In case of a failing expectation you get the following output:

```js
obj.spy.call({});
expect(obj.spy, 'was always called on', obj);
```

```output
expected mySpy was always called on { spy: mySpy }

mySpy(); at theFunction (theFileName:xx:yy)
mySpy(); at theFunction (theFileName:xx:yy)
// expected: was called on { spy: mySpy }
//   expected mySpy to be called with { spy: mySpy } as this but was called with {}
```
