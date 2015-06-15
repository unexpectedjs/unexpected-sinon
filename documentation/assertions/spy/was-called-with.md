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
  expected invocations( spy( { foo: 'bar' }, 'baz', 'qux', 'quux' ) )
  to have values satisfying { 0: 'baz', 1: { foo: 'bar' } }

  invocations(
    spy([
      { foo: 'bar' }, // should equal 'baz'
      'baz', // should equal { foo: 'bar' }
      'qux',
      'quux'
    ])
  )
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
  expected spyCalls to have values satisfying { 0: { foo: 'bar' }, 1: 'baz', 2: expect.it('to be truthy') }

  invocations(
    spy( { foo: 'bar' }, 'baz', 'qux', 'quux' ),
    spy( { foo: 'bar' }, 'baz', 'qux', 'quux' ),
    spy([
      { foo: 'bar' },
      'baz',
      undefined // expected undefined to be truthy
    ])
  )
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
  expected invocations( spy( { foo: 'bar' }, 'baz', 'qux', 'quux' ) )
  to have values satisfying [ { foo: 'bar' }, 'baz', expect.it('to be truthy') ]

  invocations(
    spy([
      { foo: 'bar' },
      'baz',
      'qux',
      'quux' // should be removed
    ])
  )
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
  expected spyCalls to have values satisfying [ { foo: 'bar' }, 'baz', expect.it('to be truthy') ]

  invocations(
    spy( { foo: 'bar' }, 'baz', 'qux' ),
    spy( { foo: 'bar' }, 'baz', 'qux' ),
    spy([
      { foo: 'bar' },
      'baz',
      // expected undefined to be truthy
    ])
  )
```
