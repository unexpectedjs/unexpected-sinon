Passes if the spy was ever called with obj as its `this` value.

```js
var obj = { spy: sinon.spy() };
obj.spy();
expect(obj.spy, 'was called on', obj);
```

In case of a failing expectation you get the following output:

```js
var another = {};
expect(obj.spy, 'was called on', another);
```

```output
expected spy to be called with {  } as this but was called with { spy: function spy() {} }
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
expected spy to always be called with { spy: function spy() {} } as this but was called with { spy: function spy() {} }, {  }
```
