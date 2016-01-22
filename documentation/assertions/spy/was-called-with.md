Passes if the spy was called with the provided arguments.

```js
var mySpy = sinon.spy().named('mySpy');
mySpy({ foo: 'bar' }, 'baz', 'quux');
expect(mySpy, 'was called with', [ { foo: 'bar' }, 'baz', expect.it('to be truthy') ]);
```

In case of a failing expectation you get the following output:

```js
expect(mySpy, 'was called with', [ 'baz', { foo: 'bar' }, 'quux' ]);
```

```output
expected mySpy was called with [ 'baz', { foo: 'bar' }, 'quux' ]

mySpy(
  { foo: 'bar' }, // should equal 'baz'
  'baz', // should equal { foo: 'bar' }
  'quux'
); at theFunction (theFileName:xx:yy)
```

You can make this assertion more strict using the `always` flag. Then
passes if the spy was always called with the provided arguments.

```js
var mySpy = sinon.spy().named('mySpy');
mySpy({ foo: 'bar' }, 'baz', true);
mySpy({ foo: 'bar' }, 'baz', true);
expect(mySpy, 'was always called with', [ { foo: 'bar' }, 'baz', expect.it('to be truthy') ]);
```

In case of a failing expectation you get the following output:

```js
mySpy({ foo: 'bar' }, 'baz');
expect(mySpy, 'was always called with', [ { foo: 'bar' }, 'baz', expect.it('to be truthy') ]);
```

```output
expected mySpy
was always called with [ { foo: 'bar' }, 'baz', expect.it('to be truthy') ]

mySpy( { foo: 'bar' }, 'baz', true ); at theFunction (theFileName:xx:yy)
mySpy( { foo: 'bar' }, 'baz', true ); at theFunction (theFileName:xx:yy)
mySpy(
  { foo: 'bar' },
  'baz'
  // missing: should be truthy
); at theFunction (theFileName:xx:yy)
```
