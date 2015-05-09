---
template: default.ejs
theme: dark
title: unexpected-sinon
repository: https://github.com/unexpectedjs/unexpected-sinon
---

# Unexpected-sinon

This module extends the
[Unexpected](https://github.com/unexpectedjs/unexpected) assertion
library with integration for the [Sinonjs](http://sinonjs.org/)
mocking library.

```js
var obj = { spy: sinon.spy() };
obj.spy(42);
obj.spy({ foo: 'bar' }, 'baz', "qux");
expect(obj.spy, "was called twice");
expect(obj.spy, 'was called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
expect(obj.spy, 'was always called on', obj);
```

[![Build Status](https://travis-ci.org/unexpectedjs/unexpected-sinon.svg?branch=v5.1.1)](https://travis-ci.org/unexpectedjs/unexpected-sinon)

## How to use

### Node

Install it with NPM or add it to your `package.json`:

```
$ npm install unexpected unexpected-sinon
```

Then:

```js#evaluate:false
var expect = require('unexpected').clone();
expect.installPlugin(require('unexpected-sinon'));
```

### Browser

Include the `unexpected.js` found at the lib directory of this
repository.

```html
<script src="sinon.js"></script>
<script src="unexpected.js"></script>
<script src="unexpected-sinon.js"></script>
```

this will expose the expect function under the following namespace:

```js#evaluate:false
var expect = weknowhow.expect.clone();
expect.installPlugin(weknowhow.unexpectedSinon);
```

### RequireJS

Include the library with RequireJS the following way:

```js#evaluate:false
define(['unexpected', 'unexpected-sinon'], funtion (unexpected, unexpectedSinon) {
   var expect = unexpected.clone();
   expect.installPlugin(unexpectedSinon);
   // Your code
});
```

Because Sinon is currently not AMD compatible you will need this RequireJS configuration to make things work:

```js#evaluate:false
requirejs.config({
   paths: {
      'sinon': 'path/to/sinon'
   },
   shim: {
      'sinon': {
         deps: ['sinon'],
         exports: 'sinon'
      }
   }
});
```

## Expectations on arguments of individual calls

```js
var spy = sinon.spy();
spy({ foo: 'bar' }, 'baz');
spy('qux');
spy('quux');

expect(spy.args, 'to equal', [
    [{ foo: 'bar' }, 'baz'],
    ['qux'],
    ['quux']
]);

expect(spy.args[1], 'to equal', ['qux']);

expect(spy.args, 'to satisfy', {
    0: [
        { foo: 'bar' },
        expect.it('to be a string').and('to have length', 3)
    ],
    2: ['quux']
});
```
