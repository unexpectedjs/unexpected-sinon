(function () {
    // Copyright (c) 2013 Sune Simonsen <sune@we-knowhow.dk>
    //
    // Permission is hereby granted, free of charge, to any person
    // obtaining a copy of this software and associated documentation
    // files (the 'Software'), to deal in the Software without
    // restriction, including without limitation the rights to use, copy,
    // modify, merge, publish, distribute, sublicense, and/or sell copies
    // of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:
    //
    // The above copyright notice and this permission notice shall be
    // included in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
    // EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    // NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
    // BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
    // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    // CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    // SOFTWARE.
    
    var namespace = {};
    
    (function () {
        namespace.shim = {
            every: function (arr, fn, thisObj) {
                var scope = thisObj || null;
                for (var i = 0, j = arr.length; i < j; i += 1) {
                    if (!fn.call(scope, arr[i], i, arr)) {
                        return false;
                    }
                }
                return true;
            },

            indexOf: function (arr, searchElement, fromIndex) {
                var length = arr.length >>> 0; // Hack to convert object.length to a UInt32

                fromIndex = +fromIndex || 0;

                if (Math.abs(fromIndex) === Infinity) {
                    fromIndex = 0;
                }

                if (fromIndex < 0) {
                    fromIndex += length;
                    if (fromIndex < 0) {
                        fromIndex = 0;
                    }
                }

                for (;fromIndex < length; fromIndex += 1) {
                    if (arr[fromIndex] === searchElement) {
                        return fromIndex;
                    }
                }

                return -1;
            },

            getKeys: function (obj) {
                var result = [];

                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        result.push(i);
                    }
                }

                return result;
            },

            forEach: function (arr, callback, that) {
                for (var i = 0, n = arr.length; i < n; i += 1)
                    if (i in arr)
                        callback.call(that, arr[i], i, arr);
            },

            map: function (arr, mapper, that) {
                var other = new Array(arr.length);

                for (var i = 0, n = arr.length; i < n; i += 1)
                    if (i in arr)
                        other[i] = mapper.call(that, arr[i], i, arr);

                return other;
            },

            filter: function (arr, predicate) {
                var length = +arr.length;

                var result = [];

                if (typeof predicate !== "function")
                    throw new TypeError();

                for (var i = 0; i < length; i += 1) {
                    var value = arr[i];
                    if (predicate(value)) {
                        result.push(value);
                    }
                }

                return result;
            },

            trim: function (text) {
                return text.replace(/^\s+|\s+$/g, '');
            },

            reduce: function (arr, fun) {
                var len = +arr.length;

                if (typeof fun !== "function")
                    throw new TypeError();

                // no value to return if no initial value and an empty array
                if (len === 0 && arguments.length === 1)
                    throw new TypeError();

                var i = 0;
                var rv;
                if (arguments.length >= 2) {
                    rv = arguments[2];
                } else {
                    do {
                        if (i in arr) {
                            rv = arr[i];
                            i += 1;
                            break;
                        }

                        // if array contains no values, no initial value to return
                        i += 1;
                        if (i >= len)
                            throw new TypeError();
                    } while (true);
                }

                for (; i < len; i += 1) {
                    if (i in arr)
                        rv = fun.call(null, rv, arr[i], i, this);
                }

                return rv;
            },

            JSON: (function () {
                "use strict";

                var jsonShim = {};

                function f(n) {
                    // Format integers to have at least two digits.
                    return n < 10 ? '0' + n : n;
                }

                function date(d, key) {
                    return isFinite(d.valueOf()) ?
                        d.getUTCFullYear()     + '-' +
                        f(d.getUTCMonth() + 1) + '-' +
                        f(d.getUTCDate())      + 'T' +
                        f(d.getUTCHours())     + ':' +
                        f(d.getUTCMinutes())   + ':' +
                        f(d.getUTCSeconds())   + 'Z' : null;
                }

                var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    gap,
                    indent,
                    meta = {    // table of character substitutions
                        '\b': '\\b',
                        '\t': '\\t',
                        '\n': '\\n',
                        '\f': '\\f',
                        '\r': '\\r',
                        '"' : '\\"',
                        '\\': '\\\\'
                    },
                    rep;


                function quote(string) {

                    // If the string contains no control characters, no quote characters, and no
                    // backslash characters, then we can safely slap some quotes around it.
                    // Otherwise we must also replace the offending characters with safe escape
                    // sequences.

                    escapable.lastIndex = 0;
                    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                        var c = meta[a];
                        return typeof c === 'string' ? c :
                            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    }) + '"' : '"' + string + '"';
                }


                function str(key, holder) {

                    // Produce a string from holder[key].

                    var i,          // The loop counter.
                        k,          // The member key.
                        v,          // The member value.
                        length,
                        mind = gap,
                        partial,
                        value = holder[key];

                    // If the value has a toJSON method, call it to obtain a replacement value.

                    if (value instanceof Date) {
                        value = date(key);
                    }

                    // If we were called with a replacer function, then call the replacer to
                    // obtain a replacement value.

                    if (typeof rep === 'function') {
                        value = rep.call(holder, key, value);
                    }

                    // What happens next depends on the value's type.

                    switch (typeof value) {
                    case 'string':
                        return quote(value);

                    case 'number':

                        // JSON numbers must be finite. Encode non-finite numbers as null.

                        return isFinite(value) ? String(value) : 'null';

                    case 'boolean':
                    case 'null':

                        // If the value is a boolean or null, convert it to a string. Note:
                        // typeof null does not produce 'null'. The case is included here in
                        // the remote chance that this gets fixed someday.

                        return String(value);

                        // If the type is 'object', we might be dealing with an object or an array or
                        // null.

                    case 'object':

                        // Due to a specification blunder in ECMAScript, typeof null is 'object',
                        // so watch out for that case.

                        if (!value) {
                            return 'null';
                        }

                        // Make an array to hold the partial results of stringifying this object value.

                        gap += indent;
                        partial = [];

                        // Is the value an array?

                        if (Object.prototype.toString.apply(value) === '[object Array]') {

                            // The value is an array. Stringify every element. Use null as a placeholder
                            // for non-JSON values.

                            length = value.length;
                            for (i = 0; i < length; i += 1) {
                                partial[i] = str(i, value) || 'null';
                            }

                            // Join all of the elements together, separated with commas, and wrap them in
                            // brackets.

                            v = partial.length === 0 ? '[]' : gap ?
                                '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                                '[' + partial.join(',') + ']';
                            gap = mind;
                            return v;
                        }

                        // If the replacer is an array, use it to select the members to be stringified.

                        if (rep && typeof rep === 'object') {
                            length = rep.length;
                            for (i = 0; i < length; i += 1) {
                                if (typeof rep[i] === 'string') {
                                    k = rep[i];
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        } else {

                            // Otherwise, iterate through all of the keys in the object.

                            for (k in value) {
                                if (value.hasOwnProperty(k)) {
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        }

                        // Join all of the member texts together, separated with commas,
                        // and wrap them in braces.

                        v = partial.length === 0 ? '{}' : gap ?
                            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                            '{' + partial.join(',') + '}';
                        gap = mind;
                        return v;
                    }
                }

                // If the JSON object does not yet have a stringify method, give it one.

                jsonShim.stringify = function (value, replacer, space) {

                    // The stringify method takes a value and an optional replacer, and an optional
                    // space parameter, and returns a JSON text. The replacer can be a function
                    // that can replace values, or an array of strings that will select the keys.
                    // A default replacer method can be provided. Use of the space parameter can
                    // produce text that is more easily readable.

                    var i;
                    gap = '';
                    indent = '';

                    // If the space parameter is a number, make an indent string containing that
                    // many spaces.

                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' ';
                        }

                        // If the space parameter is a string, it will be used as the indent string.

                    } else if (typeof space === 'string') {
                        indent = space;
                    }

                    // If there is a replacer, it must be a function or an array.
                    // Otherwise, throw an error.

                    rep = replacer;
                    if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                         typeof replacer.length !== 'number')) {
                        throw new Error('JSON.stringify');
                    }

                    // Make a fake root object containing our value under the key of ''.
                    // Return the result of stringifying the value.

                    return str('', {'': value});
                };

                // If the JSON object does not yet have a parse method, give it one.

                jsonShim.parse = function (text, reviver) {
                    // jshint evil:true
                    // The parse method takes a text and an optional reviver function, and returns
                    // a JavaScript value if the text is a valid JSON text.

                    var j;

                    function walk(holder, key) {

                        // The walk method is used to recursively walk the resulting structure so
                        // that modifications can be made.

                        var k, v, value = holder[key];
                        if (value && typeof value === 'object') {
                            for (k in value) {
                                if (value.hasOwnProperty(k)) {
                                    v = walk(value, k);
                                    if (v !== undefined) {
                                        value[k] = v;
                                    } else {
                                        delete value[k];
                                    }
                                }
                            }
                        }
                        return reviver.call(holder, key, value);
                    }


                    // Parsing happens in four stages. In the first stage, we replace certain
                    // Unicode characters with escape sequences. JavaScript handles many characters
                    // incorrectly, either silently deleting them, or treating them as line endings.

                    text = String(text);
                    cx.lastIndex = 0;
                    if (cx.test(text)) {
                        text = text.replace(cx, function (a) {
                            return '\\u' +
                                ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                        });
                    }

                    // In the second stage, we run the text against regular expressions that look
                    // for non-JSON patterns. We are especially concerned with '()' and 'new'
                    // because they can cause invocation, and '=' because it can cause mutation.
                    // But just to be safe, we want to reject all unexpected forms.

                    // We split the second stage into 4 regexp operations in order to work around
                    // crippling inefficiencies in IE's and Safari's regexp engines. First we
                    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                    // replace all simple value tokens with ']' characters. Third, we delete all
                    // open brackets that follow a colon or comma or that begin the text. Finally,
                    // we look to see that the remaining characters are only whitespace or ']' or
                    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                    if (/^[\],:{}\s]*$/
                        .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                              .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                              .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                        // In the third stage we use the eval function to compile the text into a
                        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                        // in JavaScript: it can begin a block or an object literal. We wrap the text
                        // in parens to eliminate the ambiguity.

                        j = eval('(' + text + ')');

                        // In the optional fourth stage, we recursively walk the new structure, passing
                        // each name/value pair to a reviver function for possible transformation.

                        return typeof reviver === 'function' ?
                            walk({'': j}, '') : j;
                    }

                    // If the text is not JSON parseable, then a SyntaxError is thrown.

                    throw new SyntaxError('JSON.parse');
                };

                return jsonShim;
            })()
        };
    }());
    
    (function () {
        namespace.shim = namespace.shim || {};
        var shim = namespace.shim;

        var prototypes = {
            'bind': Function.prototype.bind,
            'every': Array.prototype.every,
            'indexOf': Array.prototype.indexOf,
            'forEach': Array.prototype.forEach,
            'map': Array.prototype.map,
            'filter': Array.prototype.filter,
            'reduce': Array.prototype.reduce,
            'trim': String.prototype.trim
        };

        function createShimMethod(key) {
            shim[key] = function (obj) {
                var args = Array.prototype.slice.call(arguments, 1);
                return prototypes[key].apply(obj, args);
            };
        }

        for (var key in prototypes) {
            if (prototypes.hasOwnProperty(key) && prototypes[key]) {
                createShimMethod(key);
            }
        }

        if (!shim.bind) {
            shim.bind = function (fn, scope) {
                return function () {
                    return fn.apply(scope, arguments);
                };
            };
        }

        if (Object.keys) {
            shim['getKeys'] = Object.keys;
        }

        if ('object' === typeof JSON && JSON.parse && JSON.stringify) {
            shim['JSON'] = JSON;
        }
    }());
    
    (function () {
        var shim = namespace.shim;
        var forEach = shim.forEach;
        var getKeys = shim.getKeys;

        var utils = {
            // https://gist.github.com/1044128/
            getOuterHTML: function (element) {
                // jshint browser:true
                if ('outerHTML' in element) return element.outerHTML;
                var ns = "http://www.w3.org/1999/xhtml";
                var container = document.createElementNS(ns, '_');
                var xmlSerializer = new XMLSerializer();
                var html;
                if (document.xmlVersion) {
                    return xmlSerializer.serializeToString(element);
                } else {
                    container.appendChild(element.cloneNode(false));
                    html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
                    container.innerHTML = '';
                    return html;
                }
            },

            // Returns true if object is a DOM element.
            isDOMElement: function (object) {
                if (typeof HTMLElement === 'object') {
                    return object instanceof HTMLElement;
                } else {
                    return object &&
                        typeof object === 'object' &&
                        object.nodeType === 1 &&
                        typeof object.nodeName === 'string';
                }
            },


            isArray: function (ar) {
                return Object.prototype.toString.call(ar) === '[object Array]';
            },

            isRegExp: function (re) {
                var s;
                try {
                    s = '' + re;
                } catch (e) {
                    return false;
                }

                return re instanceof RegExp || // easy case
                // duck-type for context-switching evalcx case
                typeof(re) === 'function' &&
                    re.constructor.name === 'RegExp' &&
                    re.compile &&
                    re.test &&
                    re.exec &&
                    s.match(/^\/.*\/[gim]{0,3}$/);
            },

            isError: function (err) {
                return typeof err === 'object' && Object.prototype.toString.call(err) === '[object Error]';
            },

            isDate: function (d) {
                if (d instanceof Date) return true;
                return false;
            },

            extend: function (target) {
                var sources = Array.prototype.slice.call(arguments, 1);
                forEach(sources, function (source) {
                    forEach(getKeys(source), function (key) {
                        target[key] = source[key];
                    });
                });
                return target;
            },

            isUndefinedOrNull: function  (value) {
                return value === null || value === undefined;
            },

            isArguments: function  (object) {
                return Object.prototype.toString.call(object) === '[object Arguments]';
            },

            /**
             * Levenshtein distance algorithm from wikipedia
             * http://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#JavaScript
             */
            levenshteinDistance: function (a, b) {
                if (a.length === 0) return b.length;
                if (b.length === 0) return a.length;

                var matrix = [];

                // increment along the first column of each row
                var i;
                for (i = 0; i <= b.length; i += 1) {
                    matrix[i] = [i];
                }

                // increment each column in the first row
                var j;
                for (j = 0; j <= a.length; j += 1) {
                    matrix[0][j] = j;
                }

                // Fill in the rest of the matrix
                for (i = 1; i <= b.length; i += 1) {
                    for (j = 1; j <= a.length; j += 1) {
                        if (b.charAt(i - 1) === a.charAt(j - 1)) {
                            matrix[i][j] = matrix[i - 1][j - 1];
                        } else {
                            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                                                    Math.min(matrix[i][j - 1] + 1, // insertion
                                                             matrix[i - 1][j] + 1)); // deletion
                        }
                    }
                }

                return matrix[b.length][a.length];
            },

            truncateStack: function (err, fn) {
                if (Error.captureStackTrace) {
                    Error.captureStackTrace(err, fn);
                } else if ('stack' in err) {
                    // Excludes IE<10, and fn cannot be anonymous for this backup plan to work:
                    var stackEntries = err.stack.split(/\r\n?|\n\r?/),
                    needle = 'at ' + fn.name + ' ';
                    for (var i = 0 ; i < stackEntries.length ; i += 1) {
                        if (stackEntries[i].indexOf(needle) !== -1) {
                            stackEntries.splice(1, i);
                            err.stack = stackEntries.join("\n");
                        }
                    }
                }
            }
        };

        namespace.utils = utils;
    }());
    
    (function () {
        var shim = namespace.shim;
        var getKeys = shim.getKeys;

        var utils = namespace.utils;
        var isRegExp = utils.isRegExp;
        var isArguments = utils.isArguments;
        var isUndefinedOrNull = utils.isUndefinedOrNull;

        /**
         * Asserts deep equality
         *
         * @see taken from node.js `assert` module (copyright Joyent, MIT license)
         */
        function equal(actual, expected) {
            // 7.1. All identical values are equivalent, as determined by ===.
            if (actual === expected) {
                return true;
            } else if ('undefined' !== typeof Buffer &&
                       Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
                if (actual.length !== expected.length) return false;

                for (var i = 0; i < actual.length; i += 1) {
                    if (actual[i] !== expected[i]) return false;
                }

                return true;

                // 7.2. If the expected value is a Date object, the actual value is
                // equivalent if it is also a Date object that refers to the same time.
            } else if (actual instanceof Date && expected instanceof Date) {
                return actual.getTime() === expected.getTime();

                // 7.3. Other pairs that do not both pass typeof value == "object",
                // equivalence is determined by ==.
            } else if (typeof actual !== 'object' && typeof expected !== 'object') {
                return actual === expected;

                // 7.4. For all other Object pairs, including Array objects, equivalence is
                // determined by having the same number of owned properties (as verified
                // with Object.prototype.hasOwnProperty.call), the same set of keys
                // (although not necessarily the same order), equivalent values using === for every
                // corresponding key, and an identical "prototype" property. Note: this
                // accounts for both named and indexed properties on Arrays.
            } else {
                return objEquiv(actual, expected);
            }
        }

        function objEquiv(a, b) {
            if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
                return false;
            // an identical "prototype" property.
            if (a.prototype !== b.prototype) return false;
            //~~~I've managed to break Object.keys through screwy arguments passing.
            //   Converting to array solves the problem.
            if (isRegExp(a)) {
                if (!isRegExp(b)) {
                    return false;
                }
                return a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
            }
            if (isArguments(a)) {
                if (!isArguments(b)) {
                    return false;
                }
                a = Array.prototype.slice.call(a);
                b = Array.prototype.slice.call(b);
                return equal(a, b);
            }
            var ka, kb, key, i;
            try {
                ka = getKeys(a);
                kb = getKeys(b);
            } catch (e) {//happens when one is a string literal and the other isn't
                return false;
            }
            // having the same number of owned properties (keys incorporates hasOwnProperty)
            if (ka.length !== kb.length)
                return false;
            //the same set of keys (although not necessarily the same order),
            ka.sort();
            kb.sort();
            //~~~cheap key test
            for (i = ka.length - 1; i >= 0; i -= 1) {
                if (ka[i] !== kb[i])
                    return false;
            }
            //equivalent values for every corresponding key, and
            //~~~possibly expensive deep test
            for (i = ka.length - 1; i >= 0; i -= 1) {
                key = ka[i];
                if (!equal(a[key], b[key]))
                    return false;
            }
            return true;
        }

        namespace.equal = equal;
    }());
    
    (function () {
        var shim = namespace.shim;
        var json = shim.JSON;
        var getKeys = shim.getKeys;
        var map = shim.map;
        var indexOf = shim.indexOf;
        var reduce = shim.reduce;

        var utils = namespace.utils;
        var isDOMElement = utils.isDOMElement;
        var getOuterHTML = utils.getOuterHTML;
        var isArray = utils.isArray;
        var isRegExp = utils.isRegExp;
        var isError = utils.isError;
        var isDate = utils.isDate;

        function formatError(err) {
            return '[' + Error.prototype.toString.call(err) + ']';
        }

        /**
         * Inspects an object.
         *
         * @see taken from node.js `util` module (copyright Joyent, MIT license)
         */
        var inspect = function (obj, showHidden, depth) {
            var seen = [];

            function stylize(str) {
                return str;
            }

            function format(value, recurseTimes) {

                // Provide a hook for user-specified inspect functions.
                // Check that value is an object with an inspect function on it
                if (value && typeof value.inspect === 'function' &&
                    // Filter out the util module, it's inspect function is special
                    (typeof exports === 'undefined' || value !== exports) &&
                    // Also filter out any prototype objects using the circular check.
                    !(value.constructor && value.constructor.prototype === value)) {
                    return value.inspect(recurseTimes);
                }

                // Primitive types cannot have properties
                switch (typeof value) {
                case 'undefined':
                    return stylize('undefined', 'undefined');

                case 'string':
                    var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
                        .replace(/'/g, "\\'")
                        .replace(/\\"/g, '"') + '\'';
                    return stylize(simple, 'string');

                case 'number':
                    return stylize('' + value, 'number');

                case 'boolean':
                    return stylize('' + value, 'boolean');
                }
                // For some reason typeof null is "object", so special case here.
                if (value === null) {
                    return stylize('null', 'null');
                }

                if (isDOMElement(value)) {
                    return getOuterHTML(value);
                }

                if (isRegExp(value)) {
                    return stylize('' + value, 'regexp');
                }

                if (isError(value)) {
                    return formatError(value);
                }

                // Look up the keys of the object.
                var visible_keys = getKeys(value);
                var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;

                // Functions without properties can be shortcutted.
                if (typeof value === 'function' && $keys.length === 0) {
                    if (isRegExp(value)) {
                        return stylize('' + value, 'regexp');
                    } else {
                        var name = value.name ? ': ' + value.name : '';
                        return stylize('[Function' + name + ']', 'special');
                    }
                }

                // Dates without properties can be shortcutted
                if (isDate(value) && $keys.length === 0) {
                    return stylize(value.toUTCString(), 'date');
                }

                var base, type, braces;
                // Determine the object type
                if (isArray(value)) {
                    type = 'Array';
                    braces = ['[', ']'];
                } else {
                    type = 'Object';
                    braces = ['{', '}'];
                }

                // Make functions say that they are functions
                if (typeof value === 'function') {
                    var n = value.name ? ': ' + value.name : '';
                    base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
                } else {
                    base = '';
                }

                // Make dates with properties first say the date
                if (isDate(value)) {
                    base = ' ' + value.toUTCString();
                }

                if ($keys.length === 0) {
                    return braces[0] + base + braces[1];
                }

                if (recurseTimes < 0) {
                    if (isRegExp(value)) {
                        return stylize('' + value, 'regexp');
                    } else {
                        return stylize('[Object]', 'special');
                    }
                }

                seen.push(value);

                var output = map($keys, function (key) {
                    var name, str;
                    if (value.__lookupGetter__) {
                        if (value.__lookupGetter__(key)) {
                            if (value.__lookupSetter__(key)) {
                                str = stylize('[Getter/Setter]', 'special');
                            } else {
                                str = stylize('[Getter]', 'special');
                            }
                        } else {
                            if (value.__lookupSetter__(key)) {
                                str = stylize('[Setter]', 'special');
                            }
                        }
                    }
                    if (indexOf(visible_keys, key) < 0) {
                        name = '[' + key + ']';
                    }
                    if (!str) {
                        if (indexOf(seen, value[key]) < 0) {
                            if (recurseTimes === null) {
                                str = format(value[key]);
                            } else {
                                str = format(value[key], recurseTimes - 1);
                            }
                            if (str.indexOf('\n') > -1) {
                                if (isArray(value)) {
                                    str = map(str.split('\n'), function (line) {
                                        return '  ' + line;
                                    }).join('\n').substr(2);
                                } else {
                                    str = '\n' + map(str.split('\n'), function (line) {
                                        return '   ' + line;
                                    }).join('\n');
                                }
                            }
                        } else {
                            str = stylize('[Circular]', 'special');
                        }
                    }
                    if (typeof name === 'undefined') {
                        if (type === 'Array' && key.match(/^\d+$/)) {
                            return str;
                        }
                        name = json.stringify('' + key);
                        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                            name = name.substr(1, name.length - 2);
                            name = stylize(name, 'name');
                        } else {
                            name = name.replace(/'/g, "\\'")
                                .replace(/\\"/g, '"')
                                .replace(/(^"|"$)/g, "'");
                            name = stylize(name, 'string');
                        }
                    }

                    return name + ': ' + str;
                });

                seen.pop();

                var numLinesEst = 0;
                var length = reduce(output, function (prev, cur) {
                    numLinesEst += 1;
                    if (indexOf(cur, '\n') >= 0) numLinesEst += 1;
                    return prev + cur.length + 1;
                }, 0);

                if (length > 50) {
                    output = braces[0] +
                        (base === '' ? '' : base + '\n ') +
                        ' ' +
                        output.join(',\n  ') +
                        ' ' +
                        braces[1];

                } else {
                    output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
                }

                return output;
            }
            return format(obj, (typeof depth === 'undefined' ? 2 : depth));
        };

        namespace.inspect = inspect;
    }());
    
    (function () {
        var inspect = namespace.inspect;
        var equal = namespace.equal;

        var shim = namespace.shim;
        var bind = shim.bind;
        var forEach = shim.forEach;
        var filter = shim.filter;
        var map = shim.map;
        var trim = shim.trim;
        var reduce = shim.reduce;
        var getKeys = shim.getKeys;

        var utils = namespace.utils;
        var truncateStack = utils.truncateStack;
        var extend = utils.extend;
        var levenshteinDistance = utils.levenshteinDistance;

        function Assertion(subject, testDescription, flags, args) {
            this.obj = subject; // deprecated
            this.subject = subject;
            this.testDescription = testDescription;
            this.flags = flags;
            this.args = args;
            this.errorMode = 'default';
        }

        Assertion.prototype.standardErrorMessage = function () {
            var argsString = map(this.args, function (arg) {
                return inspect(arg);
            }).join(', ');

            if (argsString.length > 0) {
                argsString = ' ' + argsString;
            }

            return 'expected ' +
                inspect(this.subject) +
                ' ' + this.testDescription +
                argsString;
        };

        Assertion.prototype.throwStandardError = function () {
            var err = new Error(this.standardErrorMessage());
            err._isUnexpected = true;
            throw err;
        };

        Assertion.prototype.assert = function (condition) {
            var not = !!this.flags.not;
            condition = !!condition;
            if (condition === not) {
                this.throwStandardError();
            }
        };

        function Unexpected(assertions) {
            this.assertions = assertions || {};
        }

        Unexpected.prototype.format = function (message, args) {
            args = map(args, function (arg) {
                return inspect(arg);
            });
            message = message.replace(/\{(\d+)\}/g, function (match, n) {
                return args[n] || match;
            });
            return message;
        };

        Unexpected.prototype.fail = function (message) {
            message = message || "explicit failure";
            var args = Array.prototype.slice.call(arguments, 1);
            throw new Error(this.format(message, args));
        };

        Unexpected.prototype.findAssertionSimilarTo = function (text) {
            var editDistrances = [];
            forEach(getKeys(this.assertions), function (assertion) {
                var distance = levenshteinDistance(text, assertion);
                editDistrances.push({
                    assertion: assertion,
                    distance: distance
                });
            });
            editDistrances.sort(function (x, y) {
                return x.distance - y.distance;
            });
            return map(editDistrances.slice(0, 5), function (editDistrance) {
                return editDistrance.assertion;
            });
        };

        Unexpected.prototype.addAssertion = function () {
            var assertions = this.assertions;
            var patterns = Array.prototype.slice.call(arguments, 0, -1);
            var handler = Array.prototype.slice.call(arguments, -1)[0];
            forEach(patterns, function (pattern) {
                ensureValidPattern(pattern);
                forEach(expandPattern(pattern), function (expandedPattern) {
                    assertions[expandedPattern.text] = {
                        handler: handler,
                        flags: expandedPattern.flags
                    };
                });
            });

            return this.expect; // for chaining
        };

        Unexpected.prototype.installPlugin = function (plugin) {
            if (typeof plugin !== 'function') {
                throw new Error('Expected first argument given to installPlugin to be a function');
            }

            plugin(this.expect);
        };

        function handleNestedExpects(e, assertion) {
            switch (assertion.errorMode) {
            case 'nested':
                e.message = assertion.standardErrorMessage() + '\n    ' + e.message.replace(/\n/g, '\n    ');
                break;
            case 'default':
                e.message = assertion.standardErrorMessage();
                break;
            case 'bubble':
                break;
            default:
                throw new Error("Unknown error mode: '" + assertion.errorMode + "'");
            }
        }

        function installExpectMethods(unexpected, expectFunction) {
            var expect = bind(expectFunction, unexpected);
            expect.fail = bind(unexpected.fail, unexpected);
            expect.addAssertion = bind(unexpected.addAssertion, unexpected);
            expect.clone = bind(unexpected.clone, unexpected);
            expect.toString = bind(unexpected.toString, unexpected);
            expect.assertions = unexpected.assertions;
            expect.installPlugin = bind(unexpected.installPlugin, unexpected);
            return expect;
        }

        function makeExpectFunction(unexpected) {
            var expect = installExpectMethods(unexpected, unexpected.expect);
            unexpected.expect = expect;
            return expect;
        }

        Unexpected.prototype.expect = function expect(subject, testDescriptionString) {
            var that = this;
            if (arguments.length < 2) {
                throw new Error('The expect functions requires at least two parameters.');
            }
            if (typeof testDescriptionString !== 'string') {
                throw new Error('The expect functions requires second parameter to be a string.');
            }
            var assertionRule = this.assertions[testDescriptionString];
            if (assertionRule) {
                var flags = extend({}, assertionRule.flags);
                var nestingLevel = 0;
                var wrappedExpect = function wrappedExpect(subject, testDescriptionString) {
                    testDescriptionString = trim(testDescriptionString.replace(/\[(!?)([^\]]+)\] ?/g, function (match, negate, flag) {
                        negate = !!negate;
                        return flags[flag] !== negate ? flag + ' ' : '';
                    }));

                    var args = Array.prototype.slice.call(arguments, 2);
                    nestingLevel += 1;
                    try {
                        that.expect.apply(that, [subject, testDescriptionString].concat(args));
                        nestingLevel -= 1;
                    } catch (e) {
                        nestingLevel -= 1;
                        if (e._isUnexpected) {
                            truncateStack(e, wrappedExpect);
                        }
                        if (nestingLevel === 0) {
                            handleNestedExpects(e, assertion);
                        }
                        throw e;
                    }
                };

                var args = Array.prototype.slice.call(arguments, 2);
                args.unshift(wrappedExpect, subject);
                var assertion = new Assertion(subject, testDescriptionString, flags, args.slice(2));
                var handler = assertionRule.handler;
                try {
                    handler.apply(assertion, args);
                } catch (e) {
                    if (e._isUnexpected) {
                        truncateStack(e, this.expect);
                    }
                    throw e;
                }
            } else {
                var similarAssertions = this.findAssertionSimilarTo(testDescriptionString);
                var message =
                    'Unknown assertion "' + testDescriptionString + '", ' +
                    'did you mean: "' + similarAssertions[0] + '"';
                var err = new Error(message);
                truncateStack(err, this.expect);
                throw err;
            }
        };

        Unexpected.prototype.toString = function () {
            return getKeys(this.assertions).sort().join('\n');
        };

        Unexpected.prototype.clone = function () {
            var unexpected = new Unexpected(extend({}, this.assertions));
            return makeExpectFunction(unexpected);
        };

        Unexpected.create = function () {
            var unexpected = new Unexpected();
            return makeExpectFunction(unexpected);
        };

        var expandPattern = (function () {
            function isFlag(token) {
                return token.slice(0, 1) === '[' && token.slice(-1) === ']';
            }
            function isAlternation(token) {
                return token.slice(0, 1) === '(' && token.slice(-1) === ')';
            }
            function removeEmptyStrings(texts) {
                return filter(texts, function (text) {
                    return text !== '';
                });
            }
            function createPermutations(tokens, index) {
                if (index === tokens.length) {
                    return [{ text: '', flags: {}}];
                }

                var token = tokens[index];
                var tail = createPermutations(tokens, index + 1);
                if (isFlag(token)) {
                    var flag = token.slice(1, -1);
                    return map(tail, function (pattern) {
                        var flags = {};
                        flags[flag] = true;
                        return {
                            text: flag + ' ' + pattern.text,
                            flags: extend(flags, pattern.flags)
                        };
                    }).concat(map(tail, function (pattern) {
                        var flags = {};
                        flags[flag] = false;
                        return {
                            text: pattern.text,
                            flags: extend(flags, pattern.flags)
                        };
                    }));
                } else if (isAlternation(token)) {
                    var alternations = token.split(/\(|\)|\|/);
                    alternations = removeEmptyStrings(alternations);
                    return reduce(alternations, function (result, alternation) {
                        return result.concat(map(tail, function (pattern) {
                            return {
                                text: alternation + pattern.text,
                                flags: pattern.flags
                            };
                        }));
                    }, []);
                } else {
                    return map(tail, function (pattern) {
                        return {
                            text: token + pattern.text,
                            flags: pattern.flags
                        };
                    });
                }
            }
            return function (pattern) {
                pattern = pattern.replace(/(\[[^\]]+\]) ?/g, '$1');
                var splitRegex = /\[[^\]]+\]|\([^\)]+\)/g;
                var tokens = [];
                var m;
                var lastIndex = 0;
                while ((m = splitRegex.exec(pattern))) {
                    tokens.push(pattern.slice(lastIndex, m.index));
                    tokens.push(pattern.slice(m.index, splitRegex.lastIndex));
                    lastIndex = splitRegex.lastIndex;
                }
                tokens.push(pattern.slice(lastIndex));

                tokens = removeEmptyStrings(tokens);
                var permutations = createPermutations(tokens, 0);
                forEach(permutations, function (permutation) {
                    permutation.text = trim(permutation.text);
                    if (permutation.text === '') {
                        // This can only happen if the pattern only contains flags
                        throw new Error("Assertion patterns must not only contain flags");
                    }
                });
                return permutations;
            };
        }());


        function ensureValidUseOfParenthesesOrBrackets(pattern) {
            var counts = {
                '[': 0,
                ']': 0,
                '(': 0,
                ')': 0
            };
            for (var i = 0; i < pattern.length; i += 1) {
                var c = pattern.charAt(i);
                if (c in counts) {
                    counts[c] += 1;
                }
                if (c === ']' && counts['['] >= counts[']']) {
                    if (counts['['] === counts[']'] + 1) {
                        throw new Error("Assertion patterns must not contain flags with brackets: '" + pattern + "'");
                    }

                    if (counts['('] !== counts[')']) {
                        throw new Error("Assertion patterns must not contain flags with parentheses: '" + pattern + "'");
                    }

                    if (pattern.charAt(i - 1) === '[') {
                        throw new Error("Assertion patterns must not contain empty flags: '" + pattern + "'");
                    }
                } else if (c === ')' && counts['('] >= counts[')']) {
                    if (counts['('] === counts[')'] + 1) {
                        throw new Error("Assertion patterns must not contain alternations with parentheses: '" + pattern + "'");
                    }

                    if (counts['['] !== counts[']']) {
                        throw new Error("Assertion patterns must not contain alternations with brackets: '" + pattern + "'");
                    }
                }

                if ((c === ')' || c === '|') && counts['('] >= counts[')']) {
                    if (pattern.charAt(i - 1) === '(' || pattern.charAt(i - 1) === '|') {
                        throw new Error("Assertion patterns must not contain empty alternations: '" + pattern + "'");
                    }
                }
            }

            if (counts['['] !== counts[']']) {
                throw new Error("Assertion patterns must not contain unbalanced brackets: '" + pattern + "'");
            }

            if (counts['('] !== counts[')']) {
                throw new Error("Assertion patterns must not contain unbalanced parentheses: '" + pattern + "'");
            }
        }

        function ensureValidPattern(pattern) {
            if (typeof pattern !== 'string' || pattern === '') {
                throw new Error("Assertion patterns must be a non empty string");
            }
            if (pattern.match(/^\s|\s$/)) {
                throw new Error("Assertion patterns can't start or end with whitespace");
            }

            ensureValidUseOfParenthesesOrBrackets(pattern);
        }


        Assertion.prototype.inspect = inspect;
        Assertion.prototype.eql = equal; // Deprecated
        Assertion.prototype.equal = equal;

        namespace.expect = Unexpected.create();
    }());
    
    (function () {
        var expect = namespace.expect;

        var shim = namespace.shim;
        var forEach = shim.forEach;
        var getKeys = shim.getKeys;
        var every = shim.every;
        var indexOf = shim.indexOf;

        var utils = namespace.utils;
        var isRegExp = utils.isRegExp;
        var isArray = utils.isArray;

        expect.addAssertion('[not] to be (ok|truthy)', function (expect, subject) {
            this.assert(subject);
        });

        expect.addAssertion('[not] to be', function (expect, subject, value) {
            expect(subject === value, '[not] to be truthy');
        });

        expect.addAssertion('[not] to be true', function (expect, subject) {
            expect(subject, '[not] to be', true);
        });

        expect.addAssertion('[not] to be false', function (expect, subject) {
            expect(subject, '[not] to be', false);
        });

        expect.addAssertion('[not] to be falsy', function (expect, subject) {
            expect(subject, '[!not] to be truthy');
        });

        expect.addAssertion('[not] to be null', function (expect, subject) {
            expect(subject, '[not] to be', null);
        });

        expect.addAssertion('[not] to be undefined', function (expect, subject) {
            expect(typeof subject, '[not] to be', 'undefined');
        });

        expect.addAssertion('[not] to be NaN', function (expect, subject) {
            expect(isNaN(subject), '[not] to be true');
        });

        expect.addAssertion('[not] to be (a|an)', function (expect, subject, type) {
            if ('string' === typeof type) {
                // typeof with support for 'array'
                expect('array' === type ? isArray(subject) :
                        'object' === type ? 'object' === typeof subject && null !== subject :
                            /^reg(?:exp?|ular expression)$/.test(type) ? isRegExp(subject) :
                                type === typeof subject,
                       '[not] to be true');
            } else {
                expect(subject instanceof type, '[not] to be true');
            }

            return this;
        });

        // Alias for common '[not] to be (a|an)' assertions
        expect.addAssertion('[not] to be (a|an) (boolean|number|string|function|object|array|regexp|regex|regular expression)', function (expect, subject) {
            var matches = /(.* be (?:a|an)) ([\w\s]+)/.exec(this.testDescription);
            expect(subject, matches[1], matches[2]);
        });

        forEach(['string', 'array', 'object'], function (type) {
            expect.addAssertion('to be (the|an) empty ' + type, function (expect, subject) {
                expect(subject, 'to be a', type);
                expect(subject, 'to be empty');
            });

            expect.addAssertion('to be a non-empty ' + type, function (expect, subject) {
                expect(subject, 'to be a', type);
                expect(subject, 'not to be empty');
            });
        });

        expect.addAssertion('[not] to match', function (expect, subject, regexp) {
            expect(regexp.exec(subject), '[not] to be truthy');
        });

        expect.addAssertion('[not] to have [own] property', function (expect, subject, key, value) {
            if (arguments.length === 4) {
                expect(subject, 'to have [own] property', key);
                expect(subject[key], '[not] to equal', value);
            } else {
                expect(this.flags.own ?
                       subject && subject.hasOwnProperty(key) :
                       subject && subject[key] !== undefined,
                       '[not] to be truthy');
            }
        });

        expect.addAssertion('[not] to have [own] properties', function (expect, subject, properties) {
            if (properties && isArray(properties)) {
                forEach(properties, function (property) {
                    expect(subject, '[not] to have [own] property', property);
                });
            } else if (properties && typeof properties === 'object') {
                // TODO the not flag does not make a lot of sense in this case
                forEach(getKeys(properties), function (property) {
                    if (this.flags.not) {
                        expect(subject, 'not to have [own] property', property);
                    } else {
                        expect(subject, 'to have [own] property', property, properties[property]);
                    }
                }, this);
            } else {
                throw new Error("Assertion '" + this.testDescription + "' only supports " +
                                "input in the form of an Array or an Object.");
            }
        });

        expect.addAssertion('[not] to have length', function (expect, subject, length) {
            if (!subject || typeof subject.length !== 'number') {
                throw new Error("Assertion '" + this.testDescription +
                                "' only supports array like objects");
            }
            expect(subject.length, '[not] to be', length);
        });

        expect.addAssertion('[not] to be empty', function (expect, subject) {
            var length;
            if (subject && 'number' === typeof subject.length) {
                length = subject.length;
            } else if (isArray(subject) || typeof subject === 'string') {
                length = subject.length;
            } else if (subject && typeof subject === 'object') {
                length = getKeys(subject).length;
            } else {
                throw new Error("Assertion '" + this.testDescription +
                                "' only supports strings, arrays and objects");
            }
            expect(length, '[not] to be', 0);
        });

        expect.addAssertion('to be non-empty', function (expect, subject) {
            expect(subject, 'not to be empty');
        });

        expect.addAssertion('to [not] [only] have (key|keys)', '[not] to have (key|keys)', function (expect, subject, keys) {
            keys = isArray(keys) ?
                keys :
                Array.prototype.slice.call(arguments, 2);

            var hasKeys = subject && every(keys, function (key) {
                return subject.hasOwnProperty(key);
            });
            if (this.flags.only) {
                expect(hasKeys && getKeys(subject).length === keys.length, '[not] to be truthy');
            } else {
                expect(hasKeys, '[not] to be truthy');
            }
        });

        expect.addAssertion('[not] to contain', function (expect, subject, arg) {
            var args = Array.prototype.slice.call(arguments, 2);
            var that = this;

            if ('string' === typeof subject) {
                forEach(args, function (arg) {
                    expect(subject.indexOf(arg) !== -1, '[not] to be truthy');
                });
            } else if (isArray(subject)) {
                forEach(args, function (arg) {
                    expect(subject && indexOf(subject, arg) !== -1, '[not] to be truthy');
                });
            } else if (subject === null) {
                expect(that.flags.not, '[not] to be falsy');
            } else {
                throw new Error("Assertion '" + this.testDescription +
                                "' only supports strings and arrays");
            }
        });

        expect.addAssertion('[not] to be finite', function (expect, subject) {
            expect(typeof subject === 'number' && isFinite(subject), '[not] to be truthy');
        });

        expect.addAssertion('[not] to be infinite', function (expect, subject) {
            expect(typeof subject === 'number' && !isNaN(subject) && !isFinite(subject), '[not] to be truthy');
        });

        expect.addAssertion('[not] to be within', function (expect, subject, start, finish) {
            this.args = [start + '..' + finish];
            expect(subject, 'to be a number');
            expect(subject >= start && subject <= finish, '[not] to be true');
        });

        expect.addAssertion('<', 'to be (<|less than|below)', function (expect, subject, value) {
            expect(subject < value, 'to be true');
        });

        expect.addAssertion('<=', 'to be (<=|less than or equal to)', function (expect, subject, value) {
            expect(subject <= value, 'to be true');
        });

        expect.addAssertion('>', 'to be (>|greater than|above)', function (expect, subject, value) {
            expect(subject > value, 'to be true');
        });

        expect.addAssertion('>=', 'to be (>=|greater than or equal to)', function (expect, subject, value) {
            expect(subject >= value, 'to be true');
        });

        expect.addAssertion('to be positive', function (expect, subject) {
            expect(subject, '>', 0);
        });

        expect.addAssertion('to be negative', function (expect, subject) {
            expect(subject, '<', 0);
        });

        expect.addAssertion('[not] to equal', function (expect, subject, value) {
            try {
                expect(this.equal(value, subject), '[not] to be true');
            } catch (e) {
                if (!this.flags.not) {
                    e.expected = value;
                    e.actual = subject;
                    // Explicitly tell mocha to stringify and diff arrays
                    // and objects, but only when the types are identical
                    // and non-primitive:
                    if (e.actual && e.expected &&
                        typeof e.actual === 'object' &&
                        typeof e.expected === 'object' &&
                        isArray(e.actual) === isArray(e.expected)) {
                        e.showDiff = true;
                    }
                }
                throw e;
            }
        });

        expect.addAssertion('[not] to (throw|throw error|throw exception)', function (expect, subject, arg) {
            this.errorMode = 'bubble';
            if (typeof subject !== 'function') {
                throw new Error("Assertion '" + this.testDescription +
                                "' only supports functions");
            }

            var thrown = false;
            var argType = typeof arg;

            try {
                subject();
            } catch (e) {
                var subject = 'string' === typeof e ? e : e.message;
                if ('function' === argType) {
                    arg(e);
                } else if ('string' === argType) {
                    expect(subject, '[not] to be', arg);
                } else if (isRegExp(arg)) {
                    expect(subject, '[not] to match', arg);
                }
                thrown = true;
            }

            this.errorMode = 'default';
            if ('string' === argType || isRegExp(arg)) {
                // in the presence of a matcher, ensure the `not` only applies to
                // the matching.
                expect(thrown, 'to be true');
            } else {
                expect(thrown, '[not] to be true');
            }
        });

        expect.addAssertion('to be (a|an) [non-empty] (map|hash|object) whose values satisfy', function (expect, subject, callbackOrString) {
            var callback;
            if ('function' === typeof callbackOrString) {
                callback = callbackOrString;
            } else if ('string' === typeof callbackOrString) {
                var args = Array.prototype.slice.call(arguments, 2);
                callback = function (value) {
                    expect.apply(expect, [value].concat(args));
                };
            } else {
                throw new Error('Assertions "' + this.testDescription + '" expects a functions as argument');
            }
            this.errorMode = 'nested';
            expect(subject, 'to be an object');
            if (this.flags['non-empty']) {
                expect(subject, 'to be non-empty');
            }
            this.errorMode = 'default';

            var errors = [];
            forEach(getKeys(subject), function (key, index) {
                try {
                    callback(subject[key], index);
                } catch (e) {
                    errors.push('    ' + key + ': ' + e.message.replace(/\n/g, '\n    '));
                }
            });

            if (errors.length > 0) {
                var objectString = this.inspect(subject);
                var prefix = /\n/.test(objectString) ? '\n' : ' ';
                var message = 'failed expectation in' + prefix + objectString + ':\n' +
                    errors.join('\n');
                throw new Error(message);
            }
        });

        expect.addAssertion('to be (a|an) [non-empty] array whose items satisfy', function (expect, subject, callbackOrString) {
            var callback;
            if ('function' === typeof callbackOrString) {
                callback = callbackOrString;
            } else if ('string' === typeof callbackOrString) {
                var args = Array.prototype.slice.call(arguments, 2);
                callback = function (item) {
                    expect.apply(expect, [item].concat(args));
                };
            } else {
                throw new Error('Assertions "' + this.testDescription + '" expects a functions as argument');
            }
            this.errorMode = 'nested';
            expect(subject, 'to be an array');
            if (this.flags['non-empty']) {
                expect(subject, 'to be non-empty');
            }
            this.errorMode = 'bubble';
            expect(subject, 'to be a map whose values satisfy', callback);
        });

        forEach(['string', 'number', 'boolean', 'array', 'object', 'function', 'regexp', 'regex', 'regular expression'], function (type) {
            expect.addAssertion('to be (a|an) [non-empty] array of ' + type + 's', function (expect, subject) {
                expect(subject, 'to be an array whose items satisfy', function (item) {
                    expect(item, 'to be a', type);
                });
                if (this.flags['non-empty']) {
                    expect(subject, 'to be non-empty');
                }
            });
        });

        expect.addAssertion('to be (a|an) [non-empty] (map|hash|object) whose keys satisfy', function (expect, subject, callbackOrString) {
            var callback;
            if ('function' === typeof callbackOrString) {
                this.errorMode = 'nested';
                callback = callbackOrString;
            } else if ('string' === typeof callbackOrString) {
                var args = Array.prototype.slice.call(arguments, 2);
                callback = function (key) {
                    expect.apply(expect, [key].concat(args));
                };
            } else {
                throw new Error('Assertions "' + this.testDescription + '" expects a functions as argument');
            }
            this.errorMode = 'nested';
            expect(subject, 'to be an object');
            if (this.flags['non-empty']) {
                expect(subject, 'to be non-empty');
            }
            this.errorMode = 'default';

            var errors = [];
            var keys = getKeys(subject);
            forEach(keys, function (key) {
                try {
                    callback(key);
                } catch (e) {
                    errors.push('    ' + key + ': ' + e.message.replace(/\n/g, '\n    '));
                }
            });

            if (errors.length > 0) {
                var message = 'failed expectation on keys ' + keys.join(', ') + ':\n' +
                    errors.join('\n');
                throw new Error(message);
            }
        });
    }());
    
    (function () {
        var global = this;
        var expect = namespace.expect;

        // Support three module loading scenarios
        if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
            // CommonJS/Node.js
            module.exports = expect;
        } else if (typeof define === 'function' && define.amd) {
            // AMD anonymous module
            define(function () {
                return expect;
            });
        } else {
            // No module loader (plain <script> tag) - put directly in global namespace
            global.weknowhow = global.weknowhow || {};
            global.weknowhow.expect = expect;
        }
    }());
}());
