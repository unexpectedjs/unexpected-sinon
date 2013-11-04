# Unexpected-sinon

This module extends the
[Unexpected](https://github.com/sunesimonsen/unexpected) assertion
library with integration for the [Sinonjs](http://sinonjs.org/)
mocking library.

```js
expect(spy, "was called twice");
expect(spy, 'was called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
expect(obj.spy, 'was always called on', obj);
```

[![Build Status](https://travis-ci.org/sunesimonsen/unexpected-sinon.png?branch=master)](https://travis-ci.org/sunesimonsen/unexpected-sinon)

[Run the test in the browser](http://sunesimonsen.github.io/unexpected-sinon/test/tests.html)

## How to use

### Node

Install it with NPM or add it to your `package.json`:

```
$ npm install unexpected
```

Then:

```js
var expect = require('unexpected-sinon');
```

### Browser

Include the `unexpected.js` found at the lib directory of this
repository.

```html
<!-- SinonJS -->
<script src="sinon.js"></script>
<script src="sinon/spy.js"></script>
<script src="sinon/stub.js"></script>
<script src="sinon/mock.js"></script>
<script src="sinon/collection.js"></script>
<script src="sinon/assert.js"></script>
<script src="sinon/sandbox.js"></script>
<script src="sinon/test.js"></script>
<script src="sinon/test_case.js"></script>
<script src="sinon/assert.js"></script>
<script src="sinon/match.js"></script>
<!-- Unexpected -->
<script src="unexpected.js"></script>
<script src="unexpected-sinon.js"></script>
```

this will expose the expect function under the following namespace:

```js
var expect = weknowhow.expect;
```

### RequireJS

Include the library with RequireJS the following way:

```js
define(['unexpected-sinon/lib/unexpected-sinon.js'], funtion (expect) {
   // Your code
});
```

## API

### was not called

Passes if spy was called at least once.

```js
expect(spy, 'was not called');
```

### was called

Passes if spy was never called.

```js
expect(spy, 'was called');
```

### was called once

Passes if spy was called once and only once.

```js
expect(spy, 'was called once');
```

### was called twice

Passes if spy was called exactly twice.

```js
expect(spy, 'was called twice');
```

### was called thrice

Passes if spy was called exactly three times.

```js
expect(spy, 'was called thrice');
```

### was called times


Passes if the spy was called exactly num times.

```js
expect(spy, 'was called times', 42);
```

### given call order

Passes if the provided spies where called in the specified order.

```js
expect([spy0, spy1, spy2], 'given call order');
```

### was called on

Passes if the spy was ever called with obj as its this value.

```js
expect(obj.spy, 'was called on', obj);
```

### was always called on

Passes if the spy was always called with obj as its this value.

```js
expect(obj.spy, 'was always called on', obj);
```

### was called with

Passes if the spy was called with the provided arguments.

```js
expect(spy, 'was called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
```

### was always called with

Passes if the spy was always called with the provided arguments.

```js
expect(spy, 'was always called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
```

### was never called with

Passes if the spy was never called with the provided arguments.

```js
expect(spy, 'was never called with', 'bar', sinon.match.truthy);
```

### was called with exactly

Passes if the spy was called with the provided arguments and no others.

```js
expect(spy, 'was called with exactly', 'foo', 'bar', sinon.match.truthy);
```

### was always called with exactly

Passes if the spy was always called with the provided arguments and no others.

```js
expect(spy, 'was always called with exactly', 'foo', 'bar', sinon.match.truthy);
```

### threw

Passes if the spy threw the given exception. The exception can be a
string denoting its type, or an actual object. If only one argument is
provided, the assertion passes if the spy ever threw any exception.

```js
expect(spy, 'threw');
expect(spy, 'threw', 'TypeError');
expect(spy, 'threw', error);
```

### always threw

Like above, only required for all calls to the spy.

```js
expect(spy, 'always threw');
expect(spy, 'always threw', 'TypeError');
expect(spy, 'always threw', error);
```
