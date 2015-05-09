Passes if the provided spies where called in the specified order.

```js
var obj = {
    foo: function () { return 'foo'; },
    bar: function () { return 'bar'; },
    baz: function () { return 'baz'; }
};
sinon.spy(obj, 'foo');
sinon.spy(obj, 'bar');
sinon.spy(obj, 'baz');
obj.foo();
obj.bar();
obj.baz();
expect([obj.foo, obj.bar, obj.baz], 'given call order');
```

In case of a failing expectation you get the following output:

```js
expect([obj.bar, obj.foo, obj.baz], 'given call order');
```

```output
expected bar, foo, baz to be called in order but were called as foo, bar, baz
```
