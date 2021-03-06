---
template: default.ejs
theme: dark
title: unexpected-sinon
repository: https://github.com/unexpectedjs/unexpected-sinon
---

# Unexpected-sinon

![Unexpected spy :)](unexpectedSpy.png)

This module extends the
[Unexpected](https://github.com/unexpectedjs/unexpected) assertion
library with integration for the [Sinonjs](http://sinonjs.org/)
mocking library.

[![NPM version](https://badge.fury.io/js/unexpected-sinon.svg)](http://badge.fury.io/js/unexpected-sinon)
[![Build Status](https://travis-ci.org/unexpectedjs/unexpected-sinon.svg?branch=master)](https://travis-ci.org/unexpectedjs/unexpected-sinon)
[![Coverage Status](https://coveralls.io/repos/unexpectedjs/unexpected-sinon/badge.svg)](https://coveralls.io/r/unexpectedjs/unexpected-sinon)
[![Dependency Status](https://david-dm.org/unexpectedjs/unexpected-sinon.svg)](https://david-dm.org/unexpectedjs/unexpected-sinon)

## Usage

Here is an example stolen from
[Gary Bernhardt](https://twitter.com/garybernhardt).

```js
function SucksRocks(searchEngine) {
  this.forTerm = function (term) {
    return Promise.all([
      searchEngine.countResults(term + " rocks"),
      searchEngine.countResults(term + " sucks")
    ]).then(function (results) {
      var positive = results[0];
      var negative = results[1];
      return positive > negative ? 'Rocks!' : 'Sucks!';
    });
  };
}
```

```js
var searchEngine = {
  countResults: sinon.stub()
};

searchEngine.countResults
  .onFirstCall().returns(Promise.resolve(6920000))
  .onSecondCall().returns(Promise.resolve(3400000));

var result = new SucksRocks(searchEngine).forTerm('Open source');

expect(searchEngine.countResults, 'to have calls satisfying', function () {
  searchEngine.countResults('Open source rocks');
  searchEngine.countResults('Open source sucks');
});

return expect(result, 'when fulfilled', 'to equal', 'Rocks!');
```

Amazing output when a failure happens!

```js
var searchEngine = {
  countResults: sinon.stub().named('myStub')
};

searchEngine.countResults
  .onFirstCall().returns(Promise.resolve(6920000))
  .onSecondCall().returns(Promise.resolve(3400000));

var score = new SucksRocks(searchEngine).forTerm('Open source');

expect(searchEngine.countResults, 'to have calls satisfying', function () {
  searchEngine.countResults('Open source rocks!');
  searchEngine.countResults('Open source sucks!');
});
```

```output
expected myStub to have calls satisfying
myStub( 'Open source rocks!' );
myStub( 'Open source sucks!' );

myStub(
  'Open source rocks' // should equal 'Open source rocks!'
                      //
                      // -Open source rocks
                      // +Open source rocks!
); at theFunction (theFileName:xx:yy)
myStub(
  'Open source sucks' // should equal 'Open source sucks!'
                      //
                      // -Open source sucks
                      // +Open source sucks!
); at theFunction (theFileName:xx:yy)
```

## Setup

### Node

Install it with NPM or add it to your `package.json`:

```
$ npm install --save-dev unexpected unexpected-sinon
```

Then:

<!-- unexpected-markdown evaluate:false -->

```js
var expect = require('unexpected').clone();
expect.use(require('unexpected-sinon'));
```

### Browser

Include the `unexpected-sinon.js` found at the lib directory of this
repository.

```html
<script src="sinon.js"></script>
<script src="unexpected.js"></script>
<script src="unexpected-sinon.js"></script>
```

this will expose the expect function under the following namespace:

<!-- unexpected-markdown evaluate:false -->

```js
var expect = weknowhow.expect.clone();
expect.use(weknowhow.unexpectedSinon);
```

### RequireJS

Include the library with RequireJS the following way:

<!-- unexpected-markdown evaluate:false -->

```js
require(['unexpected', 'unexpected-sinon', 'sinon'], function (unexpected, unexpectedSinon, sinon) {
  var expect = unexpected.clone();
  expect.use(unexpectedSinon);
  // Your code
});
```

## Source

The source for Unexpected can be found on
[Github](https://github.com/unexpectedjs/unexpected-sinon).

## Releases

[Changelog](https://github.com/unexpectedjs/unexpected-sinon/blob/master/CHANGELOG.md)

## MIT License

Copyright (c) 2013 Sune Simonsen <sune@we-knowhow.dk>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
