Passes if the spy was called with the provided arguments.

THIS ASSERTION IS DEPRECATED AND WILL BE REMOVED IN A LATER VERSION.
Please use [`to have a call satisfying`](../to-have-a-call-satisfying/) instead.

```js
var mySpy = sinon.spy().named('mySpy');
mySpy({ foo: 'bar' }, 'baz', 'qux', 'quux');
expect(mySpy, 'was called with', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
```

In case of a failing expectation you get the following output:

```js
expect(mySpy, 'was called with', 'baz', { foo: 'bar' });
```

```output
expected mySpy was called with 'baz', { foo: 'bar' }

mySpy(
  { foo: 'bar' }, // should equal 'baz'
  'baz', // should equal { foo: 'bar' }
  'qux',
  'quux'
); at theFunction (theFileName:xx:yy)
```

You can make this assertion more strict using the `always` flag. Then
passes if the spy was always called with the provided arguments.

```js
var mySpy = sinon.spy().named('mySpy');
mySpy({ foo: 'bar' }, 'baz', 'qux', 'quux');
mySpy({ foo: 'bar' }, 'baz', 'qux', 'quux');
expect(mySpy, 'was always called with', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
```

In case of a failing expectation you get the following output:

```js
mySpy({ foo: 'bar' }, 'baz');
expect(mySpy, 'was always called with', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
```

```output
expected mySpy
was always called with { foo: 'bar' }, 'baz', expect.it('to be truthy')

mySpy( { foo: 'bar' }, 'baz', 'qux', 'quux' ); at theFunction (theFileName:xx:yy)
mySpy( { foo: 'bar' }, 'baz', 'qux', 'quux' ); at theFunction (theFileName:xx:yy)
mySpy(
  { foo: 'bar' },
  'baz'
  // missing: should be truthy
); at theFunction (theFileName:xx:yy)
```

I case you want to ensure that the spy was called with the provided
arguments and no others, you can use the `exactly` flag.

```js
var mySpy = sinon.spy().named('mySpy');
mySpy({ foo: 'bar' }, 'baz', 'qux', 'quux');
expect(mySpy, 'was called with exactly', { foo: 'bar' }, 'baz', expect.it('to be truthy'), 'quux');
```

In case of a failing expectation you get the following output:

```js
expect(mySpy, 'was called with exactly', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
```

```output
expected mySpy
was called with exactly { foo: 'bar' }, 'baz', expect.it('to be truthy')

mySpy(
  { foo: 'bar' },
  'baz',
  'qux',
  'quux' // should be removed
); at theFunction (theFileName:xx:yy)
```

It is of course also possible to combine the two flags, that will then
pass if the spy was always called with the provided arguments and no
others.

```js
var mySpy = sinon.spy().named('mySpy');
mySpy({ foo: 'bar' }, 'baz', 'qux');
mySpy({ foo: 'bar' }, 'baz', 'qux');
expect(mySpy, 'was always called with exactly', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
```

In case of a failing expectation you get the following output:

```js
mySpy({ foo: 'bar' }, 'baz');
expect(mySpy, 'was always called with exactly', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
```

```output
expected mySpy
was always called with exactly { foo: 'bar' }, 'baz', expect.it('to be truthy')

mySpy( { foo: 'bar' }, 'baz', 'qux' ); at theFunction (theFileName:xx:yy)
mySpy( { foo: 'bar' }, 'baz', 'qux' ); at theFunction (theFileName:xx:yy)
mySpy(
  { foo: 'bar' },
  'baz'
  // missing: should be truthy
); at theFunction (theFileName:xx:yy)
```
