Passes if the spy was called with the provided arguments.

```js
var spy = sinon.spy();
spy({ foo: 'bar' }, 'baz', 'qux', 'quux');
expect(spy, 'was called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
```

In case of a failing expectation you get the following output:

```js
expect(spy, 'was called with', 'baz', { foo: 'bar' });
```

```output
expected spy was called with 'baz', { foo: 'bar' }
  failed expectation in invocations( spy( { foo: 'bar' }, 'baz', 'qux', 'quux' ) ):
    0: expected spy( { foo: 'bar' }, 'baz', 'qux', 'quux' ) to satisfy { 0: 'baz', 1: { foo: 'bar' } }
```

You can make this assertion more strict using the `always` flag. Then
passes if the spy was always called with the provided arguments.

```js
var spy = sinon.spy();
spy({ foo: 'bar' }, 'baz', 'qux', 'quux');
spy({ foo: 'bar' }, 'baz', 'qux', 'quux');
expect(spy, 'was always called with', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
```

In case of a failing expectation you get the following output:

```js
spy({ foo: 'bar' }, 'baz');
expect(spy, 'was always called with', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
```

```output
expected spy was always called with { foo: 'bar' }, 'baz', expect.it('to be truthy')
  failed expectation in
  invocations(
    spy( { foo: 'bar' }, 'baz', 'qux', 'quux' ),
    spy( { foo: 'bar' }, 'baz', 'qux', 'quux' ),
    spy( { foo: 'bar' }, 'baz' )
  ):
    2: expected spy( { foo: 'bar' }, 'baz' ) to satisfy { 0: { foo: 'bar' }, 1: 'baz', 2: expect.it('to be truthy') }
```

I case you want to ensure that the spy was called with the provided
arguments and no others, you can use the `exactly` flag.

```js
var spy = sinon.spy();
spy({ foo: 'bar' }, 'baz', 'qux', 'quux');
expect(spy, 'was called with exactly', { foo: 'bar' }, 'baz', sinon.match.truthy, 'quux');
```

In case of a failing expectation you get the following output:

```js
expect(spy, 'was called with exactly', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
```

```output
expected spy was called with exactly { foo: 'bar' }, 'baz', expect.it('to be truthy')
  failed expectation in invocations( spy( { foo: 'bar' }, 'baz', 'qux', 'quux' ) ):
    0: expected spy( { foo: 'bar' }, 'baz', 'qux', 'quux' ) to satisfy [ { foo: 'bar' }, 'baz', expect.it('to be truthy') ]
```

It is of cause also possible to combine the two flags, that will then
pass if the spy was always called with the provided arguments and no
others.

```js
var spy = sinon.spy();
spy({ foo: 'bar' }, 'baz', 'qux');
spy({ foo: 'bar' }, 'baz', 'qux');
expect(spy, 'was always called with exactly', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
```

In case of a failing expectation you get the following output:

```js
spy({ foo: 'bar' }, 'baz');
expect(spy, 'was always called with exactly', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
```

```output
expected spy was always called with exactly { foo: 'bar' }, 'baz', expect.it('to be truthy')
  failed expectation in
  invocations(
    spy( { foo: 'bar' }, 'baz', 'qux' ),
    spy( { foo: 'bar' }, 'baz', 'qux' ),
    spy( { foo: 'bar' }, 'baz' )
  ):
    2: expected spy( { foo: 'bar' }, 'baz' ) to satisfy [ { foo: 'bar' }, 'baz', expect.it('to be truthy') ]
```
