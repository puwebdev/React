(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(require,module,exports){
module.exports = function(opts) {
  return new ElementClass(opts)
}

function indexOf(arr, prop) {
  if (arr.indexOf) return arr.indexOf(prop)
  for (var i = 0, len = arr.length; i < len; i++)
    if (arr[i] === prop) return i
  return -1
}

function ElementClass(opts) {
  if (!(this instanceof ElementClass)) return new ElementClass(opts)
  var self = this
  if (!opts) opts = {}

  // similar doing instanceof HTMLElement but works in IE8
  if (opts.nodeType) opts = {el: opts}

  this.opts = opts
  this.el = opts.el || document.body
  if (typeof this.el !== 'object') this.el = document.querySelector(this.el)
}

ElementClass.prototype.add = function(className) {
  var el = this.el
  if (!el) return
  if (el.className === "") return el.className = className
  var classes = el.className.split(' ')
  if (indexOf(classes, className) > -1) return classes
  classes.push(className)
  el.className = classes.join(' ')
  return classes
}

ElementClass.prototype.remove = function(className) {
  var el = this.el
  if (!el) return
  if (el.className === "") return
  var classes = el.className.split(' ')
  var idx = indexOf(classes, className)
  if (idx > -1) classes.splice(idx, 1)
  el.className = classes.join(' ')
  return classes
}

ElementClass.prototype.has = function(className) {
  var el = this.el
  if (!el) return
  var classes = el.className.split(' ')
  return indexOf(classes, className) > -1
}

ElementClass.prototype.toggle = function(className) {
  var el = this.el
  if (!el) return
  if (this.has(className)) this.remove(className)
  else this.add(className)
}

},{}],3:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

module.exports = ExecutionEnvironment;
},{}],4:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

function invariant(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))
},{"_process":7}],5:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/**
 * Allows extraction of a minified key. Let's the build system minify keys
 * without losing the ability to dynamically use key strings as values
 * themselves. Pass in an object with a single key/val pair and it will return
 * you the string key of that single record. Suppose you want to grab the
 * value for a key 'className' inside of an object. Key/val minification may
 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
 * reuse those resolutions.
 */
var keyOf = function keyOf(oneKeyObj) {
  var key;
  for (key in oneKeyObj) {
    if (!oneKeyObj.hasOwnProperty(key)) {
      continue;
    }
    return key;
  }
  return null;
};

module.exports = keyOf;
},{}],6:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],7:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;
/**
 * Indicates that navigation was caused by a call to history.push.
 */
var PUSH = exports.PUSH = 'PUSH';

/**
 * Indicates that navigation was caused by a call to history.replace.
 */
var REPLACE = exports.REPLACE = 'REPLACE';

/**
 * Indicates that navigation was caused by some other action such
 * as using a browser's back/forward buttons and/or manually manipulating
 * the URL in a browser's location bar. This is the default.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
 * for more information.
 */
var POP = exports.POP = 'POP';
},{}],9:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var loopAsync = exports.loopAsync = function loopAsync(turns, work, callback) {
  var currentTurn = 0,
      isDone = false;
  var isSync = false,
      hasNext = false,
      doneArgs = void 0;

  var done = function done() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    isDone = true;

    if (isSync) {
      // Iterate instead of recursing if possible.
      doneArgs = args;
      return;
    }

    callback.apply(undefined, args);
  };

  var next = function next() {
    if (isDone) return;

    hasNext = true;

    if (isSync) return; // Iterate instead of recursing if possible.

    isSync = true;

    while (!isDone && currentTurn < turns && hasNext) {
      hasNext = false;
      work(currentTurn++, next, done);
    }

    isSync = false;

    if (isDone) {
      // This means the loop finished synchronously.
      callback.apply(undefined, doneArgs);
      return;
    }

    if (currentTurn >= turns && hasNext) {
      isDone = true;
      callback();
    }
  };

  next();
};
},{}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.go = exports.replaceLocation = exports.pushLocation = exports.startListener = exports.getUserConfirmation = exports.getCurrentLocation = undefined;

var _LocationUtils = require('./LocationUtils');

var _DOMUtils = require('./DOMUtils');

var _DOMStateStorage = require('./DOMStateStorage');

var _PathUtils = require('./PathUtils');

var _ExecutionEnvironment = require('./ExecutionEnvironment');

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

var needsHashchangeListener = _ExecutionEnvironment.canUseDOM && !(0, _DOMUtils.supportsPopstateOnHashchange)();

var _createLocation = function _createLocation(historyState) {
  var key = historyState && historyState.key;

  return (0, _LocationUtils.createLocation)({
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: key ? (0, _DOMStateStorage.readState)(key) : undefined
  }, undefined, key);
};

var getCurrentLocation = exports.getCurrentLocation = function getCurrentLocation() {
  var historyState = void 0;
  try {
    historyState = window.history.state || {};
  } catch (error) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    historyState = {};
  }

  return _createLocation(historyState);
};

var getUserConfirmation = exports.getUserConfirmation = function getUserConfirmation(message, callback) {
  return callback(window.confirm(message));
}; // eslint-disable-line no-alert

var startListener = exports.startListener = function startListener(listener) {
  var handlePopState = function handlePopState(event) {
    if (event.state !== undefined) // Ignore extraneous popstate events in WebKit
      listener(_createLocation(event.state));
  };

  (0, _DOMUtils.addEventListener)(window, PopStateEvent, handlePopState);

  var handleUnpoppedHashChange = function handleUnpoppedHashChange() {
    return listener(getCurrentLocation());
  };

  if (needsHashchangeListener) {
    (0, _DOMUtils.addEventListener)(window, HashChangeEvent, handleUnpoppedHashChange);
  }

  return function () {
    (0, _DOMUtils.removeEventListener)(window, PopStateEvent, handlePopState);

    if (needsHashchangeListener) {
      (0, _DOMUtils.removeEventListener)(window, HashChangeEvent, handleUnpoppedHashChange);
    }
  };
};

var updateLocation = function updateLocation(location, updateState) {
  var state = location.state;
  var key = location.key;


  if (state !== undefined) (0, _DOMStateStorage.saveState)(key, state);

  updateState({ key: key }, (0, _PathUtils.createPath)(location));
};

var pushLocation = exports.pushLocation = function pushLocation(location) {
  return updateLocation(location, function (state, path) {
    return window.history.pushState(state, null, path);
  });
};

var replaceLocation = exports.replaceLocation = function replaceLocation(location) {
  return updateLocation(location, function (state, path) {
    return window.history.replaceState(state, null, path);
  });
};

var go = exports.go = function go(n) {
  if (n) window.history.go(n);
};
},{"./DOMStateStorage":11,"./DOMUtils":12,"./ExecutionEnvironment":13,"./LocationUtils":15,"./PathUtils":16}],11:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.readState = exports.saveState = undefined;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuotaExceededErrors = {
  QuotaExceededError: true,
  QUOTA_EXCEEDED_ERR: true
};

var SecurityErrors = {
  SecurityError: true
};

var KeyPrefix = '@@History/';

var createKey = function createKey(key) {
  return KeyPrefix + key;
};

var saveState = exports.saveState = function saveState(key, state) {
  if (!window.sessionStorage) {
    // Session storage is not available or hidden.
    // sessionStorage is undefined in Internet Explorer when served via file protocol.
    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, '[history] Unable to save state; sessionStorage is not available') : void 0;

    return;
  }

  try {
    if (state == null) {
      window.sessionStorage.removeItem(createKey(key));
    } else {
      window.sessionStorage.setItem(createKey(key), JSON.stringify(state));
    }
  } catch (error) {
    if (SecurityErrors[error.name]) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, '[history] Unable to save state; sessionStorage is not available due to security settings') : void 0;

      return;
    }

    if (QuotaExceededErrors[error.name] && window.sessionStorage.length === 0) {
      // Safari "private mode" throws QuotaExceededError.
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, '[history] Unable to save state; sessionStorage is not available in Safari private mode') : void 0;

      return;
    }

    throw error;
  }
};

var readState = exports.readState = function readState(key) {
  var json = void 0;
  try {
    json = window.sessionStorage.getItem(createKey(key));
  } catch (error) {
    if (SecurityErrors[error.name]) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, '[history] Unable to read state; sessionStorage is not available due to security settings') : void 0;

      return undefined;
    }
  }

  if (json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      // Ignore invalid JSON.
    }
  }

  return undefined;
};
}).call(this,require('_process'))
},{"_process":7,"warning":359}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var addEventListener = exports.addEventListener = function addEventListener(node, event, listener) {
  return node.addEventListener ? node.addEventListener(event, listener, false) : node.attachEvent('on' + event, listener);
};

var removeEventListener = exports.removeEventListener = function removeEventListener(node, event, listener) {
  return node.removeEventListener ? node.removeEventListener(event, listener, false) : node.detachEvent('on' + event, listener);
};

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
var supportsHistory = exports.supportsHistory = function supportsHistory() {
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;

  return window.history && 'pushState' in window.history;
};

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */
var supportsGoWithoutReloadUsingHash = exports.supportsGoWithoutReloadUsingHash = function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
};

/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */
var supportsPopstateOnHashchange = exports.supportsPopstateOnHashchange = function supportsPopstateOnHashchange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
};
},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var canUseDOM = exports.canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
},{}],14:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.replaceLocation = exports.pushLocation = exports.startListener = exports.getCurrentLocation = exports.go = exports.getUserConfirmation = undefined;

var _BrowserProtocol = require('./BrowserProtocol');

Object.defineProperty(exports, 'getUserConfirmation', {
  enumerable: true,
  get: function get() {
    return _BrowserProtocol.getUserConfirmation;
  }
});
Object.defineProperty(exports, 'go', {
  enumerable: true,
  get: function get() {
    return _BrowserProtocol.go;
  }
});

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _LocationUtils = require('./LocationUtils');

var _DOMUtils = require('./DOMUtils');

var _DOMStateStorage = require('./DOMStateStorage');

var _PathUtils = require('./PathUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HashChangeEvent = 'hashchange';

var getHashPath = function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
};

var pushHashPath = function pushHashPath(path) {
  return window.location.hash = path;
};

var replaceHashPath = function replaceHashPath(path) {
  var hashIndex = window.location.href.indexOf('#');

  window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
};

var getCurrentLocation = exports.getCurrentLocation = function getCurrentLocation(pathCoder, queryKey) {
  var path = pathCoder.decodePath(getHashPath());
  var key = (0, _PathUtils.getQueryStringValueFromPath)(path, queryKey);

  var state = void 0;
  if (key) {
    path = (0, _PathUtils.stripQueryStringValueFromPath)(path, queryKey);
    state = (0, _DOMStateStorage.readState)(key);
  }

  var init = (0, _PathUtils.parsePath)(path);
  init.state = state;

  return (0, _LocationUtils.createLocation)(init, undefined, key);
};

var prevLocation = void 0;

var startListener = exports.startListener = function startListener(listener, pathCoder, queryKey) {
  var handleHashChange = function handleHashChange() {
    var path = getHashPath();
    var encodedPath = pathCoder.encodePath(path);

    if (path !== encodedPath) {
      // Always be sure we have a properly-encoded hash.
      replaceHashPath(encodedPath);
    } else {
      var currentLocation = getCurrentLocation(pathCoder, queryKey);

      if (prevLocation && currentLocation.key && prevLocation.key === currentLocation.key) return; // Ignore extraneous hashchange events

      prevLocation = currentLocation;

      listener(currentLocation);
    }
  };

  // Ensure the hash is encoded properly.
  var path = getHashPath();
  var encodedPath = pathCoder.encodePath(path);

  if (path !== encodedPath) replaceHashPath(encodedPath);

  (0, _DOMUtils.addEventListener)(window, HashChangeEvent, handleHashChange);

  return function () {
    return (0, _DOMUtils.removeEventListener)(window, HashChangeEvent, handleHashChange);
  };
};

var updateLocation = function updateLocation(location, pathCoder, queryKey, updateHash) {
  var state = location.state;
  var key = location.key;


  var path = pathCoder.encodePath((0, _PathUtils.createPath)(location));

  if (state !== undefined) {
    path = (0, _PathUtils.addQueryStringValueToPath)(path, queryKey, key);
    (0, _DOMStateStorage.saveState)(key, state);
  }

  prevLocation = location;

  updateHash(path);
};

var pushLocation = exports.pushLocation = function pushLocation(location, pathCoder, queryKey) {
  return updateLocation(location, pathCoder, queryKey, function (path) {
    if (getHashPath() !== path) {
      pushHashPath(path);
    } else {
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'You cannot PUSH the same path using hash history') : void 0;
    }
  });
};

var replaceLocation = exports.replaceLocation = function replaceLocation(location, pathCoder, queryKey) {
  return updateLocation(location, pathCoder, queryKey, function (path) {
    if (getHashPath() !== path) replaceHashPath(path);
  });
};
}).call(this,require('_process'))
},{"./BrowserProtocol":10,"./DOMStateStorage":11,"./DOMUtils":12,"./LocationUtils":15,"./PathUtils":16,"_process":7,"warning":359}],15:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.locationsAreEqual = exports.statesAreEqual = exports.createLocation = exports.createQuery = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _PathUtils = require('./PathUtils');

var _Actions = require('./Actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createQuery = exports.createQuery = function createQuery(props) {
  return _extends(Object.create(null), props);
};

var createLocation = exports.createLocation = function createLocation() {
  var input = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
  var action = arguments.length <= 1 || arguments[1] === undefined ? _Actions.POP : arguments[1];
  var key = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var object = typeof input === 'string' ? (0, _PathUtils.parsePath)(input) : input;

  process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(!object.path, 'Location descriptor objects should have a `pathname`, not a `path`.') : void 0;

  var pathname = object.pathname || '/';
  var search = object.search || '';
  var hash = object.hash || '';
  var state = object.state;

  return {
    pathname: pathname,
    search: search,
    hash: hash,
    state: state,
    action: action,
    key: key
  };
};

var isDate = function isDate(object) {
  return Object.prototype.toString.call(object) === '[object Date]';
};

var statesAreEqual = exports.statesAreEqual = function statesAreEqual(a, b) {
  if (a === b) return true;

  var typeofA = typeof a === 'undefined' ? 'undefined' : _typeof(a);
  var typeofB = typeof b === 'undefined' ? 'undefined' : _typeof(b);

  if (typeofA !== typeofB) return false;

  !(typeofA !== 'function') ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'You must not store functions in location state') : (0, _invariant2.default)(false) : void 0;

  // Not the same object, but same type.
  if (typeofA === 'object') {
    !!(isDate(a) && isDate(b)) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'You must not store Date objects in location state') : (0, _invariant2.default)(false) : void 0;

    if (!Array.isArray(a)) {
      var keysofA = Object.keys(a);
      var keysofB = Object.keys(b);
      return keysofA.length === keysofB.length && keysofA.every(function (key) {
        return statesAreEqual(a[key], b[key]);
      });
    }

    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
      return statesAreEqual(item, b[index]);
    });
  }

  // All other serializable types (string, number, boolean)
  // should be strict equal.
  return false;
};

var locationsAreEqual = exports.locationsAreEqual = function locationsAreEqual(a, b) {
  return a.key === b.key &&
  // a.action === b.action && // Different action !== location change.
  a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && statesAreEqual(a.state, b.state);
};
}).call(this,require('_process'))
},{"./Actions":8,"./PathUtils":16,"_process":7,"invariant":27,"warning":359}],16:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.createPath = exports.parsePath = exports.getQueryStringValueFromPath = exports.stripQueryStringValueFromPath = exports.addQueryStringValueToPath = undefined;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addQueryStringValueToPath = exports.addQueryStringValueToPath = function addQueryStringValueToPath(path, key, value) {
  var _parsePath = parsePath(path);

  var pathname = _parsePath.pathname;
  var search = _parsePath.search;
  var hash = _parsePath.hash;


  return createPath({
    pathname: pathname,
    search: search + (search.indexOf('?') === -1 ? '?' : '&') + key + '=' + value,
    hash: hash
  });
};

var stripQueryStringValueFromPath = exports.stripQueryStringValueFromPath = function stripQueryStringValueFromPath(path, key) {
  var _parsePath2 = parsePath(path);

  var pathname = _parsePath2.pathname;
  var search = _parsePath2.search;
  var hash = _parsePath2.hash;


  return createPath({
    pathname: pathname,
    search: search.replace(new RegExp('([?&])' + key + '=[a-zA-Z0-9]+(&?)'), function (match, prefix, suffix) {
      return prefix === '?' ? prefix : suffix;
    }),
    hash: hash
  });
};

var getQueryStringValueFromPath = exports.getQueryStringValueFromPath = function getQueryStringValueFromPath(path, key) {
  var _parsePath3 = parsePath(path);

  var search = _parsePath3.search;

  var match = search.match(new RegExp('[?&]' + key + '=([a-zA-Z0-9]+)'));
  return match && match[1];
};

var extractPath = function extractPath(string) {
  var match = string.match(/^(https?:)?\/\/[^\/]*/);
  return match == null ? string : string.substring(match[0].length);
};

var parsePath = exports.parsePath = function parsePath(path) {
  var pathname = extractPath(path);
  var search = '';
  var hash = '';

  process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(path === pathname, 'A path must be pathname + search + hash only, not a full URL like "%s"', path) : void 0;

  var hashIndex = pathname.indexOf('#');
  if (hashIndex !== -1) {
    hash = pathname.substring(hashIndex);
    pathname = pathname.substring(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');
  if (searchIndex !== -1) {
    search = pathname.substring(searchIndex);
    pathname = pathname.substring(0, searchIndex);
  }

  if (pathname === '') pathname = '/';

  return {
    pathname: pathname,
    search: search,
    hash: hash
  };
};

var createPath = exports.createPath = function createPath(location) {
  if (location == null || typeof location === 'string') return location;

  var basename = location.basename;
  var pathname = location.pathname;
  var search = location.search;
  var hash = location.hash;

  var path = (basename || '') + pathname;

  if (search && search !== '?') path += search;

  if (hash) path += hash;

  return path;
};
}).call(this,require('_process'))
},{"_process":7,"warning":359}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.replaceLocation = exports.pushLocation = exports.getCurrentLocation = exports.go = exports.getUserConfirmation = undefined;

var _BrowserProtocol = require('./BrowserProtocol');

Object.defineProperty(exports, 'getUserConfirmation', {
  enumerable: true,
  get: function get() {
    return _BrowserProtocol.getUserConfirmation;
  }
});
Object.defineProperty(exports, 'go', {
  enumerable: true,
  get: function get() {
    return _BrowserProtocol.go;
  }
});

var _LocationUtils = require('./LocationUtils');

var _PathUtils = require('./PathUtils');

var getCurrentLocation = exports.getCurrentLocation = function getCurrentLocation() {
  return (0, _LocationUtils.createLocation)(window.location);
};

var pushLocation = exports.pushLocation = function pushLocation(location) {
  window.location.href = (0, _PathUtils.createPath)(location);
  return false; // Don't update location
};

var replaceLocation = exports.replaceLocation = function replaceLocation(location) {
  window.location.replace((0, _PathUtils.createPath)(location));
  return false; // Don't update location
};
},{"./BrowserProtocol":10,"./LocationUtils":15,"./PathUtils":16}],18:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _ExecutionEnvironment = require('./ExecutionEnvironment');

var _BrowserProtocol = require('./BrowserProtocol');

var BrowserProtocol = _interopRequireWildcard(_BrowserProtocol);

var _RefreshProtocol = require('./RefreshProtocol');

var RefreshProtocol = _interopRequireWildcard(_RefreshProtocol);

var _DOMUtils = require('./DOMUtils');

var _createHistory = require('./createHistory');

var _createHistory2 = _interopRequireDefault(_createHistory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates and returns a history object that uses HTML5's history API
 * (pushState, replaceState, and the popstate event) to manage history.
 * This is the recommended method of managing history in browsers because
 * it provides the cleanest URLs.
 *
 * Note: In browsers that do not support the HTML5 history API full
 * page reloads will be used to preserve clean URLs. You can force this
 * behavior using { forceRefresh: true } in options.
 */
var createBrowserHistory = function createBrowserHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Browser history needs a DOM') : (0, _invariant2.default)(false) : void 0;

  var useRefresh = options.forceRefresh || !(0, _DOMUtils.supportsHistory)();
  var Protocol = useRefresh ? RefreshProtocol : BrowserProtocol;

  var getUserConfirmation = Protocol.getUserConfirmation;
  var getCurrentLocation = Protocol.getCurrentLocation;
  var pushLocation = Protocol.pushLocation;
  var replaceLocation = Protocol.replaceLocation;
  var go = Protocol.go;


  var history = (0, _createHistory2.default)(_extends({
    getUserConfirmation: getUserConfirmation }, options, {
    getCurrentLocation: getCurrentLocation,
    pushLocation: pushLocation,
    replaceLocation: replaceLocation,
    go: go
  }));

  var listenerCount = 0,
      stopListener = void 0;

  var startListener = function startListener(listener, before) {
    if (++listenerCount === 1) stopListener = BrowserProtocol.startListener(history.transitionTo);

    var unlisten = before ? history.listenBefore(listener) : history.listen(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0) stopListener();
    };
  };

  var listenBefore = function listenBefore(listener) {
    return startListener(listener, true);
  };

  var listen = function listen(listener) {
    return startListener(listener, false);
  };

  return _extends({}, history, {
    listenBefore: listenBefore,
    listen: listen
  });
};

exports.default = createBrowserHistory;
}).call(this,require('_process'))
},{"./BrowserProtocol":10,"./DOMUtils":12,"./ExecutionEnvironment":13,"./RefreshProtocol":17,"./createHistory":20,"_process":7,"invariant":27}],19:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _ExecutionEnvironment = require('./ExecutionEnvironment');

var _DOMUtils = require('./DOMUtils');

var _HashProtocol = require('./HashProtocol');

var HashProtocol = _interopRequireWildcard(_HashProtocol);

var _createHistory = require('./createHistory');

var _createHistory2 = _interopRequireDefault(_createHistory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultQueryKey = '_k';

var addLeadingSlash = function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
};

var HashPathCoders = {
  hashbang: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '!' ? path : '!' + path;
    },
    decodePath: function decodePath(path) {
      return path.charAt(0) === '!' ? path.substring(1) : path;
    }
  },
  noslash: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '/' ? path.substring(1) : path;
    },
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
};

var createHashHistory = function createHashHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Hash history needs a DOM') : (0, _invariant2.default)(false) : void 0;

  var queryKey = options.queryKey;
  var hashType = options.hashType;


  process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(queryKey !== false, 'Using { queryKey: false } no longer works. Instead, just don\'t ' + 'use location state if you don\'t want a key in your URL query string') : void 0;

  if (typeof queryKey !== 'string') queryKey = DefaultQueryKey;

  if (hashType == null) hashType = 'slash';

  if (!(hashType in HashPathCoders)) {
    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'Invalid hash type: %s', hashType) : void 0;

    hashType = 'slash';
  }

  var pathCoder = HashPathCoders[hashType];

  var getUserConfirmation = HashProtocol.getUserConfirmation;


  var getCurrentLocation = function getCurrentLocation() {
    return HashProtocol.getCurrentLocation(pathCoder, queryKey);
  };

  var pushLocation = function pushLocation(location) {
    return HashProtocol.pushLocation(location, pathCoder, queryKey);
  };

  var replaceLocation = function replaceLocation(location) {
    return HashProtocol.replaceLocation(location, pathCoder, queryKey);
  };

  var history = (0, _createHistory2.default)(_extends({
    getUserConfirmation: getUserConfirmation }, options, {
    getCurrentLocation: getCurrentLocation,
    pushLocation: pushLocation,
    replaceLocation: replaceLocation,
    go: HashProtocol.go
  }));

  var listenerCount = 0,
      stopListener = void 0;

  var startListener = function startListener(listener, before) {
    if (++listenerCount === 1) stopListener = HashProtocol.startListener(history.transitionTo, pathCoder, queryKey);

    var unlisten = before ? history.listenBefore(listener) : history.listen(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0) stopListener();
    };
  };

  var listenBefore = function listenBefore(listener) {
    return startListener(listener, true);
  };

  var listen = function listen(listener) {
    return startListener(listener, false);
  };

  var goIsSupportedWithoutReload = (0, _DOMUtils.supportsGoWithoutReloadUsingHash)();

  var go = function go(n) {
    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(goIsSupportedWithoutReload, 'Hash history go(n) causes a full page reload in this browser') : void 0;

    history.go(n);
  };

  var createHref = function createHref(path) {
    return '#' + pathCoder.encodePath(history.createHref(path));
  };

  return _extends({}, history, {
    listenBefore: listenBefore,
    listen: listen,
    go: go,
    createHref: createHref
  });
};

exports.default = createHashHistory;
}).call(this,require('_process'))
},{"./DOMUtils":12,"./ExecutionEnvironment":13,"./HashProtocol":14,"./createHistory":20,"_process":7,"invariant":27,"warning":359}],20:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _AsyncUtils = require('./AsyncUtils');

var _PathUtils = require('./PathUtils');

var _runTransitionHook = require('./runTransitionHook');

var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

var _Actions = require('./Actions');

var _LocationUtils = require('./LocationUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createHistory = function createHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var getCurrentLocation = options.getCurrentLocation;
  var getUserConfirmation = options.getUserConfirmation;
  var pushLocation = options.pushLocation;
  var replaceLocation = options.replaceLocation;
  var go = options.go;
  var keyLength = options.keyLength;


  var currentLocation = void 0;
  var pendingLocation = void 0;
  var beforeListeners = [];
  var listeners = [];
  var allKeys = [];

  var getCurrentIndex = function getCurrentIndex() {
    if (pendingLocation && pendingLocation.action === _Actions.POP) return allKeys.indexOf(pendingLocation.key);

    if (currentLocation) return allKeys.indexOf(currentLocation.key);

    return -1;
  };

  var updateLocation = function updateLocation(nextLocation) {
    var currentIndex = getCurrentIndex();

    currentLocation = nextLocation;

    if (currentLocation.action === _Actions.PUSH) {
      allKeys = [].concat(allKeys.slice(0, currentIndex + 1), [currentLocation.key]);
    } else if (currentLocation.action === _Actions.REPLACE) {
      allKeys[currentIndex] = currentLocation.key;
    }

    listeners.forEach(function (listener) {
      return listener(currentLocation);
    });
  };

  var listenBefore = function listenBefore(listener) {
    beforeListeners.push(listener);

    return function () {
      return beforeListeners = beforeListeners.filter(function (item) {
        return item !== listener;
      });
    };
  };

  var listen = function listen(listener) {
    listeners.push(listener);

    return function () {
      return listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  };

  var confirmTransitionTo = function confirmTransitionTo(location, callback) {
    (0, _AsyncUtils.loopAsync)(beforeListeners.length, function (index, next, done) {
      (0, _runTransitionHook2.default)(beforeListeners[index], location, function (result) {
        return result != null ? done(result) : next();
      });
    }, function (message) {
      if (getUserConfirmation && typeof message === 'string') {
        getUserConfirmation(message, function (ok) {
          return callback(ok !== false);
        });
      } else {
        callback(message !== false);
      }
    });
  };

  var transitionTo = function transitionTo(nextLocation) {
    if (currentLocation && (0, _LocationUtils.locationsAreEqual)(currentLocation, nextLocation) || pendingLocation && (0, _LocationUtils.locationsAreEqual)(pendingLocation, nextLocation)) return; // Nothing to do

    pendingLocation = nextLocation;

    confirmTransitionTo(nextLocation, function (ok) {
      if (pendingLocation !== nextLocation) return; // Transition was interrupted during confirmation

      pendingLocation = null;

      if (ok) {
        // Treat PUSH to same path like REPLACE to be consistent with browsers
        if (nextLocation.action === _Actions.PUSH) {
          var prevPath = (0, _PathUtils.createPath)(currentLocation);
          var nextPath = (0, _PathUtils.createPath)(nextLocation);

          if (nextPath === prevPath && (0, _LocationUtils.statesAreEqual)(currentLocation.state, nextLocation.state)) nextLocation.action = _Actions.REPLACE;
        }

        if (nextLocation.action === _Actions.POP) {
          updateLocation(nextLocation);
        } else if (nextLocation.action === _Actions.PUSH) {
          if (pushLocation(nextLocation) !== false) updateLocation(nextLocation);
        } else if (nextLocation.action === _Actions.REPLACE) {
          if (replaceLocation(nextLocation) !== false) updateLocation(nextLocation);
        }
      } else if (currentLocation && nextLocation.action === _Actions.POP) {
        var prevIndex = allKeys.indexOf(currentLocation.key);
        var nextIndex = allKeys.indexOf(nextLocation.key);

        if (prevIndex !== -1 && nextIndex !== -1) go(prevIndex - nextIndex); // Restore the URL
      }
    });
  };

  var push = function push(input) {
    return transitionTo(createLocation(input, _Actions.PUSH));
  };

  var replace = function replace(input) {
    return transitionTo(createLocation(input, _Actions.REPLACE));
  };

  var goBack = function goBack() {
    return go(-1);
  };

  var goForward = function goForward() {
    return go(1);
  };

  var createKey = function createKey() {
    return Math.random().toString(36).substr(2, keyLength || 6);
  };

  var createHref = function createHref(location) {
    return (0, _PathUtils.createPath)(location);
  };

  var createLocation = function createLocation(location, action) {
    var key = arguments.length <= 2 || arguments[2] === undefined ? createKey() : arguments[2];
    return (0, _LocationUtils.createLocation)(location, action, key);
  };

  return {
    getCurrentLocation: getCurrentLocation,
    listenBefore: listenBefore,
    listen: listen,
    transitionTo: transitionTo,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    createKey: createKey,
    createPath: _PathUtils.createPath,
    createHref: createHref,
    createLocation: createLocation
  };
};

exports.default = createHistory;
},{"./Actions":8,"./AsyncUtils":9,"./LocationUtils":15,"./PathUtils":16,"./runTransitionHook":23}],21:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _LocationUtils = require('./LocationUtils');

var _PathUtils = require('./PathUtils');

var _createHistory = require('./createHistory');

var _createHistory2 = _interopRequireDefault(_createHistory);

var _Actions = require('./Actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createStateStorage = function createStateStorage(entries) {
  return entries.filter(function (entry) {
    return entry.state;
  }).reduce(function (memo, entry) {
    memo[entry.key] = entry.state;
    return memo;
  }, {});
};

var createMemoryHistory = function createMemoryHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (Array.isArray(options)) {
    options = { entries: options };
  } else if (typeof options === 'string') {
    options = { entries: [options] };
  }

  var getCurrentLocation = function getCurrentLocation() {
    var entry = entries[current];
    var path = (0, _PathUtils.createPath)(entry);

    var key = void 0,
        state = void 0;
    if (entry.key) {
      key = entry.key;
      state = readState(key);
    }

    var init = (0, _PathUtils.parsePath)(path);

    return (0, _LocationUtils.createLocation)(_extends({}, init, { state: state }), undefined, key);
  };

  var canGo = function canGo(n) {
    var index = current + n;
    return index >= 0 && index < entries.length;
  };

  var go = function go(n) {
    if (!n) return;

    if (!canGo(n)) {
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'Cannot go(%s) there is not enough history', n) : void 0;

      return;
    }

    current += n;
    var currentLocation = getCurrentLocation();

    // Change action to POP
    history.transitionTo(_extends({}, currentLocation, { action: _Actions.POP }));
  };

  var pushLocation = function pushLocation(location) {
    current += 1;

    if (current < entries.length) entries.splice(current);

    entries.push(location);

    saveState(location.key, location.state);
  };

  var replaceLocation = function replaceLocation(location) {
    entries[current] = location;
    saveState(location.key, location.state);
  };

  var history = (0, _createHistory2.default)(_extends({}, options, {
    getCurrentLocation: getCurrentLocation,
    pushLocation: pushLocation,
    replaceLocation: replaceLocation,
    go: go
  }));

  var _options = options;
  var entries = _options.entries;
  var current = _options.current;


  if (typeof entries === 'string') {
    entries = [entries];
  } else if (!Array.isArray(entries)) {
    entries = ['/'];
  }

  entries = entries.map(function (entry) {
    return (0, _LocationUtils.createLocation)(entry);
  });

  if (current == null) {
    current = entries.length - 1;
  } else {
    !(current >= 0 && current < entries.length) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Current index must be >= 0 and < %s, was %s', entries.length, current) : (0, _invariant2.default)(false) : void 0;
  }

  var storage = createStateStorage(entries);

  var saveState = function saveState(key, state) {
    return storage[key] = state;
  };

  var readState = function readState(key) {
    return storage[key];
  };

  return _extends({}, history, {
    canGo: canGo
  });
};

exports.default = createMemoryHistory;
}).call(this,require('_process'))
},{"./Actions":8,"./LocationUtils":15,"./PathUtils":16,"./createHistory":20,"_process":7,"invariant":27,"warning":359}],22:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.locationsAreEqual = exports.Actions = exports.useQueries = exports.useBeforeUnload = exports.useBasename = exports.createMemoryHistory = exports.createHashHistory = exports.createHistory = undefined;

var _LocationUtils = require('./LocationUtils');

Object.defineProperty(exports, 'locationsAreEqual', {
  enumerable: true,
  get: function get() {
    return _LocationUtils.locationsAreEqual;
  }
});

var _createBrowserHistory = require('./createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createHashHistory2 = require('./createHashHistory');

var _createHashHistory3 = _interopRequireDefault(_createHashHistory2);

var _createMemoryHistory2 = require('./createMemoryHistory');

var _createMemoryHistory3 = _interopRequireDefault(_createMemoryHistory2);

var _useBasename2 = require('./useBasename');

var _useBasename3 = _interopRequireDefault(_useBasename2);

var _useBeforeUnload2 = require('./useBeforeUnload');

var _useBeforeUnload3 = _interopRequireDefault(_useBeforeUnload2);

var _useQueries2 = require('./useQueries');

var _useQueries3 = _interopRequireDefault(_useQueries2);

var _Actions2 = require('./Actions');

var _Actions = _interopRequireWildcard(_Actions2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createHistory = _createBrowserHistory2.default;
exports.createHashHistory = _createHashHistory3.default;
exports.createMemoryHistory = _createMemoryHistory3.default;
exports.useBasename = _useBasename3.default;
exports.useBeforeUnload = _useBeforeUnload3.default;
exports.useQueries = _useQueries3.default;
exports.Actions = _Actions;
},{"./Actions":8,"./LocationUtils":15,"./createBrowserHistory":18,"./createHashHistory":19,"./createMemoryHistory":21,"./useBasename":24,"./useBeforeUnload":25,"./useQueries":26}],23:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runTransitionHook = function runTransitionHook(hook, location, callback) {
  var result = hook(location, callback);

  if (hook.length < 2) {
    // Assume the hook runs synchronously and automatically
    // call the callback with the return value.
    callback(result);
  } else {
    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(result === undefined, 'You should not "return" in a transition hook with a callback argument; ' + 'call the callback instead') : void 0;
  }
};

exports.default = runTransitionHook;
}).call(this,require('_process'))
},{"_process":7,"warning":359}],24:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _runTransitionHook = require('./runTransitionHook');

var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

var _PathUtils = require('./PathUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useBasename = function useBasename(createHistory) {
  return function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var history = createHistory(options);
    var basename = options.basename;


    var addBasename = function addBasename(location) {
      if (!location) return location;

      if (basename && location.basename == null) {
        if (location.pathname.indexOf(basename) === 0) {
          location.pathname = location.pathname.substring(basename.length);
          location.basename = basename;

          if (location.pathname === '') location.pathname = '/';
        } else {
          location.basename = '';
        }
      }

      return location;
    };

    var prependBasename = function prependBasename(location) {
      if (!basename) return location;

      var object = typeof location === 'string' ? (0, _PathUtils.parsePath)(location) : location;
      var pname = object.pathname;
      var normalizedBasename = basename.slice(-1) === '/' ? basename : basename + '/';
      var normalizedPathname = pname.charAt(0) === '/' ? pname.slice(1) : pname;
      var pathname = normalizedBasename + normalizedPathname;

      return _extends({}, object, {
        pathname: pathname
      });
    };

    // Override all read methods with basename-aware versions.
    var getCurrentLocation = function getCurrentLocation() {
      return addBasename(history.getCurrentLocation());
    };

    var listenBefore = function listenBefore(hook) {
      return history.listenBefore(function (location, callback) {
        return (0, _runTransitionHook2.default)(hook, addBasename(location), callback);
      });
    };

    var listen = function listen(listener) {
      return history.listen(function (location) {
        return listener(addBasename(location));
      });
    };

    // Override all write methods with basename-aware versions.
    var push = function push(location) {
      return history.push(prependBasename(location));
    };

    var replace = function replace(location) {
      return history.replace(prependBasename(location));
    };

    var createPath = function createPath(location) {
      return history.createPath(prependBasename(location));
    };

    var createHref = function createHref(location) {
      return history.createHref(prependBasename(location));
    };

    var createLocation = function createLocation(location) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return addBasename(history.createLocation.apply(history, [prependBasename(location)].concat(args)));
    };

    return _extends({}, history, {
      getCurrentLocation: getCurrentLocation,
      listenBefore: listenBefore,
      listen: listen,
      push: push,
      replace: replace,
      createPath: createPath,
      createHref: createHref,
      createLocation: createLocation
    });
  };
};

exports.default = useBasename;
},{"./PathUtils":16,"./runTransitionHook":23}],25:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _DOMUtils = require('./DOMUtils');

var _ExecutionEnvironment = require('./ExecutionEnvironment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startListener = function startListener(getPromptMessage) {
  var handleBeforeUnload = function handleBeforeUnload(event) {
    var message = getPromptMessage();

    if (typeof message === 'string') {
      (event || window.event).returnValue = message;
      return message;
    }

    return undefined;
  };

  (0, _DOMUtils.addEventListener)(window, 'beforeunload', handleBeforeUnload);

  return function () {
    return (0, _DOMUtils.removeEventListener)(window, 'beforeunload', handleBeforeUnload);
  };
};

/**
 * Returns a new createHistory function that can be used to create
 * history objects that know how to use the beforeunload event in web
 * browsers to cancel navigation.
 */
var useBeforeUnload = function useBeforeUnload(createHistory) {
  !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'useBeforeUnload only works in DOM environments') : (0, _invariant2.default)(false) : void 0;

  return function (options) {
    var history = createHistory(options);

    var listeners = [];
    var stopListener = void 0;

    var getPromptMessage = function getPromptMessage() {
      var message = void 0;
      for (var i = 0, len = listeners.length; message == null && i < len; ++i) {
        message = listeners[i].call();
      }return message;
    };

    var listenBeforeUnload = function listenBeforeUnload(listener) {
      if (listeners.push(listener) === 1) stopListener = startListener(getPromptMessage);

      return function () {
        listeners = listeners.filter(function (item) {
          return item !== listener;
        });

        if (listeners.length === 0 && stopListener) {
          stopListener();
          stopListener = null;
        }
      };
    };

    return _extends({}, history, {
      listenBeforeUnload: listenBeforeUnload
    });
  };
};

exports.default = useBeforeUnload;
}).call(this,require('_process'))
},{"./DOMUtils":12,"./ExecutionEnvironment":13,"_process":7,"invariant":27}],26:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _queryString = require('query-string');

var _runTransitionHook = require('./runTransitionHook');

var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

var _LocationUtils = require('./LocationUtils');

var _PathUtils = require('./PathUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultStringifyQuery = function defaultStringifyQuery(query) {
  return (0, _queryString.stringify)(query).replace(/%20/g, '+');
};

var defaultParseQueryString = _queryString.parse;

/**
 * Returns a new createHistory function that may be used to create
 * history objects that know how to handle URL queries.
 */
var useQueries = function useQueries(createHistory) {
  return function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var history = createHistory(options);
    var stringifyQuery = options.stringifyQuery;
    var parseQueryString = options.parseQueryString;


    if (typeof stringifyQuery !== 'function') stringifyQuery = defaultStringifyQuery;

    if (typeof parseQueryString !== 'function') parseQueryString = defaultParseQueryString;

    var decodeQuery = function decodeQuery(location) {
      if (!location) return location;

      if (location.query == null) location.query = parseQueryString(location.search.substring(1));

      return location;
    };

    var encodeQuery = function encodeQuery(location, query) {
      if (query == null) return location;

      var object = typeof location === 'string' ? (0, _PathUtils.parsePath)(location) : location;
      var queryString = stringifyQuery(query);
      var search = queryString ? '?' + queryString : '';

      return _extends({}, object, {
        search: search
      });
    };

    // Override all read methods with query-aware versions.
    var getCurrentLocation = function getCurrentLocation() {
      return decodeQuery(history.getCurrentLocation());
    };

    var listenBefore = function listenBefore(hook) {
      return history.listenBefore(function (location, callback) {
        return (0, _runTransitionHook2.default)(hook, decodeQuery(location), callback);
      });
    };

    var listen = function listen(listener) {
      return history.listen(function (location) {
        return listener(decodeQuery(location));
      });
    };

    // Override all write methods with query-aware versions.
    var push = function push(location) {
      return history.push(encodeQuery(location, location.query));
    };

    var replace = function replace(location) {
      return history.replace(encodeQuery(location, location.query));
    };

    var createPath = function createPath(location) {
      return history.createPath(encodeQuery(location, location.query));
    };

    var createHref = function createHref(location) {
      return history.createHref(encodeQuery(location, location.query));
    };

    var createLocation = function createLocation(location) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var newLocation = history.createLocation.apply(history, [encodeQuery(location, location.query)].concat(args));

      if (location.query) newLocation.query = (0, _LocationUtils.createQuery)(location.query);

      return decodeQuery(newLocation);
    };

    return _extends({}, history, {
      getCurrentLocation: getCurrentLocation,
      listenBefore: listenBefore,
      listen: listen,
      push: push,
      replace: replace,
      createPath: createPath,
      createHref: createHref,
      createLocation: createLocation
    });
  };
};

exports.default = useQueries;
},{"./LocationUtils":15,"./PathUtils":16,"./runTransitionHook":23,"query-string":29}],27:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))
},{"_process":7}],28:[function(require,module,exports){
'use strict';
/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],29:[function(require,module,exports){
'use strict';
var strictUriEncode = require('strict-uri-encode');
var objectAssign = require('object-assign');

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str) {
	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		key = decodeURIComponent(key);

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		if (ret[key] === undefined) {
			ret[key] = val;
		} else if (Array.isArray(ret[key])) {
			ret[key].push(val);
		} else {
			ret[key] = [ret[key], val];
		}
	});

	return ret;
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true
	};

	opts = objectAssign(defaults, opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				if (val2 === null) {
					result.push(encode(key, opts));
				} else {
					result.push(encode(key, opts) + '=' + encode(val2, opts));
				}
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

},{"object-assign":30,"strict-uri-encode":358}],30:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],31:[function(require,module,exports){
module.exports = require('react/lib/update');
},{"react/lib/update":357}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _TableHeader = require('./TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _TableBody = require('./TableBody');

var _TableBody2 = _interopRequireDefault(_TableBody);

var _PaginationList = require('./pagination/PaginationList');

var _PaginationList2 = _interopRequireDefault(_PaginationList);

var _ToolBar = require('./toolbar/ToolBar');

var _ToolBar2 = _interopRequireDefault(_ToolBar);

var _TableFilter = require('./TableFilter');

var _TableFilter2 = _interopRequireDefault(_TableFilter);

var _TableDataStore = require('./store/TableDataStore');

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _csv_export_util = require('./csv_export_util');

var _csv_export_util2 = _interopRequireDefault(_csv_export_util);

var _Filter = require('./Filter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint no-alert: 0 */
/* eslint max-len: 0 */


var BootstrapTable = function (_Component) {
  _inherits(BootstrapTable, _Component);

  function BootstrapTable(props) {
    _classCallCheck(this, BootstrapTable);

    var _this = _possibleConstructorReturn(this, (BootstrapTable.__proto__ || Object.getPrototypeOf(BootstrapTable)).call(this, props));

    _this.handleSort = function () {
      return _this.__handleSort__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handlePaginationData = function () {
      return _this.__handlePaginationData__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleMouseLeave = function () {
      return _this.__handleMouseLeave__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleMouseEnter = function () {
      return _this.__handleMouseEnter__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleRowMouseOut = function () {
      return _this.__handleRowMouseOut__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleRowMouseOver = function () {
      return _this.__handleRowMouseOver__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleRowClick = function () {
      return _this.__handleRowClick__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleRowDoubleClick = function () {
      return _this.__handleRowDoubleClick__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleSelectAllRow = function () {
      return _this.__handleSelectAllRow__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleShowOnlySelected = function () {
      return _this.__handleShowOnlySelected__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleSelectRow = function () {
      return _this.__handleSelectRow__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleAddRow = function () {
      return _this.__handleAddRow__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.getPageByRowKey = function () {
      return _this.__getPageByRowKey__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleDropRow = function () {
      return _this.__handleDropRow__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleFilterData = function () {
      return _this.__handleFilterData__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleExportCSV = function () {
      return _this.__handleExportCSV__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleSearch = function () {
      return _this.__handleSearch__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this._scrollHeader = function () {
      return _this.___scrollHeader__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this._adjustTable = function () {
      return _this.___adjustTable__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this._adjustHeaderWidth = function () {
      return _this.___adjustHeaderWidth__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this._adjustHeight = function () {
      return _this.___adjustHeight__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.isIE = false;
    _this._attachCellEditFunc();
    if (_util2.default.canUseDOM()) {
      _this.isIE = document.documentMode;
    }
    _this.store = new _TableDataStore.TableDataStore(_this.props.data.slice());

    _this.initTable(_this.props);

    if (_this.props.selectRow && _this.props.selectRow.selected) {
      var copy = _this.props.selectRow.selected.slice();
      _this.store.setSelectedRowKey(copy);
    }
    var currPage = _Const2.default.PAGE_START_INDEX;
    if (typeof _this.props.options.page !== 'undefined') {
      currPage = _this.props.options.page;
    } else if (typeof _this.props.options.pageStartIndex !== 'undefined') {
      currPage = _this.props.options.pageStartIndex;
    }

    _this.state = {
      data: _this.getTableData(),
      currPage: currPage,
      sizePerPage: _this.props.options.sizePerPage || _Const2.default.SIZE_PER_PAGE_LIST[0],
      selectedRowKeys: _this.store.getSelectedRowKeys()
    };
    return _this;
  }

  _createClass(BootstrapTable, [{
    key: 'initTable',
    value: function initTable(props) {
      var _this2 = this;

      var keyField = props.keyField;


      var isKeyFieldDefined = typeof keyField === 'string' && keyField.length;
      _react2.default.Children.forEach(props.children, function (column) {
        if (column.props.isKey) {
          if (keyField) {
            throw new Error('Error. Multiple key column be detected in TableHeaderColumn.');
          }
          keyField = column.props.dataField;
        }
        if (column.props.filter) {
          // a column contains a filter
          if (!_this2.filter) {
            // first time create the filter on the BootstrapTable
            _this2.filter = new _Filter.Filter();
          }
          // pass the filter to column with filter
          column.props.filter.emitter = _this2.filter;
        }
      });

      if (this.filter) {
        this.filter.removeAllListeners('onFilterChange');
        this.filter.on('onFilterChange', function (currentFilter) {
          _this2.handleFilterData(currentFilter);
        });
      }

      this.colInfos = this.getColumnsDescription(props).reduce(function (prev, curr) {
        prev[curr.name] = curr;
        return prev;
      }, {});

      if (!isKeyFieldDefined && !keyField) {
        throw new Error('Error. No any key column defined in TableHeaderColumn.\n            Use \'isKey={true}\' to specify a unique column after version 0.5.4.');
      }

      this.store.setProps({
        isPagination: props.pagination,
        keyField: keyField,
        colInfos: this.colInfos,
        multiColumnSearch: props.multiColumnSearch,
        remote: this.isRemoteDataSource()
      });
    }
  }, {
    key: 'getTableData',
    value: function getTableData() {
      var result = [];
      var _props = this.props,
          options = _props.options,
          pagination = _props.pagination;

      var sortName = options.defaultSortName || options.sortName;
      var sortOrder = options.defaultSortOrder || options.sortOrder;
      var searchText = options.defaultSearch;
      if (sortName && sortOrder) {
        this.store.sort(sortOrder, sortName);
      }

      if (searchText) {
        this.store.search(searchText);
      }

      if (pagination) {
        var page = void 0;
        var sizePerPage = void 0;
        if (this.store.isChangedPage()) {
          sizePerPage = this.state.sizePerPage;
          page = this.state.currPage;
        } else {
          sizePerPage = options.sizePerPage || _Const2.default.SIZE_PER_PAGE_LIST[0];
          page = options.page || 1;
        }
        result = this.store.page(page, sizePerPage).get();
      } else {
        result = this.store.get();
      }
      return result;
    }
  }, {
    key: 'getColumnsDescription',
    value: function getColumnsDescription(_ref) {
      var children = _ref.children;

      return _react2.default.Children.map(children, function (column, i) {
        return {
          name: column.props.dataField,
          align: column.props.dataAlign,
          sort: column.props.dataSort,
          format: column.props.dataFormat,
          formatExtraData: column.props.formatExtraData,
          filterFormatted: column.props.filterFormatted,
          filterValue: column.props.filterValue,
          editable: column.props.editable,
          customEditor: column.props.customEditor,
          hidden: column.props.hidden,
          hiddenOnInsert: column.props.hiddenOnInsert,
          searchable: column.props.searchable,
          className: column.props.columnClassName,
          columnTitle: column.props.columnTitle,
          width: column.props.width,
          text: column.props.children,
          sortFunc: column.props.sortFunc,
          sortFuncExtraData: column.props.sortFuncExtraData,
          export: column.props.export,
          index: i
        };
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.initTable(nextProps);
      var options = nextProps.options,
          selectRow = nextProps.selectRow;


      this.store.setData(nextProps.data.slice());

      // from #481
      var page = this.state.currPage;
      if (this.props.options.page !== options.page) {
        page = options.page;
      }
      // from #481
      var sizePerPage = this.state.sizePerPage;
      if (this.props.options.sizePerPage !== options.sizePerPage) {
        sizePerPage = options.sizePerPage;
      }

      if (this.isRemoteDataSource()) {
        this.setState({
          data: nextProps.data.slice(),
          currPage: page,
          sizePerPage: sizePerPage
        });
      } else {
        // #125
        // remove !options.page for #709
        if (page > Math.ceil(nextProps.data.length / sizePerPage)) {
          page = 1;
        }
        var sortInfo = this.store.getSortInfo();
        var sortField = options.sortName || (sortInfo ? sortInfo.sortField : undefined);
        var sortOrder = options.sortOrder || (sortInfo ? sortInfo.order : undefined);
        if (sortField && sortOrder) this.store.sort(sortOrder, sortField);
        var data = this.store.page(page, sizePerPage).get();
        this.setState({
          data: data,
          currPage: page,
          sizePerPage: sizePerPage
        });
      }

      if (selectRow && selectRow.selected) {
        // set default select rows to store.
        var copy = selectRow.selected.slice();
        this.store.setSelectedRowKey(copy);
        this.setState({
          selectedRowKeys: copy
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._adjustTable();
      window.addEventListener('resize', this._adjustTable);
      this.refs.body.refs.container.addEventListener('scroll', this._scrollHeader);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this._adjustTable);
      this.refs.body.refs.container.removeEventListener('scroll', this._scrollHeader);
      if (this.filter) {
        this.filter.removeAllListeners('onFilterChange');
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._adjustTable();
      this._attachCellEditFunc();
      if (this.props.options.afterTableComplete) {
        this.props.options.afterTableComplete();
      }
    }
  }, {
    key: '_attachCellEditFunc',
    value: function _attachCellEditFunc() {
      var cellEdit = this.props.cellEdit;

      if (cellEdit) {
        this.props.cellEdit.__onCompleteEdit__ = this.handleEditCell.bind(this);
        if (cellEdit.mode !== _Const2.default.CELL_EDIT_NONE) {
          this.props.selectRow.clickToSelect = false;
        }
      }
    }

    /**
     * Returns true if in the current configuration,
     * the datagrid should load its data remotely.
     *
     * @param  {Object}  [props] Optional. If not given, this.props will be used
     * @return {Boolean}
     */

  }, {
    key: 'isRemoteDataSource',
    value: function isRemoteDataSource(props) {
      return (props || this.props).remote;
    }
  }, {
    key: 'render',
    value: function render() {
      var style = {
        height: this.props.height,
        maxHeight: this.props.maxHeight
      };

      var columns = this.getColumnsDescription(this.props);
      var sortInfo = this.store.getSortInfo();
      var pagination = this.renderPagination();
      var toolBar = this.renderToolBar();
      var tableFilter = this.renderTableFilter(columns);
      var isSelectAll = this.isSelectAll();
      var sortIndicator = this.props.options.sortIndicator;
      if (typeof this.props.options.sortIndicator === 'undefined') sortIndicator = true;
      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)('react-bs-table-container', this.props.containerClass),
          style: this.props.containerStyle },
        toolBar,
        _react2.default.createElement(
          'div',
          { ref: 'table',
            className: (0, _classnames2.default)('react-bs-table', this.props.tableContainerClass),
            style: _extends({}, style, this.props.tableStyle),
            onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave },
          _react2.default.createElement(
            _TableHeader2.default,
            {
              ref: 'header',
              headerContainerClass: this.props.headerContainerClass,
              tableHeaderClass: this.props.tableHeaderClass,
              style: this.props.headerStyle,
              rowSelectType: this.props.selectRow.mode,
              customComponent: this.props.selectRow.customComponent,
              hideSelectColumn: this.props.selectRow.hideSelectColumn,
              sortName: sortInfo ? sortInfo.sortField : undefined,
              sortOrder: sortInfo ? sortInfo.order : undefined,
              sortIndicator: sortIndicator,
              onSort: this.handleSort,
              onSelectAllRow: this.handleSelectAllRow,
              bordered: this.props.bordered,
              condensed: this.props.condensed,
              isFiltered: this.filter ? true : false,
              isSelectAll: isSelectAll },
            this.props.children
          ),
          _react2.default.createElement(_TableBody2.default, { ref: 'body',
            bodyContainerClass: this.props.bodyContainerClass,
            tableBodyClass: this.props.tableBodyClass,
            style: _extends({}, style, this.props.bodyStyle),
            data: this.state.data,
            expandComponent: this.props.expandComponent,
            expandableRow: this.props.expandableRow,
            expandRowBgColor: this.props.options.expandRowBgColor,
            columns: columns,
            trClassName: this.props.trClassName,
            striped: this.props.striped,
            bordered: this.props.bordered,
            hover: this.props.hover,
            keyField: this.store.getKeyField(),
            condensed: this.props.condensed,
            selectRow: this.props.selectRow,
            cellEdit: this.props.cellEdit,
            selectedRowKeys: this.state.selectedRowKeys,
            onRowClick: this.handleRowClick,
            onRowDoubleClick: this.handleRowDoubleClick,
            onRowMouseOver: this.handleRowMouseOver,
            onRowMouseOut: this.handleRowMouseOut,
            onSelectRow: this.handleSelectRow,
            noDataText: this.props.options.noDataText,
            adjustHeaderWidth: this._adjustHeaderWidth })
        ),
        tableFilter,
        pagination
      );
    }
  }, {
    key: 'isSelectAll',
    value: function isSelectAll() {
      if (this.store.isEmpty()) return false;
      var unselectable = this.props.selectRow.unselectable;
      var defaultSelectRowKeys = this.store.getSelectedRowKeys();
      var allRowKeys = this.store.getAllRowkey();

      if (defaultSelectRowKeys.length === 0) return false;
      var match = 0;
      var noFound = 0;
      var unSelectableCnt = 0;
      defaultSelectRowKeys.forEach(function (selected) {
        if (allRowKeys.indexOf(selected) !== -1) match++;else noFound++;
        if (unselectable && unselectable.indexOf(selected) !== -1) unSelectableCnt++;
      });

      if (noFound === defaultSelectRowKeys.length) return false;
      if (match === allRowKeys.length) {
        return true;
      } else {
        if (unselectable && match <= unSelectableCnt && unSelectableCnt === unselectable.length) return false;else return 'indeterminate';
      }
      // return (match === allRowKeys.length) ? true : 'indeterminate';
    }
  }, {
    key: 'cleanSelected',
    value: function cleanSelected() {
      this.store.setSelectedRowKey([]);
      this.setState({
        selectedRowKeys: []
      });
    }
  }, {
    key: '__handleSort__REACT_HOT_LOADER__',
    value: function __handleSort__REACT_HOT_LOADER__(order, sortField) {
      if (this.props.options.onSortChange) {
        this.props.options.onSortChange(sortField, order, this.props);
      }

      if (this.isRemoteDataSource()) {
        this.store.setSortInfo(order, sortField);
        return;
      }

      var result = this.store.sort(order, sortField).get();
      this.setState({
        data: result
      });
    }
  }, {
    key: '__handlePaginationData__REACT_HOT_LOADER__',
    value: function __handlePaginationData__REACT_HOT_LOADER__(page, sizePerPage) {
      var _props$options = this.props.options,
          onPageChange = _props$options.onPageChange,
          pageStartIndex = _props$options.pageStartIndex;

      if (onPageChange) {
        onPageChange(page, sizePerPage);
      }

      this.setState({
        currPage: page,
        sizePerPage: sizePerPage
      });

      if (this.isRemoteDataSource()) {
        return;
      }

      // We calculate an offset here in order to properly fetch the indexed data,
      // despite the page start index not always being 1
      var normalizedPage = void 0;
      if (pageStartIndex !== undefined) {
        var offset = Math.abs(_Const2.default.PAGE_START_INDEX - pageStartIndex);
        normalizedPage = page + offset;
      } else {
        normalizedPage = page;
      }

      var result = this.store.page(normalizedPage, sizePerPage).get();

      this.setState({ data: result });
    }
  }, {
    key: '__handleMouseLeave__REACT_HOT_LOADER__',
    value: function __handleMouseLeave__REACT_HOT_LOADER__() {
      if (this.props.options.onMouseLeave) {
        this.props.options.onMouseLeave();
      }
    }
  }, {
    key: '__handleMouseEnter__REACT_HOT_LOADER__',
    value: function __handleMouseEnter__REACT_HOT_LOADER__() {
      if (this.props.options.onMouseEnter) {
        this.props.options.onMouseEnter();
      }
    }
  }, {
    key: '__handleRowMouseOut__REACT_HOT_LOADER__',
    value: function __handleRowMouseOut__REACT_HOT_LOADER__(row, event) {
      if (this.props.options.onRowMouseOut) {
        this.props.options.onRowMouseOut(row, event);
      }
    }
  }, {
    key: '__handleRowMouseOver__REACT_HOT_LOADER__',
    value: function __handleRowMouseOver__REACT_HOT_LOADER__(row, event) {
      if (this.props.options.onRowMouseOver) {
        this.props.options.onRowMouseOver(row, event);
      }
    }
  }, {
    key: '__handleRowClick__REACT_HOT_LOADER__',
    value: function __handleRowClick__REACT_HOT_LOADER__(row) {
      if (this.props.options.onRowClick) {
        this.props.options.onRowClick(row);
      }
    }
  }, {
    key: '__handleRowDoubleClick__REACT_HOT_LOADER__',
    value: function __handleRowDoubleClick__REACT_HOT_LOADER__(row) {
      if (this.props.options.onRowDoubleClick) {
        this.props.options.onRowDoubleClick(row);
      }
    }
  }, {
    key: '__handleSelectAllRow__REACT_HOT_LOADER__',
    value: function __handleSelectAllRow__REACT_HOT_LOADER__(e) {
      var isSelected = e.currentTarget.checked;
      var keyField = this.store.getKeyField();
      var _props$selectRow = this.props.selectRow,
          onSelectAll = _props$selectRow.onSelectAll,
          unselectable = _props$selectRow.unselectable,
          selected = _props$selectRow.selected;

      var selectedRowKeys = [];
      var result = true;
      var rows = isSelected ? this.store.get() : this.store.getRowByKey(this.state.selectedRowKeys);

      if (unselectable && unselectable.length > 0) {
        if (isSelected) {
          rows = rows.filter(function (r) {
            return unselectable.indexOf(r[keyField]) === -1 || selected && selected.indexOf(r[keyField]) !== -1;
          });
        } else {
          rows = rows.filter(function (r) {
            return unselectable.indexOf(r[keyField]) === -1;
          });
        }
      }

      if (onSelectAll) {
        result = this.props.selectRow.onSelectAll(isSelected, rows);
      }

      if (typeof result == 'undefined' || result !== false) {
        if (isSelected) {
          selectedRowKeys = Array.isArray(result) ? result : rows.map(function (r) {
            return r[keyField];
          });
        } else {
          if (unselectable && selected) {
            selectedRowKeys = selected.filter(function (r) {
              return unselectable.indexOf(r) > -1;
            });
          }
        }

        this.store.setSelectedRowKey(selectedRowKeys);
        this.setState({ selectedRowKeys: selectedRowKeys });
      }
    }
  }, {
    key: '__handleShowOnlySelected__REACT_HOT_LOADER__',
    value: function __handleShowOnlySelected__REACT_HOT_LOADER__() {
      this.store.ignoreNonSelected();
      var result = void 0;
      if (this.props.pagination) {
        result = this.store.page(1, this.state.sizePerPage).get();
      } else {
        result = this.store.get();
      }
      this.setState({
        data: result,
        currPage: this.props.options.pageStartIndex || _Const2.default.PAGE_START_INDEX
      });
    }
  }, {
    key: '__handleSelectRow__REACT_HOT_LOADER__',
    value: function __handleSelectRow__REACT_HOT_LOADER__(row, isSelected, e) {
      var result = true;
      var currSelected = this.store.getSelectedRowKeys();
      var rowKey = row[this.store.getKeyField()];
      var selectRow = this.props.selectRow;

      if (selectRow.onSelect) {
        result = selectRow.onSelect(row, isSelected, e);
      }

      if (typeof result === 'undefined' || result !== false) {
        if (selectRow.mode === _Const2.default.ROW_SELECT_SINGLE) {
          currSelected = isSelected ? [rowKey] : [];
        } else {
          if (isSelected) {
            currSelected.push(rowKey);
          } else {
            currSelected = currSelected.filter(function (key) {
              return rowKey !== key;
            });
          }
        }

        this.store.setSelectedRowKey(currSelected);
        this.setState({
          selectedRowKeys: currSelected
        });
      }
    }
  }, {
    key: 'handleEditCell',
    value: function handleEditCell(newVal, rowIndex, colIndex) {
      var onCellEdit = this.props.options.onCellEdit;
      var _props$cellEdit = this.props.cellEdit,
          beforeSaveCell = _props$cellEdit.beforeSaveCell,
          afterSaveCell = _props$cellEdit.afterSaveCell;

      var fieldName = void 0;
      _react2.default.Children.forEach(this.props.children, function (column, i) {
        if (i === colIndex) {
          fieldName = column.props.dataField;
          return false;
        }
      });

      if (beforeSaveCell) {
        var isValid = beforeSaveCell(this.state.data[rowIndex], fieldName, newVal);
        if (!isValid && typeof isValid !== 'undefined') {
          this.setState({
            data: this.store.get()
          });
          return;
        }
      }

      if (onCellEdit) {
        newVal = onCellEdit(this.state.data[rowIndex], fieldName, newVal);
      }

      if (this.isRemoteDataSource()) {
        if (afterSaveCell) {
          afterSaveCell(this.state.data[rowIndex], fieldName, newVal);
        }
        return;
      }

      var result = this.store.edit(newVal, rowIndex, fieldName).get();
      this.setState({
        data: result
      });

      if (afterSaveCell) {
        afterSaveCell(this.state.data[rowIndex], fieldName, newVal);
      }
    }
  }, {
    key: 'handleAddRowAtBegin',
    value: function handleAddRowAtBegin(newObj) {
      try {
        this.store.addAtBegin(newObj);
      } catch (e) {
        return e;
      }
      this._handleAfterAddingRow(newObj, true);
    }
  }, {
    key: '__handleAddRow__REACT_HOT_LOADER__',
    value: function __handleAddRow__REACT_HOT_LOADER__(newObj) {
      var onAddRow = this.props.options.onAddRow;

      if (onAddRow) {
        var colInfos = this.store.getColInfos();
        onAddRow(newObj, colInfos);
      }

      if (this.isRemoteDataSource()) {
        if (this.props.options.afterInsertRow) {
          this.props.options.afterInsertRow(newObj);
        }
        return null;
      }

      try {
        this.store.add(newObj);
      } catch (e) {
        return e.message;
      }
      this._handleAfterAddingRow(newObj, false);
    }
  }, {
    key: 'getSizePerPage',
    value: function getSizePerPage() {
      return this.state.sizePerPage;
    }
  }, {
    key: 'getCurrentPage',
    value: function getCurrentPage() {
      return this.state.currPage;
    }
  }, {
    key: 'getTableDataIgnorePaging',
    value: function getTableDataIgnorePaging() {
      return this.store.getCurrentDisplayData();
    }
  }, {
    key: '__getPageByRowKey__REACT_HOT_LOADER__',
    value: function __getPageByRowKey__REACT_HOT_LOADER__(rowKey) {
      var sizePerPage = this.state.sizePerPage;

      var currentData = this.store.getCurrentDisplayData();
      var keyField = this.store.getKeyField();
      var result = currentData.findIndex(function (x) {
        return x[keyField] === rowKey;
      });
      if (result > -1) {
        return parseInt(result / sizePerPage, 10) + 1;
      } else {
        return result;
      }
    }
  }, {
    key: '__handleDropRow__REACT_HOT_LOADER__',
    value: function __handleDropRow__REACT_HOT_LOADER__(rowKeys) {
      var _this3 = this;

      var dropRowKeys = rowKeys ? rowKeys : this.store.getSelectedRowKeys();
      // add confirm before the delete action if that option is set.
      if (dropRowKeys && dropRowKeys.length > 0) {
        if (this.props.options.handleConfirmDeleteRow) {
          this.props.options.handleConfirmDeleteRow(function () {
            _this3.deleteRow(dropRowKeys);
          }, dropRowKeys);
        } else if (confirm('Are you sure you want to delete?')) {
          this.deleteRow(dropRowKeys);
        }
      }
    }
  }, {
    key: 'deleteRow',
    value: function deleteRow(dropRowKeys) {
      var onDeleteRow = this.props.options.onDeleteRow;

      if (onDeleteRow) {
        onDeleteRow(dropRowKeys);
      }

      this.store.setSelectedRowKey([]); // clear selected row key

      if (this.isRemoteDataSource()) {
        if (this.props.options.afterDeleteRow) {
          this.props.options.afterDeleteRow(dropRowKeys);
        }
        return;
      }

      this.store.remove(dropRowKeys); // remove selected Row
      var result = void 0;
      if (this.props.pagination) {
        var sizePerPage = this.state.sizePerPage;

        var currLastPage = Math.ceil(this.store.getDataNum() / sizePerPage);
        var currPage = this.state.currPage;

        if (currPage > currLastPage) currPage = currLastPage;
        result = this.store.page(currPage, sizePerPage).get();
        this.setState({
          data: result,
          selectedRowKeys: this.store.getSelectedRowKeys(),
          currPage: currPage
        });
      } else {
        result = this.store.get();
        this.setState({
          data: result,
          selectedRowKeys: this.store.getSelectedRowKeys()
        });
      }
      if (this.props.options.afterDeleteRow) {
        this.props.options.afterDeleteRow(dropRowKeys);
      }
    }
  }, {
    key: '__handleFilterData__REACT_HOT_LOADER__',
    value: function __handleFilterData__REACT_HOT_LOADER__(filterObj) {
      var onFilterChange = this.props.options.onFilterChange;

      if (onFilterChange) {
        var colInfos = this.store.getColInfos();
        onFilterChange(filterObj, colInfos);
      }

      this.setState({
        currPage: this.props.options.pageStartIndex || _Const2.default.PAGE_START_INDEX
      });

      if (this.isRemoteDataSource()) {
        if (this.props.options.afterColumnFilter) {
          this.props.options.afterColumnFilter(filterObj, this.store.getDataIgnoringPagination());
        }
        return;
      }

      this.store.filter(filterObj);

      var sortObj = this.store.getSortInfo();

      if (sortObj) {
        this.store.sort(sortObj.order, sortObj.sortField);
      }

      var result = void 0;

      if (this.props.pagination) {
        var sizePerPage = this.state.sizePerPage;

        result = this.store.page(1, sizePerPage).get();
      } else {
        result = this.store.get();
      }
      if (this.props.options.afterColumnFilter) {
        this.props.options.afterColumnFilter(filterObj, this.store.getDataIgnoringPagination());
      }
      this.setState({
        data: result
      });
    }
  }, {
    key: '__handleExportCSV__REACT_HOT_LOADER__',
    value: function __handleExportCSV__REACT_HOT_LOADER__() {
      var result = {};

      var csvFileName = this.props.csvFileName;
      var onExportToCSV = this.props.options.onExportToCSV;

      if (onExportToCSV) {
        result = onExportToCSV();
      } else {
        result = this.store.getDataIgnoringPagination();
      }

      var keys = [];
      this.props.children.map(function (column) {
        if (column.props.export === true || typeof column.props.export === 'undefined' && column.props.hidden === false) {
          keys.push({
            field: column.props.dataField,
            format: column.props.csvFormat,
            header: column.props.csvHeader || column.props.dataField
          });
        }
      });

      if (typeof csvFileName === 'function') {
        csvFileName = csvFileName();
      }

      (0, _csv_export_util2.default)(result, keys, csvFileName);
    }
  }, {
    key: '__handleSearch__REACT_HOT_LOADER__',
    value: function __handleSearch__REACT_HOT_LOADER__(searchText) {
      var onSearchChange = this.props.options.onSearchChange;

      if (onSearchChange) {
        var colInfos = this.store.getColInfos();
        onSearchChange(searchText, colInfos, this.props.multiColumnSearch);
      }

      this.setState({
        currPage: this.props.options.pageStartIndex || _Const2.default.PAGE_START_INDEX
      });

      if (this.isRemoteDataSource()) {
        if (this.props.options.afterSearch) {
          this.props.options.afterSearch(searchText, this.store.getDataIgnoringPagination());
        }
        return;
      }

      this.store.search(searchText);

      var sortObj = this.store.getSortInfo();

      if (sortObj) {
        this.store.sort(sortObj.order, sortObj.sortField);
      }

      var result = void 0;
      if (this.props.pagination) {
        var sizePerPage = this.state.sizePerPage;

        result = this.store.page(1, sizePerPage).get();
      } else {
        result = this.store.get();
      }
      if (this.props.options.afterSearch) {
        this.props.options.afterSearch(searchText, this.store.getDataIgnoringPagination());
      }
      this.setState({
        data: result
      });
    }
  }, {
    key: 'renderPagination',
    value: function renderPagination() {
      if (this.props.pagination) {
        var dataSize = void 0;
        if (this.isRemoteDataSource()) {
          dataSize = this.props.fetchInfo.dataTotalSize;
        } else {
          dataSize = this.store.getDataNum();
        }
        var options = this.props.options;

        if (Math.ceil(dataSize / this.state.sizePerPage) <= 1 && this.props.ignoreSinglePage) return null;
        return _react2.default.createElement(
          'div',
          { className: 'react-bs-table-pagination' },
          _react2.default.createElement(_PaginationList2.default, {
            ref: 'pagination',
            currPage: this.state.currPage,
            changePage: this.handlePaginationData,
            sizePerPage: this.state.sizePerPage,
            sizePerPageList: options.sizePerPageList || _Const2.default.SIZE_PER_PAGE_LIST,
            pageStartIndex: options.pageStartIndex,
            paginationShowsTotal: options.paginationShowsTotal,
            paginationSize: options.paginationSize || _Const2.default.PAGINATION_SIZE,
            remote: this.isRemoteDataSource(),
            dataSize: dataSize,
            onSizePerPageList: options.onSizePerPageList,
            prePage: options.prePage || _Const2.default.PRE_PAGE,
            nextPage: options.nextPage || _Const2.default.NEXT_PAGE,
            firstPage: options.firstPage || _Const2.default.FIRST_PAGE,
            lastPage: options.lastPage || _Const2.default.LAST_PAGE,
            hideSizePerPage: options.hideSizePerPage })
        );
      }
      return null;
    }
  }, {
    key: 'renderToolBar',
    value: function renderToolBar() {
      var _props2 = this.props,
          selectRow = _props2.selectRow,
          insertRow = _props2.insertRow,
          deleteRow = _props2.deleteRow,
          search = _props2.search,
          children = _props2.children;

      var enableShowOnlySelected = selectRow && selectRow.showOnlySelected;
      if (enableShowOnlySelected || insertRow || deleteRow || search || this.props.exportCSV) {
        var columns = void 0;
        if (Array.isArray(children)) {
          columns = children.map(function (column, r) {
            var props = column.props;

            return {
              name: props.children,
              field: props.dataField,
              hiddenOnInsert: props.hiddenOnInsert,
              // when you want same auto generate value and not allow edit, example ID field
              autoValue: props.autoValue || false,
              // for create editor, no params for column.editable() indicate that editor for new row
              editable: props.editable && typeof props.editable === 'function' ? props.editable() : props.editable,
              format: props.dataFormat ? function (value) {
                return props.dataFormat(value, null, props.formatExtraData, r).replace(/<.*?>/g, '');
              } : false
            };
          });
        } else {
          columns = [{
            name: children.props.children,
            field: children.props.dataField,
            editable: children.props.editable,
            hiddenOnInsert: children.props.hiddenOnInsert
          }];
        }
        return _react2.default.createElement(
          'div',
          { className: 'react-bs-table-tool-bar' },
          _react2.default.createElement(_ToolBar2.default, {
            defaultSearch: this.props.options.defaultSearch,
            clearSearch: this.props.options.clearSearch,
            searchDelayTime: this.props.options.searchDelayTime,
            enableInsert: insertRow,
            enableDelete: deleteRow,
            enableSearch: search,
            enableExportCSV: this.props.exportCSV,
            enableShowOnlySelected: enableShowOnlySelected,
            columns: columns,
            searchPlaceholder: this.props.searchPlaceholder,
            exportCSVText: this.props.options.exportCSVText,
            insertText: this.props.options.insertText,
            deleteText: this.props.options.deleteText,
            saveText: this.props.options.saveText,
            closeText: this.props.options.closeText,
            ignoreEditable: this.props.options.ignoreEditable,
            onAddRow: this.handleAddRow,
            onDropRow: this.handleDropRow,
            onSearch: this.handleSearch,
            onExportCSV: this.handleExportCSV,
            onShowOnlySelected: this.handleShowOnlySelected })
        );
      } else {
        return null;
      }
    }
  }, {
    key: 'renderTableFilter',
    value: function renderTableFilter(columns) {
      if (this.props.columnFilter) {
        return _react2.default.createElement(_TableFilter2.default, { columns: columns,
          rowSelectType: this.props.selectRow.mode,
          onFilter: this.handleFilterData });
      } else {
        return null;
      }
    }
  }, {
    key: '___scrollHeader__REACT_HOT_LOADER__',
    value: function ___scrollHeader__REACT_HOT_LOADER__(e) {
      this.refs.header.refs.container.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, {
    key: '___adjustTable__REACT_HOT_LOADER__',
    value: function ___adjustTable__REACT_HOT_LOADER__() {
      if (!this.props.printable) {
        this._adjustHeaderWidth();
      }
      this._adjustHeight();
    }
  }, {
    key: '___adjustHeaderWidth__REACT_HOT_LOADER__',
    value: function ___adjustHeaderWidth__REACT_HOT_LOADER__() {
      var header = this.refs.header.refs.header;
      var headerContainer = this.refs.header.refs.container;
      var tbody = this.refs.body.refs.tbody;
      var firstRow = tbody.childNodes[0];
      var isScroll = headerContainer.offsetWidth !== tbody.parentNode.offsetWidth;
      var scrollBarWidth = isScroll ? _util2.default.getScrollBarWidth() : 0;
      if (firstRow && this.store.getDataNum()) {
        var cells = firstRow.childNodes;
        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          var computedStyle = getComputedStyle(cell);
          var width = parseFloat(computedStyle.width.replace('px', ''));
          if (this.isIE) {
            var paddingLeftWidth = parseFloat(computedStyle.paddingLeft.replace('px', ''));
            var paddingRightWidth = parseFloat(computedStyle.paddingRight.replace('px', ''));
            var borderRightWidth = parseFloat(computedStyle.borderRightWidth.replace('px', ''));
            var borderLeftWidth = parseFloat(computedStyle.borderLeftWidth.replace('px', ''));
            width = width + paddingLeftWidth + paddingRightWidth + borderRightWidth + borderLeftWidth;
          }
          var lastPadding = cells.length - 1 === i ? scrollBarWidth : 0;
          if (width <= 0) {
            width = 120;
            cell.width = width + lastPadding + 'px';
          }
          var result = width + lastPadding + 'px';
          header.childNodes[i].style.width = result;
          header.childNodes[i].style.minWidth = result;
        }
      } else {
        _react2.default.Children.forEach(this.props.children, function (child, i) {
          if (child.props.width) {
            header.childNodes[i].style.width = child.props.width + 'px';
            header.childNodes[i].style.minWidth = child.props.width + 'px';
          }
        });
      }
    }
  }, {
    key: '___adjustHeight__REACT_HOT_LOADER__',
    value: function ___adjustHeight__REACT_HOT_LOADER__() {
      var height = this.props.height;
      var maxHeight = this.props.maxHeight;

      if (typeof height === 'number' && !isNaN(height) || height.indexOf('%') === -1) {
        this.refs.body.refs.container.style.height = parseFloat(height, 10) - this.refs.header.refs.container.offsetHeight + 'px';
      }
      if (maxHeight) {
        maxHeight = typeof maxHeight === 'number' ? maxHeight : parseInt(maxHeight.replace('px', ''), 10);

        this.refs.body.refs.container.style.maxHeight = maxHeight - this.refs.header.refs.container.offsetHeight + 'px';
      }
    }
  }, {
    key: '_handleAfterAddingRow',
    value: function _handleAfterAddingRow(newObj, atTheBeginning) {
      var result = void 0;
      if (this.props.pagination) {
        // if pagination is enabled and inserting row at the end,
        // change page to the last page
        // otherwise, change it to the first page
        var sizePerPage = this.state.sizePerPage;


        if (atTheBeginning) {
          var firstPage = this.props.options.pageStartIndex || _Const2.default.PAGE_START_INDEX;
          result = this.store.page(firstPage, sizePerPage).get();
          this.setState({
            data: result,
            currPage: firstPage
          });
        } else {
          var currLastPage = Math.ceil(this.store.getDataNum() / sizePerPage);
          result = this.store.page(currLastPage, sizePerPage).get();
          this.setState({
            data: result,
            currPage: currLastPage
          });
        }
      } else {
        result = this.store.get();
        this.setState({
          data: result
        });
      }

      if (this.props.options.afterInsertRow) {
        this.props.options.afterInsertRow(newObj);
      }
    }
  }]);

  return BootstrapTable;
}(_react.Component);

BootstrapTable.propTypes = {
  keyField: _react.PropTypes.string,
  height: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  maxHeight: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  data: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]),
  remote: _react.PropTypes.bool, // remote data, default is false
  striped: _react.PropTypes.bool,
  bordered: _react.PropTypes.bool,
  hover: _react.PropTypes.bool,
  condensed: _react.PropTypes.bool,
  pagination: _react.PropTypes.bool,
  printable: _react.PropTypes.bool,
  searchPlaceholder: _react.PropTypes.string,
  selectRow: _react.PropTypes.shape({
    mode: _react.PropTypes.oneOf([_Const2.default.ROW_SELECT_NONE, _Const2.default.ROW_SELECT_SINGLE, _Const2.default.ROW_SELECT_MULTI]),
    customComponent: _react.PropTypes.func,
    bgColor: _react.PropTypes.string,
    selected: _react.PropTypes.array,
    onSelect: _react.PropTypes.func,
    onSelectAll: _react.PropTypes.func,
    clickToSelect: _react.PropTypes.bool,
    hideSelectColumn: _react.PropTypes.bool,
    clickToSelectAndEditCell: _react.PropTypes.bool,
    showOnlySelected: _react.PropTypes.bool,
    unselectable: _react.PropTypes.array
  }),
  cellEdit: _react.PropTypes.shape({
    mode: _react.PropTypes.string,
    blurToSave: _react.PropTypes.bool,
    beforeSaveCell: _react.PropTypes.func,
    afterSaveCell: _react.PropTypes.func,
    nonEditableRows: _react.PropTypes.func
  }),
  insertRow: _react.PropTypes.bool,
  deleteRow: _react.PropTypes.bool,
  search: _react.PropTypes.bool,
  columnFilter: _react.PropTypes.bool,
  trClassName: _react.PropTypes.any,
  tableStyle: _react.PropTypes.object,
  containerStyle: _react.PropTypes.object,
  headerStyle: _react.PropTypes.object,
  bodyStyle: _react.PropTypes.object,
  containerClass: _react.PropTypes.string,
  tableContainerClass: _react.PropTypes.string,
  headerContainerClass: _react.PropTypes.string,
  bodyContainerClass: _react.PropTypes.string,
  tableHeaderClass: _react.PropTypes.string,
  tableBodyClass: _react.PropTypes.string,
  options: _react.PropTypes.shape({
    clearSearch: _react.PropTypes.bool,
    sortName: _react.PropTypes.string,
    sortOrder: _react.PropTypes.string,
    defaultSortName: _react.PropTypes.string,
    defaultSortOrder: _react.PropTypes.string,
    sortIndicator: _react.PropTypes.bool,
    afterTableComplete: _react.PropTypes.func,
    afterDeleteRow: _react.PropTypes.func,
    afterInsertRow: _react.PropTypes.func,
    afterSearch: _react.PropTypes.func,
    afterColumnFilter: _react.PropTypes.func,
    onRowClick: _react.PropTypes.func,
    onRowDoubleClick: _react.PropTypes.func,
    page: _react.PropTypes.number,
    pageStartIndex: _react.PropTypes.number,
    paginationShowsTotal: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func]),
    sizePerPageList: _react.PropTypes.array,
    sizePerPage: _react.PropTypes.number,
    paginationSize: _react.PropTypes.number,
    hideSizePerPage: _react.PropTypes.bool,
    onSortChange: _react.PropTypes.func,
    onPageChange: _react.PropTypes.func,
    onSizePerPageList: _react.PropTypes.func,
    onFilterChange: _react2.default.PropTypes.func,
    onSearchChange: _react2.default.PropTypes.func,
    onAddRow: _react2.default.PropTypes.func,
    onExportToCSV: _react2.default.PropTypes.func,
    onCellEdit: _react2.default.PropTypes.func,
    noDataText: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]),
    handleConfirmDeleteRow: _react.PropTypes.func,
    prePage: _react.PropTypes.string,
    nextPage: _react.PropTypes.string,
    firstPage: _react.PropTypes.string,
    lastPage: _react.PropTypes.string,
    searchDelayTime: _react.PropTypes.number,
    exportCSVText: _react.PropTypes.string,
    insertText: _react.PropTypes.string,
    deleteText: _react.PropTypes.string,
    saveText: _react.PropTypes.string,
    closeText: _react.PropTypes.string,
    ignoreEditable: _react.PropTypes.bool,
    defaultSearch: _react.PropTypes.string,
    expandRowBgColor: _react.PropTypes.string
  }),
  fetchInfo: _react.PropTypes.shape({
    dataTotalSize: _react.PropTypes.number
  }),
  exportCSV: _react.PropTypes.bool,
  csvFileName: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  ignoreSinglePage: _react.PropTypes.bool,
  expandableRow: _react.PropTypes.func,
  expandComponent: _react.PropTypes.func
};
BootstrapTable.defaultProps = {
  expandComponent: undefined,
  expandableRow: undefined,
  height: '100%',
  maxHeight: undefined,
  striped: false,
  bordered: true,
  hover: false,
  condensed: false,
  pagination: false,
  printable: false,
  searchPlaceholder: undefined,
  selectRow: {
    mode: _Const2.default.ROW_SELECT_NONE,
    bgColor: _Const2.default.ROW_SELECT_BG_COLOR,
    selected: [],
    onSelect: undefined,
    onSelectAll: undefined,
    clickToSelect: false,
    hideSelectColumn: false,
    clickToSelectAndEditCell: false,
    showOnlySelected: false,
    unselectable: [],
    customComponent: undefined
  },
  cellEdit: {
    mode: _Const2.default.CELL_EDIT_NONE,
    blurToSave: false,
    beforeSaveCell: undefined,
    afterSaveCell: undefined,
    nonEditableRows: undefined
  },
  insertRow: false,
  deleteRow: false,
  search: false,
  multiColumnSearch: false,
  columnFilter: false,
  trClassName: '',
  tableStyle: undefined,
  containerStyle: undefined,
  headerStyle: undefined,
  bodyStyle: undefined,
  containerClass: null,
  tableContainerClass: null,
  headerContainerClass: null,
  bodyContainerClass: null,
  tableHeaderClass: null,
  tableBodyClass: null,
  options: {
    clearSearch: false,
    sortName: undefined,
    sortOrder: undefined,
    defaultSortName: undefined,
    defaultSortOrder: undefined,
    sortIndicator: true,
    afterTableComplete: undefined,
    afterDeleteRow: undefined,
    afterInsertRow: undefined,
    afterSearch: undefined,
    afterColumnFilter: undefined,
    onRowClick: undefined,
    onRowDoubleClick: undefined,
    onMouseLeave: undefined,
    onMouseEnter: undefined,
    onRowMouseOut: undefined,
    onRowMouseOver: undefined,
    page: undefined,
    paginationShowsTotal: false,
    sizePerPageList: _Const2.default.SIZE_PER_PAGE_LIST,
    sizePerPage: undefined,
    paginationSize: _Const2.default.PAGINATION_SIZE,
    hideSizePerPage: false,
    onSizePerPageList: undefined,
    noDataText: undefined,
    handleConfirmDeleteRow: undefined,
    prePage: _Const2.default.PRE_PAGE,
    nextPage: _Const2.default.NEXT_PAGE,
    firstPage: _Const2.default.FIRST_PAGE,
    lastPage: _Const2.default.LAST_PAGE,
    pageStartIndex: undefined,
    searchDelayTime: undefined,
    exportCSVText: _Const2.default.EXPORT_CSV_TEXT,
    insertText: _Const2.default.INSERT_BTN_TEXT,
    deleteText: _Const2.default.DELETE_BTN_TEXT,
    saveText: _Const2.default.SAVE_BTN_TEXT,
    closeText: _Const2.default.CLOSE_BTN_TEXT,
    ignoreEditable: false,
    defaultSearch: '',
    expandRowBgColor: undefined
  },
  fetchInfo: {
    dataTotalSize: 0
  },
  exportCSV: false,
  csvFileName: 'spreadsheet.csv',
  ignoreSinglePage: false
};

var _default = BootstrapTable;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(BootstrapTable, 'BootstrapTable', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/BootstrapTable.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/BootstrapTable.js');
}();

;
},{"./Const":33,"./Filter":36,"./TableBody":39,"./TableFilter":42,"./TableHeader":43,"./csv_export_util":46,"./pagination/PaginationList":55,"./store/TableDataStore":56,"./toolbar/ToolBar":57,"./util":58,"classnames":1,"react":"react"}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _default = {
  SORT_DESC: 'desc',
  SORT_ASC: 'asc',
  SIZE_PER_PAGE: 10,
  NEXT_PAGE: '>',
  LAST_PAGE: '>>',
  PRE_PAGE: '<',
  FIRST_PAGE: '<<',
  PAGE_START_INDEX: 1,
  ROW_SELECT_BG_COLOR: '',
  ROW_SELECT_NONE: 'none',
  ROW_SELECT_SINGLE: 'radio',
  ROW_SELECT_MULTI: 'checkbox',
  CELL_EDIT_NONE: 'none',
  CELL_EDIT_CLICK: 'click',
  CELL_EDIT_DBCLICK: 'dbclick',
  SIZE_PER_PAGE_LIST: [10, 25, 30, 50],
  PAGINATION_SIZE: 5,
  NO_DATA_TEXT: 'There is no data to display',
  SHOW_ONLY_SELECT: 'Show Selected Only',
  SHOW_ALL: 'Show All',
  EXPORT_CSV_TEXT: 'Export to CSV',
  INSERT_BTN_TEXT: 'New',
  DELETE_BTN_TEXT: 'Delete',
  SAVE_BTN_TEXT: 'Save',
  CLOSE_BTN_TEXT: 'Close',
  FILTER_DELAY: 500,
  FILTER_TYPE: {
    TEXT: 'TextFilter',
    REGEX: 'RegexFilter',
    SELECT: 'SelectFilter',
    NUMBER: 'NumberFilter',
    DATE: 'DateFilter',
    CUSTOM: 'CustomFilter'
  }
};
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/Const.js');
}();

;
},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var editor = function editor(editable, attr, format, editorClass, defaultValue, ignoreEditable) {
  if (editable === true || editable === false && ignoreEditable || typeof editable === 'string') {
    // simple declare
    var type = editable ? 'text' : editable;
    return _react2.default.createElement('input', _extends({}, attr, { type: type, defaultValue: defaultValue,
      className: (editorClass || '') + ' form-control editor edit-text' }));
  } else if (!editable) {
    var _type = editable ? 'text' : editable;
    return _react2.default.createElement('input', _extends({}, attr, { type: _type, defaultValue: defaultValue,
      disabled: 'disabled',
      className: (editorClass || '') + ' form-control editor edit-text' }));
  } else if (editable && (editable.type === undefined || editable.type === null || editable.type.trim() === '')) {
    var _type2 = editable ? 'text' : editable;
    return _react2.default.createElement('input', _extends({}, attr, { type: _type2, defaultValue: defaultValue,
      className: (editorClass || '') + ' form-control editor edit-text' }));
  } else if (editable.type) {
    // standard declare
    // put style if exist
    editable.style && (attr.style = editable.style);
    // put class if exist
    attr.className = (editorClass || '') + ' form-control editor edit-' + editable.type + (editable.className ? ' ' + editable.className : '');

    if (editable.type === 'select') {
      // process select input
      var options = [];
      var values = editable.options.values;
      if (Array.isArray(values)) {
        (function () {
          // only can use arrray data for options
          var rowValue = void 0;
          options = values.map(function (d, i) {
            rowValue = format ? format(d) : d;
            return _react2.default.createElement(
              'option',
              { key: 'option' + i, value: d },
              rowValue
            );
          });
        })();
      }
      return _react2.default.createElement(
        'select',
        _extends({}, attr, { defaultValue: defaultValue }),
        options
      );
    } else if (editable.type === 'textarea') {
      var _ret2 = function () {
        // process textarea input
        // put other if exist
        editable.cols && (attr.cols = editable.cols);
        editable.rows && (attr.rows = editable.rows);
        var saveBtn = void 0;
        var keyUpHandler = attr.onKeyDown;
        if (keyUpHandler) {
          attr.onKeyDown = function (e) {
            if (e.keyCode !== 13) {
              // not Pressed ENTER
              keyUpHandler(e);
            }
          };
          saveBtn = _react2.default.createElement(
            'button',
            {
              className: 'btn btn-info btn-xs textarea-save-btn',
              onClick: keyUpHandler },
            'save'
          );
        }
        return {
          v: _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('textarea', _extends({}, attr, { defaultValue: defaultValue })),
            saveBtn
          )
        };
      }();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    } else if (editable.type === 'checkbox') {
      var _values = 'true:false';
      if (editable.options && editable.options.values) {
        // values = editable.options.values.split(':');
        _values = editable.options.values;
      }
      attr.className = attr.className.replace('form-control', '');
      attr.className += ' checkbox pull-right';

      var checked = defaultValue && defaultValue.toString() === _values.split(':')[0] ? true : false;

      return _react2.default.createElement('input', _extends({}, attr, { type: 'checkbox',
        value: _values, defaultChecked: checked }));
    } else if (editable.type === 'datetime') {
      return _react2.default.createElement('input', _extends({}, attr, { type: 'datetime-local', defaultValue: defaultValue }));
    } else {
      // process other input type. as password,url,email...
      return _react2.default.createElement('input', _extends({}, attr, { type: 'text', defaultValue: defaultValue }));
    }
  }
  // default return for other case of editable
  return _react2.default.createElement('input', _extends({}, attr, { type: 'text',
    className: (editorClass || '') + ' form-control editor edit-text' }));
};

var _default = editor;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(editor, 'editor', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/Editor.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/Editor.js');
}();

;
},{"react":"react"}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-len: 0 */


var ExpandComponent = function (_Component) {
  _inherits(ExpandComponent, _Component);

  function ExpandComponent() {
    _classCallCheck(this, ExpandComponent);

    return _possibleConstructorReturn(this, (ExpandComponent.__proto__ || Object.getPrototypeOf(ExpandComponent)).apply(this, arguments));
  }

  _createClass(ExpandComponent, [{
    key: 'render',
    value: function render() {
      var trCss = {
        style: {
          backgroundColor: this.props.bgColor
        },
        className: (0, _classnames2.default)(this.props.isSelected ? this.props.selectRow.className : null, this.props.className)
      };
      return _react2.default.createElement(
        'tr',
        _extends({ hidden: this.props.hidden, width: this.props.width }, trCss),
        _react2.default.createElement(
          'td',
          { colSpan: this.props.colSpan },
          this.props.children
        )
      );
    }
  }]);

  return ExpandComponent;
}(_react.Component);

var _default = ExpandComponent;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ExpandComponent, 'ExpandComponent', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/ExpandComponent.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/ExpandComponent.js');
}();

;
},{"classnames":1,"react":"react"}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Filter = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Filter = exports.Filter = function (_EventEmitter) {
  _inherits(Filter, _EventEmitter);

  function Filter(data) {
    _classCallCheck(this, Filter);

    var _this = _possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, data));

    _this.currentFilter = {};
    return _this;
  }

  _createClass(Filter, [{
    key: 'handleFilter',
    value: function handleFilter(dataField, value, type) {
      var filterType = type || _Const2.default.FILTER_TYPE.CUSTOM;

      if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        // value of the filter is an object
        var hasValue = true;
        for (var prop in value) {
          if (!value[prop] || value[prop] === '') {
            hasValue = false;
            break;
          }
        }
        // if one of the object properties is undefined or empty, we remove the filter
        if (hasValue) {
          this.currentFilter[dataField] = { value: value, type: filterType };
        } else {
          delete this.currentFilter[dataField];
        }
      } else if (!value || value.trim() === '') {
        delete this.currentFilter[dataField];
      } else {
        this.currentFilter[dataField] = { value: value.trim(), type: filterType };
      }
      this.emit('onFilterChange', this.currentFilter);
    }
  }]);

  return Filter;
}(_events.EventEmitter);

;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Filter, 'Filter', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/Filter.js');
}();

;
},{"./Const":33,"events":6}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactToastr = require('react-toastr');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToastrMessageFactory = _react2.default.createFactory(_reactToastr.ToastMessage.animation);

var Notification = function (_Component) {
  _inherits(Notification, _Component);

  function Notification() {
    _classCallCheck(this, Notification);

    return _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).apply(this, arguments));
  }

  _createClass(Notification, [{
    key: 'notice',

    // allow type is success,info,warning,error
    value: function notice(type, msg, title) {
      this.refs.toastr[type](msg, title, {
        mode: 'single',
        timeOut: 5000,
        extendedTimeOut: 1000,
        showAnimation: 'animated  bounceIn',
        hideAnimation: 'animated bounceOut'
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactToastr.ToastContainer, { ref: 'toastr',
        toastMessageFactory: ToastrMessageFactory,
        id: 'toast-container',
        className: 'toast-top-right' });
    }
  }]);

  return Notification;
}(_react.Component);

var _default = Notification;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ToastrMessageFactory, 'ToastrMessageFactory', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/Notification.js');

  __REACT_HOT_LOADER__.register(Notification, 'Notification', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/Notification.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/Notification.js');
}();

;
},{"react":"react","react-toastr":207}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectRowHeaderColumn = function (_Component) {
  _inherits(SelectRowHeaderColumn, _Component);

  function SelectRowHeaderColumn() {
    _classCallCheck(this, SelectRowHeaderColumn);

    return _possibleConstructorReturn(this, (SelectRowHeaderColumn.__proto__ || Object.getPrototypeOf(SelectRowHeaderColumn)).apply(this, arguments));
  }

  _createClass(SelectRowHeaderColumn, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'th',
        { style: { textAlign: 'center' } },
        this.props.children
      );
    }
  }]);

  return SelectRowHeaderColumn;
}(_react.Component);

SelectRowHeaderColumn.propTypes = {
  children: _react.PropTypes.node
};
var _default = SelectRowHeaderColumn;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(SelectRowHeaderColumn, 'SelectRowHeaderColumn', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/SelectRowHeaderColumn.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/SelectRowHeaderColumn.js');
}();

;
},{"react":"react"}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _TableRow = require('./TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _TableColumn = require('./TableColumn');

var _TableColumn2 = _interopRequireDefault(_TableColumn);

var _TableEditColumn = require('./TableEditColumn');

var _TableEditColumn2 = _interopRequireDefault(_TableEditColumn);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ExpandComponent = require('./ExpandComponent');

var _ExpandComponent2 = _interopRequireDefault(_ExpandComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isFun = function isFun(obj) {
  return obj && typeof obj === 'function';
};

var TableBody = function (_Component) {
  _inherits(TableBody, _Component);

  function TableBody(props) {
    _classCallCheck(this, TableBody);

    var _this = _possibleConstructorReturn(this, (TableBody.__proto__ || Object.getPrototypeOf(TableBody)).call(this, props));

    _this.handleRowMouseOut = function () {
      return _this.__handleRowMouseOut__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleRowMouseOver = function () {
      return _this.__handleRowMouseOver__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleRowClick = function () {
      return _this.__handleRowClick__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleRowDoubleClick = function () {
      return _this.__handleRowDoubleClick__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleSelectRow = function () {
      return _this.__handleSelectRow__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleSelectRowColumChange = function () {
      return _this.__handleSelectRowColumChange__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleEditCell = function () {
      return _this.__handleEditCell__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleCompleteEditCell = function () {
      return _this.__handleCompleteEditCell__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.state = {
      currEditCell: null,
      expanding: [],
      lastExpand: null
    };
    return _this;
  }

  _createClass(TableBody, [{
    key: 'render',
    value: function render() {
      var cellEdit = this.props.cellEdit;

      var tableClasses = (0, _classnames2.default)('table', {
        'table-striped': this.props.striped,
        'table-bordered': this.props.bordered,
        'table-hover': this.props.hover,
        'table-condensed': this.props.condensed
      }, this.props.tableBodyClass);

      var noneditableRows = cellEdit.nonEditableRows && cellEdit.nonEditableRows() || [];
      var unselectable = this.props.selectRow.unselectable || [];
      var isSelectRowDefined = this._isSelectRowDefined();
      var tableHeader = this.renderTableHeader(isSelectRowDefined);
      var inputType = this.props.selectRow.mode === _Const2.default.ROW_SELECT_SINGLE ? 'radio' : 'checkbox';
      var CustomComponent = this.props.selectRow.customComponent;

      var tableRows = this.props.data.map(function (data, r) {
        var tableColumns = this.props.columns.map(function (column, i) {
          var fieldValue = data[column.name];
          if (column.name !== this.props.keyField && // Key field can't be edit
          column.editable && // column is editable? default is true, user can set it false
          this.state.currEditCell !== null && this.state.currEditCell.rid === r && this.state.currEditCell.cid === i && noneditableRows.indexOf(data[this.props.keyField]) === -1) {
            var editable = column.editable;
            var format = column.format ? function (value) {
              return column.format(value, data, column.formatExtraData, r).replace(/<.*?>/g, '');
            } : false;
            if (isFun(column.editable)) {
              editable = column.editable(fieldValue, data, r, i);
            }

            return _react2.default.createElement(_TableEditColumn2.default, {
              completeEdit: this.handleCompleteEditCell
              // add by bluespring for column editor customize
              , editable: editable,
              customEditor: column.customEditor,
              format: column.format ? format : false,
              key: i,
              blurToSave: cellEdit.blurToSave,
              rowIndex: r,
              colIndex: i,
              row: data,
              fieldValue: fieldValue });
          } else {
            // add by bluespring for className customize
            var columnChild = fieldValue && fieldValue.toString();
            var columnTitle = null;
            var tdClassName = column.className;
            if (isFun(column.className)) {
              tdClassName = column.className(fieldValue, data, r, i);
            }

            if (typeof column.format !== 'undefined') {
              var formattedValue = column.format(fieldValue, data, column.formatExtraData, r);
              if (!_react2.default.isValidElement(formattedValue)) {
                columnChild = _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: formattedValue } });
              } else {
                columnChild = formattedValue;
                columnTitle = column.columnTitle && formattedValue ? formattedValue.toString() : null;
              }
            } else {
              columnTitle = column.columnTitle && fieldValue ? fieldValue.toString() : null;
            }
            return _react2.default.createElement(
              _TableColumn2.default,
              { key: i,
                rIndex: r,
                dataAlign: column.align,
                className: tdClassName,
                columnTitle: columnTitle,
                cellEdit: cellEdit,
                hidden: column.hidden,
                onEdit: this.handleEditCell,
                width: column.width },
              columnChild
            );
          }
        }, this);
        var key = data[this.props.keyField];
        var disable = unselectable.indexOf(key) !== -1;
        var selected = this.props.selectedRowKeys.indexOf(key) !== -1;
        var selectRowColumn = isSelectRowDefined && !this.props.selectRow.hideSelectColumn ? this.renderSelectRowColumn(selected, inputType, disable, CustomComponent, r) : null;
        // add by bluespring for className customize
        var trClassName = this.props.trClassName;
        if (isFun(this.props.trClassName)) {
          trClassName = this.props.trClassName(data, r);
        }
        var result = [_react2.default.createElement(
          _TableRow2.default,
          { isSelected: selected, key: key, className: trClassName,
            index: r,
            selectRow: isSelectRowDefined ? this.props.selectRow : undefined,
            enableCellEdit: cellEdit.mode !== _Const2.default.CELL_EDIT_NONE,
            onRowClick: this.handleRowClick,
            onRowDoubleClick: this.handleRowDoubleClick,
            onRowMouseOver: this.handleRowMouseOver,
            onRowMouseOut: this.handleRowMouseOut,
            onSelectRow: this.handleSelectRow,
            unselectableRow: disable },
          selectRowColumn,
          tableColumns
        )];

        if (this.props.expandableRow && this.props.expandableRow(data)) {
          var colSpan = this.props.columns.length;
          var bgColor = this.props.expandRowBgColor || this.props.selectRow.bgColor || undefined;
          if (isSelectRowDefined && !this.props.selectRow.hideSelectColumn) {
            colSpan += 1;
          }
          result.push(_react2.default.createElement(
            _ExpandComponent2.default,
            {
              className: trClassName,
              bgColor: bgColor,
              hidden: !(this.state.expanding.indexOf(key) > -1),
              colSpan: colSpan,
              width: "100%" },
            this.props.expandComponent(data)
          ));
        }
        return result;
      }, this);
      if (tableRows.length === 0) {
        tableRows.push(_react2.default.createElement(
          _TableRow2.default,
          { key: '##table-empty##' },
          _react2.default.createElement(
            'td',
            { 'data-toggle': 'collapse',
              colSpan: this.props.columns.length + (isSelectRowDefined ? 1 : 0),
              className: 'react-bs-table-no-data' },
            this.props.noDataText || _Const2.default.NO_DATA_TEXT
          )
        ));
      }

      return _react2.default.createElement(
        'div',
        { ref: 'container',
          className: (0, _classnames2.default)('react-bs-container-body', this.props.bodyContainerClass),
          style: this.props.style },
        _react2.default.createElement(
          'table',
          { className: tableClasses },
          tableHeader,
          _react2.default.createElement(
            'tbody',
            { ref: 'tbody' },
            tableRows
          )
        )
      );
    }
  }, {
    key: 'renderTableHeader',
    value: function renderTableHeader(isSelectRowDefined) {
      var selectRowHeader = null;

      if (isSelectRowDefined) {
        var style = {
          width: 30,
          minWidth: 30
        };
        if (!this.props.selectRow.hideSelectColumn) {
          selectRowHeader = _react2.default.createElement('col', { style: style, key: -1 });
        }
      }
      var theader = this.props.columns.map(function (column, i) {
        var style = {
          display: column.hidden ? 'none' : null
        };
        if (column.width) {
          var width = parseInt(column.width, 10);
          style.width = width;
          /** add min-wdth to fix user assign column width
          not eq offsetWidth in large column table **/
          style.minWidth = width;
        }
        return _react2.default.createElement('col', { style: style, key: i, className: column.className });
      });

      return _react2.default.createElement(
        'colgroup',
        { ref: 'header' },
        selectRowHeader,
        theader
      );
    }
  }, {
    key: '__handleRowMouseOut__REACT_HOT_LOADER__',
    value: function __handleRowMouseOut__REACT_HOT_LOADER__(rowIndex, event) {
      var targetRow = this.props.data[rowIndex];
      this.props.onRowMouseOut(targetRow, event);
    }
  }, {
    key: '__handleRowMouseOver__REACT_HOT_LOADER__',
    value: function __handleRowMouseOver__REACT_HOT_LOADER__(rowIndex, event) {
      var targetRow = this.props.data[rowIndex];
      this.props.onRowMouseOver(targetRow, event);
    }
  }, {
    key: '__handleRowClick__REACT_HOT_LOADER__',
    value: function __handleRowClick__REACT_HOT_LOADER__(rowIndex) {
      var _this2 = this;

      var selectedRow = void 0;
      var _props = this.props,
          data = _props.data,
          onRowClick = _props.onRowClick;

      data.forEach(function (row, i) {
        if (i === rowIndex - 1) {
          selectedRow = row;
        }
      });
      var rowKey = selectedRow[this.props.keyField];
      if (this.props.expandableRow) {
        var expanding = this.state.expanding;
        if (this.state.expanding.indexOf(rowKey) > -1) {
          expanding = expanding.filter(function (k) {
            return k !== rowKey;
          });
        } else {
          expanding.push(rowKey);
        }
        this.setState({ expanding: expanding }, function () {
          _this2.props.adjustHeaderWidth();
        });
      }
      onRowClick(selectedRow);
    }
  }, {
    key: '__handleRowDoubleClick__REACT_HOT_LOADER__',
    value: function __handleRowDoubleClick__REACT_HOT_LOADER__(rowIndex) {
      var selectedRow = void 0;
      var _props2 = this.props,
          data = _props2.data,
          onRowDoubleClick = _props2.onRowDoubleClick;

      data.forEach(function (row, i) {
        if (i === rowIndex - 1) {
          selectedRow = row;
        }
      });
      onRowDoubleClick(selectedRow);
    }
  }, {
    key: '__handleSelectRow__REACT_HOT_LOADER__',
    value: function __handleSelectRow__REACT_HOT_LOADER__(rowIndex, isSelected, e) {
      var selectedRow = void 0;
      var _props3 = this.props,
          data = _props3.data,
          onSelectRow = _props3.onSelectRow;

      data.forEach(function (row, i) {
        if (i === rowIndex - 1) {
          selectedRow = row;
          return false;
        }
      });
      onSelectRow(selectedRow, isSelected, e);
    }
  }, {
    key: '__handleSelectRowColumChange__REACT_HOT_LOADER__',
    value: function __handleSelectRowColumChange__REACT_HOT_LOADER__(e, rowIndex) {
      if (!this.props.selectRow.clickToSelect || !this.props.selectRow.clickToSelectAndEditCell) {
        this.handleSelectRow(rowIndex + 1, e.currentTarget.checked, e);
      }
    }
  }, {
    key: '__handleEditCell__REACT_HOT_LOADER__',
    value: function __handleEditCell__REACT_HOT_LOADER__(rowIndex, columnIndex, e) {
      if (this._isSelectRowDefined()) {
        columnIndex--;
        if (this.props.selectRow.hideSelectColumn) columnIndex++;
      }
      rowIndex--;
      var stateObj = {
        currEditCell: {
          rid: rowIndex,
          cid: columnIndex
        }
      };

      if (this.props.selectRow.clickToSelectAndEditCell && this.props.cellEdit.mode !== _Const2.default.CELL_EDIT_DBCLICK) {
        var selected = this.props.selectedRowKeys.indexOf(this.props.data[rowIndex][this.props.keyField]) !== -1;
        this.handleSelectRow(rowIndex + 1, !selected, e);
      }
      this.setState(stateObj);
    }
  }, {
    key: '__handleCompleteEditCell__REACT_HOT_LOADER__',
    value: function __handleCompleteEditCell__REACT_HOT_LOADER__(newVal, rowIndex, columnIndex) {
      this.setState({ currEditCell: null });
      if (newVal !== null) {
        this.props.cellEdit.__onCompleteEdit__(newVal, rowIndex, columnIndex);
      }
    }
  }, {
    key: 'renderSelectRowColumn',
    value: function renderSelectRowColumn(selected, inputType, disabled) {
      var _this3 = this;

      var CustomComponent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var rowIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      return _react2.default.createElement(
        _TableColumn2.default,
        { dataAlign: 'center' },
        CustomComponent ? _react2.default.createElement(CustomComponent, { type: inputType, checked: selected, disabled: disabled,
          rowIndex: rowIndex,
          onChange: function onChange(e) {
            return _this3.handleSelectRowColumChange(e, rowIndex);
          } }) : _react2.default.createElement('input', { type: inputType, checked: selected, disabled: disabled,
          onChange: function onChange(e) {
            return _this3.handleSelectRowColumChange(e, rowIndex);
          } })
      );
    }
  }, {
    key: '_isSelectRowDefined',
    value: function _isSelectRowDefined() {
      return this.props.selectRow.mode === _Const2.default.ROW_SELECT_SINGLE || this.props.selectRow.mode === _Const2.default.ROW_SELECT_MULTI;
    }
  }]);

  return TableBody;
}(_react.Component);

TableBody.propTypes = {
  data: _react.PropTypes.array,
  columns: _react.PropTypes.array,
  striped: _react.PropTypes.bool,
  bordered: _react.PropTypes.bool,
  hover: _react.PropTypes.bool,
  condensed: _react.PropTypes.bool,
  keyField: _react.PropTypes.string,
  selectedRowKeys: _react.PropTypes.array,
  onRowClick: _react.PropTypes.func,
  onRowDoubleClick: _react.PropTypes.func,
  onSelectRow: _react.PropTypes.func,
  noDataText: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]),
  style: _react.PropTypes.object,
  tableBodyClass: _react.PropTypes.string,
  bodyContainerClass: _react.PropTypes.string,
  expandableRow: _react.PropTypes.func,
  expandComponent: _react.PropTypes.func,
  expandRowBgColor: _react.PropTypes.string,
  adjustHeaderWidth: _react.PropTypes.func
};
var _default = TableBody;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(isFun, 'isFun', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableBody.js');

  __REACT_HOT_LOADER__.register(TableBody, 'TableBody', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableBody.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableBody.js');
}();

;
},{"./Const":33,"./ExpandComponent":35,"./TableColumn":40,"./TableEditColumn":41,"./TableRow":45,"classnames":1,"react":"react"}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableColumn = function (_Component) {
  _inherits(TableColumn, _Component);

  function TableColumn(props) {
    _classCallCheck(this, TableColumn);

    var _this = _possibleConstructorReturn(this, (TableColumn.__proto__ || Object.getPrototypeOf(TableColumn)).call(this, props));

    _this.handleCellEdit = function () {
      return _this.__handleCellEdit__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    return _this;
  }
  /* eslint no-unused-vars: [0, { "args": "after-used" }] */


  _createClass(TableColumn, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var children = this.props.children;

      var shouldUpdated = this.props.width !== nextProps.width || this.props.className !== nextProps.className || this.props.hidden !== nextProps.hidden || this.props.dataAlign !== nextProps.dataAlign || (typeof children === 'undefined' ? 'undefined' : _typeof(children)) !== _typeof(nextProps.children) || ('' + this.props.onEdit).toString() !== ('' + nextProps.onEdit).toString();

      if (shouldUpdated) {
        return shouldUpdated;
      }

      if ((typeof children === 'undefined' ? 'undefined' : _typeof(children)) === 'object' && children !== null && children.props !== null) {
        if (children.props.type === 'checkbox' || children.props.type === 'radio') {
          shouldUpdated = shouldUpdated || children.props.type !== nextProps.children.props.type || children.props.checked !== nextProps.children.props.checked || children.props.disabled !== nextProps.children.props.disabled;
        } else {
          shouldUpdated = true;
        }
      } else {
        shouldUpdated = shouldUpdated || children !== nextProps.children;
      }

      if (shouldUpdated) {
        return shouldUpdated;
      }

      if (!(this.props.cellEdit && nextProps.cellEdit)) {
        return false;
      } else {
        return shouldUpdated || this.props.cellEdit.mode !== nextProps.cellEdit.mode;
      }
    }
  }, {
    key: '__handleCellEdit__REACT_HOT_LOADER__',
    value: function __handleCellEdit__REACT_HOT_LOADER__(e) {
      if (this.props.cellEdit.mode === _Const2.default.CELL_EDIT_DBCLICK) {
        if (document.selection && document.selection.empty) {
          document.selection.empty();
        } else if (window.getSelection) {
          var sel = window.getSelection();
          sel.removeAllRanges();
        }
      }
      this.props.onEdit(this.props.rIndex + 1, e.currentTarget.cellIndex, e);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          columnTitle = _props.columnTitle,
          className = _props.className,
          dataAlign = _props.dataAlign,
          hidden = _props.hidden,
          cellEdit = _props.cellEdit;


      var tdStyle = {
        textAlign: dataAlign,
        display: hidden ? 'none' : null
      };

      var opts = {};

      if (cellEdit) {
        if (cellEdit.mode === _Const2.default.CELL_EDIT_CLICK) {
          opts.onClick = this.handleCellEdit;
        } else if (cellEdit.mode === _Const2.default.CELL_EDIT_DBCLICK) {
          opts.onDoubleClick = this.handleCellEdit;
        }
      }
      return _react2.default.createElement(
        'td',
        _extends({ style: tdStyle,
          title: columnTitle,
          className: className
        }, opts),
        typeof children === 'boolean' ? children.toString() : children
      );
    }
  }]);

  return TableColumn;
}(_react.Component);

TableColumn.propTypes = {
  rIndex: _react.PropTypes.number,
  dataAlign: _react.PropTypes.string,
  hidden: _react.PropTypes.bool,
  className: _react.PropTypes.string,
  columnTitle: _react.PropTypes.string,
  children: _react.PropTypes.node
};

TableColumn.defaultProps = {
  dataAlign: 'left',
  hidden: false,
  className: ''
};
var _default = TableColumn;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TableColumn, 'TableColumn', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableColumn.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableColumn.js');
}();

;
},{"./Const":33,"react":"react"}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Editor = require('./Editor');

var _Editor2 = _interopRequireDefault(_Editor);

var _Notification = require('./Notification.js');

var _Notification2 = _interopRequireDefault(_Notification);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableEditColumn = function (_Component) {
  _inherits(TableEditColumn, _Component);

  function TableEditColumn(props) {
    _classCallCheck(this, TableEditColumn);

    var _this = _possibleConstructorReturn(this, (TableEditColumn.__proto__ || Object.getPrototypeOf(TableEditColumn)).call(this, props));

    _this.handleKeyPress = function () {
      return _this.__handleKeyPress__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleBlur = function () {
      return _this.__handleBlur__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleCustomUpdate = function () {
      return _this.__handleCustomUpdate__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.timeouteClear = 0;
    _this.state = {
      shakeEditor: false
    };
    return _this;
  }

  _createClass(TableEditColumn, [{
    key: '__handleKeyPress__REACT_HOT_LOADER__',
    value: function __handleKeyPress__REACT_HOT_LOADER__(e) {
      if (e.keyCode === 13) {
        // Pressed ENTER
        var value = e.currentTarget.type === 'checkbox' ? this._getCheckBoxValue(e) : e.currentTarget.value;

        if (!this.validator(value)) {
          return;
        }
        this.props.completeEdit(value, this.props.rowIndex, this.props.colIndex);
      } else if (e.keyCode === 27) {
        this.props.completeEdit(null, this.props.rowIndex, this.props.colIndex);
      } else if (e.type === 'click' && !this.props.blurToSave) {
        // textarea click save button
        var _value = e.target.parentElement.firstChild.value;
        if (!this.validator(_value)) {
          return;
        }
        this.props.completeEdit(_value, this.props.rowIndex, this.props.colIndex);
      }
    }
  }, {
    key: '__handleBlur__REACT_HOT_LOADER__',
    value: function __handleBlur__REACT_HOT_LOADER__(e) {
      e.stopPropagation();
      if (this.props.blurToSave) {
        var value = e.currentTarget.type === 'checkbox' ? this._getCheckBoxValue(e) : e.currentTarget.value;
        if (!this.validator(value)) {
          return;
        }
        this.props.completeEdit(value, this.props.rowIndex, this.props.colIndex);
      }
    }
  }, {
    key: '__handleCustomUpdate__REACT_HOT_LOADER__',


    // modified by iuculanop
    // BEGIN
    value: function __handleCustomUpdate__REACT_HOT_LOADER__(value) {
      this.props.completeEdit(value, this.props.rowIndex, this.props.colIndex);
    }
  }, {
    key: 'validator',
    value: function validator(value) {
      var ts = this;
      var valid = true;
      if (ts.props.editable.validator) {
        var input = ts.refs.inputRef;
        var checkVal = ts.props.editable.validator(value);
        var responseType = typeof checkVal === 'undefined' ? 'undefined' : _typeof(checkVal);
        if (responseType !== 'object' && checkVal !== true) {
          valid = false;
          ts.refs.notifier.notice('error', checkVal, 'Pressed ESC can cancel');
        } else if (responseType === 'object' && checkVal.isValid !== true) {
          valid = false;
          ts.refs.notifier.notice(checkVal.notification.type, checkVal.notification.msg, checkVal.notification.title);
        }
        if (!valid) {
          // animate input
          ts.clearTimeout();
          ts.setState({ shakeEditor: true });
          ts.timeouteClear = setTimeout(function () {
            ts.setState({ shakeEditor: false });
          }, 300);
          input.focus();
          return valid;
        }
      }
      return valid;
    }
    // END

  }, {
    key: 'clearTimeout',
    value: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function () {
      if (this.timeouteClear !== 0) {
        clearTimeout(this.timeouteClear);
        this.timeouteClear = 0;
      }
    })
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refs.inputRef.focus();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearTimeout();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          editable = _props.editable,
          format = _props.format,
          customEditor = _props.customEditor;
      var shakeEditor = this.state.shakeEditor;

      var attr = {
        ref: 'inputRef',
        onKeyDown: this.handleKeyPress,
        onBlur: this.handleBlur
      };
      var fieldValue = this.props.fieldValue;
      // put placeholder if exist

      editable.placeholder && (attr.placeholder = editable.placeholder);

      var editorClass = (0, _classnames2.default)({ 'animated': shakeEditor, 'shake': shakeEditor });
      var cellEditor = void 0;
      if (customEditor) {
        var customEditorProps = _extends({
          row: this.props.row
        }, attr, {
          defaultValue: fieldValue || ''
        }, customEditor.customEditorParameters);
        cellEditor = customEditor.getElement(this.handleCustomUpdate, customEditorProps);
      } else {
        fieldValue = fieldValue === 0 ? '0' : fieldValue;
        cellEditor = (0, _Editor2.default)(editable, attr, format, editorClass, fieldValue || '');
      }

      return _react2.default.createElement(
        'td',
        { ref: 'td', style: { position: 'relative' } },
        cellEditor,
        _react2.default.createElement(_Notification2.default, { ref: 'notifier' })
      );
    }
  }, {
    key: '_getCheckBoxValue',
    value: function _getCheckBoxValue(e) {
      var value = '';
      var values = e.currentTarget.value.split(':');
      value = e.currentTarget.checked ? values[0] : values[1];
      return value;
    }
  }]);

  return TableEditColumn;
}(_react.Component);

TableEditColumn.propTypes = {
  completeEdit: _react.PropTypes.func,
  rowIndex: _react.PropTypes.number,
  colIndex: _react.PropTypes.number,
  blurToSave: _react.PropTypes.bool,
  editable: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object]),
  format: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func]),
  row: _react.PropTypes.any,
  fieldValue: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.bool, _react.PropTypes.number, _react.PropTypes.array, _react.PropTypes.object])
};

var _default = TableEditColumn;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TableEditColumn, 'TableEditColumn', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableEditColumn.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableEditColumn.js');
}();

;
},{"./Editor":34,"./Notification.js":37,"classnames":1,"react":"react"}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableFilter = function (_Component) {
  _inherits(TableFilter, _Component);

  function TableFilter(props) {
    _classCallCheck(this, TableFilter);

    var _this = _possibleConstructorReturn(this, (TableFilter.__proto__ || Object.getPrototypeOf(TableFilter)).call(this, props));

    _this.handleKeyUp = function () {
      return _this.__handleKeyUp__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.filterObj = {};
    return _this;
  }

  _createClass(TableFilter, [{
    key: '__handleKeyUp__REACT_HOT_LOADER__',
    value: function __handleKeyUp__REACT_HOT_LOADER__(e) {
      var _e$currentTarget = e.currentTarget,
          value = _e$currentTarget.value,
          name = _e$currentTarget.name;

      if (value.trim() === '') {
        delete this.filterObj[name];
      } else {
        this.filterObj[name] = value;
      }
      this.props.onFilter(this.filterObj);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          striped = _props.striped,
          condensed = _props.condensed,
          rowSelectType = _props.rowSelectType,
          columns = _props.columns;

      var tableClasses = (0, _classnames2.default)('table', {
        'table-striped': striped,
        'table-condensed': condensed
      });
      var selectRowHeader = null;

      if (rowSelectType === _Const2.default.ROW_SELECT_SINGLE || rowSelectType === _Const2.default.ROW_SELECT_MULTI) {
        var style = {
          width: 35,
          paddingLeft: 0,
          paddingRight: 0
        };
        selectRowHeader = _react2.default.createElement(
          'th',
          { style: style, key: -1 },
          'Filter'
        );
      }

      var filterField = columns.map(function (column) {
        var hidden = column.hidden,
            width = column.width,
            name = column.name;

        var thStyle = {
          display: hidden ? 'none' : null,
          width: width
        };
        return _react2.default.createElement(
          'th',
          { key: name, style: thStyle },
          _react2.default.createElement(
            'div',
            { className: 'th-inner table-header-column' },
            _react2.default.createElement('input', { size: '10', type: 'text',
              placeholder: name, name: name, onKeyUp: this.handleKeyUp })
          )
        );
      }, this);

      return _react2.default.createElement(
        'table',
        { className: tableClasses, style: { marginTop: 5 } },
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            { style: { borderBottomStyle: 'hidden' } },
            selectRowHeader,
            filterField
          )
        )
      );
    }
  }]);

  return TableFilter;
}(_react.Component);

TableFilter.propTypes = {
  columns: _react.PropTypes.array,
  rowSelectType: _react.PropTypes.string,
  onFilter: _react.PropTypes.func
};
var _default = TableFilter;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TableFilter, 'TableFilter', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableFilter.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableFilter.js');
}();

;
},{"./Const":33,"classnames":1,"react":"react"}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _SelectRowHeaderColumn = require('./SelectRowHeaderColumn');

var _SelectRowHeaderColumn2 = _interopRequireDefault(_SelectRowHeaderColumn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Checkbox = function (_Component) {
  _inherits(Checkbox, _Component);

  function Checkbox() {
    _classCallCheck(this, Checkbox);

    return _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).apply(this, arguments));
  }

  _createClass(Checkbox, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.update(this.props.checked);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      this.update(props.checked);
    }
  }, {
    key: 'update',
    value: function update(checked) {
      _reactDom2.default.findDOMNode(this).indeterminate = checked === 'indeterminate';
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('input', { className: 'react-bs-select-all',
        type: 'checkbox',
        checked: this.props.checked,
        onChange: this.props.onChange });
    }
  }]);

  return Checkbox;
}(_react.Component);

var TableHeader = function (_Component2) {
  _inherits(TableHeader, _Component2);

  function TableHeader() {
    _classCallCheck(this, TableHeader);

    return _possibleConstructorReturn(this, (TableHeader.__proto__ || Object.getPrototypeOf(TableHeader)).apply(this, arguments));
  }

  _createClass(TableHeader, [{
    key: 'render',
    value: function render() {
      var _this3 = this;

      var containerClasses = (0, _classnames2.default)('react-bs-container-header', 'table-header-wrapper', this.props.headerContainerClass);
      var tableClasses = (0, _classnames2.default)('table', 'table-hover', {
        'table-bordered': this.props.bordered,
        'table-condensed': this.props.condensed
      }, this.props.tableHeaderClass);
      var selectRowHeaderCol = null;
      if (!this.props.hideSelectColumn) selectRowHeaderCol = this.renderSelectRowHeader();
      var i = 0;
      return _react2.default.createElement(
        'div',
        { ref: 'container', className: containerClasses, style: this.props.style },
        _react2.default.createElement(
          'table',
          { className: tableClasses },
          _react2.default.createElement(
            'thead',
            null,
            _react2.default.createElement(
              'tr',
              { ref: 'header' },
              selectRowHeaderCol,
              _react2.default.Children.map(this.props.children, function (elm) {
                var _props = _this3.props,
                    sortIndicator = _props.sortIndicator,
                    sortName = _props.sortName,
                    sortOrder = _props.sortOrder,
                    onSort = _props.onSort;
                var _elm$props = elm.props,
                    dataField = _elm$props.dataField,
                    dataSort = _elm$props.dataSort;

                var sort = dataSort && dataField === sortName ? sortOrder : undefined;
                return _react2.default.cloneElement(elm, { key: i++, onSort: onSort, sort: sort, sortIndicator: sortIndicator });
              })
            )
          )
        )
      );
    }
  }, {
    key: 'renderSelectRowHeader',
    value: function renderSelectRowHeader() {
      if (this.props.customComponent) {
        var CustomComponent = this.props.customComponent;
        return _react2.default.createElement(
          _SelectRowHeaderColumn2.default,
          null,
          _react2.default.createElement(CustomComponent, { type: 'checkbox', checked: this.props.isSelectAll,
            indeterminate: this.props.isSelectAll === 'indeterminate', disabled: false,
            onChange: this.props.onSelectAllRow, rowIndex: 'Header' })
        );
      } else if (this.props.rowSelectType === _Const2.default.ROW_SELECT_SINGLE) {
        return _react2.default.createElement(_SelectRowHeaderColumn2.default, null);
      } else if (this.props.rowSelectType === _Const2.default.ROW_SELECT_MULTI) {
        return _react2.default.createElement(
          _SelectRowHeaderColumn2.default,
          null,
          _react2.default.createElement(Checkbox, {
            onChange: this.props.onSelectAllRow,
            checked: this.props.isSelectAll })
        );
      } else {
        return null;
      }
    }
  }]);

  return TableHeader;
}(_react.Component);

TableHeader.propTypes = {
  headerContainerClass: _react.PropTypes.string,
  tableHeaderClass: _react.PropTypes.string,
  style: _react.PropTypes.object,
  rowSelectType: _react.PropTypes.string,
  onSort: _react.PropTypes.func,
  onSelectAllRow: _react.PropTypes.func,
  sortName: _react.PropTypes.string,
  sortOrder: _react.PropTypes.string,
  hideSelectColumn: _react.PropTypes.bool,
  bordered: _react.PropTypes.bool,
  condensed: _react.PropTypes.bool,
  isFiltered: _react.PropTypes.bool,
  isSelectAll: _react.PropTypes.oneOf([true, 'indeterminate', false]),
  sortIndicator: _react.PropTypes.bool,
  customComponent: _react.PropTypes.func
};

var _default = TableHeader;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Checkbox, 'Checkbox', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableHeader.js');

  __REACT_HOT_LOADER__.register(TableHeader, 'TableHeader', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableHeader.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableHeader.js');
}();

;
},{"./Const":33,"./SelectRowHeaderColumn":38,"classnames":1,"react":"react","react-dom":"react-dom"}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _Date = require('./filters/Date');

var _Date2 = _interopRequireDefault(_Date);

var _Text = require('./filters/Text');

var _Text2 = _interopRequireDefault(_Text);

var _Regex = require('./filters/Regex');

var _Regex2 = _interopRequireDefault(_Regex);

var _Select = require('./filters/Select');

var _Select2 = _interopRequireDefault(_Select);

var _Number = require('./filters/Number');

var _Number2 = _interopRequireDefault(_Number);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint default-case: 0 */
/* eslint guard-for-in: 0 */


var TableHeaderColumn = function (_Component) {
  _inherits(TableHeaderColumn, _Component);

  function TableHeaderColumn(props) {
    _classCallCheck(this, TableHeaderColumn);

    var _this = _possibleConstructorReturn(this, (TableHeaderColumn.__proto__ || Object.getPrototypeOf(TableHeaderColumn)).call(this, props));

    _this.handleColumnClick = function () {
      return _this.__handleColumnClick__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleFilter = _this.handleFilter.bind(_this);
    return _this;
  }

  _createClass(TableHeaderColumn, [{
    key: '__handleColumnClick__REACT_HOT_LOADER__',
    value: function __handleColumnClick__REACT_HOT_LOADER__() {
      if (!this.props.dataSort) return;
      var order = this.props.sort === _Const2.default.SORT_DESC ? _Const2.default.SORT_ASC : _Const2.default.SORT_DESC;
      this.props.onSort(order, this.props.dataField);
    }
  }, {
    key: 'handleFilter',
    value: function handleFilter(value, type) {
      this.props.filter.emitter.handleFilter(this.props.dataField, value, type);
    }
  }, {
    key: 'getFilters',
    value: function getFilters() {
      switch (this.props.filter.type) {
        case _Const2.default.FILTER_TYPE.TEXT:
          {
            return _react2.default.createElement(_Text2.default, _extends({ ref: 'textFilter' }, this.props.filter, {
              columnName: this.props.children, filterHandler: this.handleFilter }));
          }
        case _Const2.default.FILTER_TYPE.REGEX:
          {
            return _react2.default.createElement(_Regex2.default, _extends({ ref: 'regexFilter' }, this.props.filter, {
              columnName: this.props.children, filterHandler: this.handleFilter }));
          }
        case _Const2.default.FILTER_TYPE.SELECT:
          {
            return _react2.default.createElement(_Select2.default, _extends({ ref: 'selectFilter' }, this.props.filter, {
              columnName: this.props.children, filterHandler: this.handleFilter }));
          }
        case _Const2.default.FILTER_TYPE.NUMBER:
          {
            return _react2.default.createElement(_Number2.default, _extends({ ref: 'numberFilter' }, this.props.filter, {
              columnName: this.props.children, filterHandler: this.handleFilter }));
          }
        case _Const2.default.FILTER_TYPE.DATE:
          {
            return _react2.default.createElement(_Date2.default, _extends({ ref: 'dateFilter' }, this.props.filter, {
              columnName: this.props.children, filterHandler: this.handleFilter }));
          }
        case _Const2.default.FILTER_TYPE.CUSTOM:
          {
            var elm = this.props.filter.getElement(this.handleFilter, this.props.filter.customFilterParameters);

            return _react2.default.cloneElement(elm, { ref: 'customFilter' });
          }
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refs['header-col'].setAttribute('data-field', this.props.dataField);
    }
  }, {
    key: 'render',
    value: function render() {
      var defaultCaret = void 0;
      var _props = this.props,
          dataAlign = _props.dataAlign,
          dataField = _props.dataField,
          headerAlign = _props.headerAlign,
          headerTitle = _props.headerTitle,
          hidden = _props.hidden,
          sort = _props.sort,
          dataSort = _props.dataSort,
          sortIndicator = _props.sortIndicator,
          children = _props.children,
          caretRender = _props.caretRender,
          className = _props.className;

      var thStyle = {
        textAlign: headerAlign || dataAlign,
        display: hidden ? 'none' : null
      };
      if (sortIndicator) {
        defaultCaret = !dataSort ? null : _react2.default.createElement(
          'span',
          { className: 'order' },
          _react2.default.createElement(
            'span',
            { className: 'dropdown' },
            _react2.default.createElement('span', { className: 'caret', style: { margin: '10px 0 10px 5px', color: '#ccc' } })
          ),
          _react2.default.createElement(
            'span',
            { className: 'dropup' },
            _react2.default.createElement('span', { className: 'caret', style: { margin: '10px 0', color: '#ccc' } })
          )
        );
      }
      var sortCaret = sort ? _util2.default.renderReactSortCaret(sort) : defaultCaret;
      if (caretRender) {
        sortCaret = caretRender(sort, dataField);
      }
      var classes = (0, _classnames2.default)(typeof className === 'function' ? className() : className, dataSort ? 'sort-column' : '');

      var title = headerTitle && typeof children === 'string' ? { title: children } : null;
      return _react2.default.createElement(
        'th',
        _extends({ ref: 'header-col',
          className: classes,
          style: thStyle,
          onClick: this.handleColumnClick
        }, title),
        children,
        sortCaret,
        _react2.default.createElement(
          'div',
          { onClick: function onClick(e) {
              return e.stopPropagation();
            } },
          this.props.filter ? this.getFilters() : null
        )
      );
    }
  }, {
    key: 'cleanFiltered',
    value: function cleanFiltered() {
      if (this.props.filter === undefined) {
        return;
      }

      switch (this.props.filter.type) {
        case _Const2.default.FILTER_TYPE.TEXT:
          {
            this.refs.textFilter.cleanFiltered();
            break;
          }
        case _Const2.default.FILTER_TYPE.REGEX:
          {
            this.refs.regexFilter.cleanFiltered();
            break;
          }
        case _Const2.default.FILTER_TYPE.SELECT:
          {
            this.refs.selectFilter.cleanFiltered();
            break;
          }
        case _Const2.default.FILTER_TYPE.NUMBER:
          {
            this.refs.numberFilter.cleanFiltered();
            break;
          }
        case _Const2.default.FILTER_TYPE.DATE:
          {
            this.refs.dateFilter.cleanFiltered();
            break;
          }
        case _Const2.default.FILTER_TYPE.CUSTOM:
          {
            this.refs.customFilter.cleanFiltered();
            break;
          }
      }
    }
  }, {
    key: 'applyFilter',
    value: function applyFilter(val) {
      if (this.props.filter === undefined) return;
      switch (this.props.filter.type) {
        case _Const2.default.FILTER_TYPE.TEXT:
          {
            this.refs.textFilter.applyFilter(val);
            break;
          }
        case _Const2.default.FILTER_TYPE.REGEX:
          {
            this.refs.regexFilter.applyFilter(val);
            break;
          }
        case _Const2.default.FILTER_TYPE.SELECT:
          {
            this.refs.selectFilter.applyFilter(val);
            break;
          }
        case _Const2.default.FILTER_TYPE.NUMBER:
          {
            this.refs.numberFilter.applyFilter(val);
            break;
          }
        case _Const2.default.FILTER_TYPE.DATE:
          {
            this.refs.dateFilter.applyFilter(val);
            break;
          }
      }
    }
  }]);

  return TableHeaderColumn;
}(_react.Component);

var filterTypeArray = [];
for (var key in _Const2.default.FILTER_TYPE) {
  filterTypeArray.push(_Const2.default.FILTER_TYPE[key]);
}

TableHeaderColumn.propTypes = {
  dataField: _react.PropTypes.string,
  dataAlign: _react.PropTypes.string,
  headerAlign: _react.PropTypes.string,
  headerTitle: _react.PropTypes.bool,
  dataSort: _react.PropTypes.bool,
  onSort: _react.PropTypes.func,
  dataFormat: _react.PropTypes.func,
  csvFormat: _react.PropTypes.func,
  csvHeader: _react.PropTypes.string,
  isKey: _react.PropTypes.bool,
  editable: _react.PropTypes.any,
  hidden: _react.PropTypes.bool,
  hiddenOnInsert: _react.PropTypes.bool,
  searchable: _react.PropTypes.bool,
  className: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  width: _react.PropTypes.string,
  sortFunc: _react.PropTypes.func,
  sortFuncExtraData: _react.PropTypes.any,
  columnClassName: _react.PropTypes.any,
  columnTitle: _react.PropTypes.bool,
  filterFormatted: _react.PropTypes.bool,
  filterValue: _react.PropTypes.func,
  sort: _react.PropTypes.string,
  caretRender: _react.PropTypes.func,
  formatExtraData: _react.PropTypes.any,
  filter: _react.PropTypes.shape({
    type: _react.PropTypes.oneOf(filterTypeArray),
    delay: _react.PropTypes.number,
    options: _react.PropTypes.oneOfType([_react.PropTypes.object, // for SelectFilter
    _react.PropTypes.arrayOf(_react.PropTypes.number) // for NumberFilter
    ]),
    numberComparators: _react.PropTypes.arrayOf(_react.PropTypes.string),
    emitter: _react.PropTypes.object,
    placeholder: _react.PropTypes.string,
    getElement: _react.PropTypes.func,
    customFilterParameters: _react.PropTypes.object
  }),
  sortIndicator: _react.PropTypes.bool,
  export: _react.PropTypes.bool
};

TableHeaderColumn.defaultProps = {
  dataAlign: 'left',
  headerAlign: undefined,
  headerTitle: true,
  dataSort: false,
  dataFormat: undefined,
  csvFormat: undefined,
  csvHeader: undefined,
  isKey: false,
  editable: true,
  onSort: undefined,
  hidden: false,
  hiddenOnInsert: false,
  searchable: true,
  className: '',
  columnTitle: false,
  width: null,
  sortFunc: undefined,
  columnClassName: '',
  filterFormatted: false,
  filterValue: undefined,
  sort: undefined,
  formatExtraData: undefined,
  sortFuncExtraData: undefined,
  filter: undefined,
  sortIndicator: true
};

var _default = TableHeaderColumn;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TableHeaderColumn, 'TableHeaderColumn', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableHeaderColumn.js');

  __REACT_HOT_LOADER__.register(filterTypeArray, 'filterTypeArray', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableHeaderColumn.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableHeaderColumn.js');
}();

;
},{"./Const":33,"./filters/Date":48,"./filters/Number":49,"./filters/Regex":50,"./filters/Select":51,"./filters/Text":52,"./util":58,"classnames":1,"react":"react"}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableRow = function (_Component) {
  _inherits(TableRow, _Component);

  function TableRow(props) {
    _classCallCheck(this, TableRow);

    var _this = _possibleConstructorReturn(this, (TableRow.__proto__ || Object.getPrototypeOf(TableRow)).call(this, props));

    _this.rowClick = function () {
      return _this.__rowClick__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.rowDoubleClick = function () {
      return _this.__rowDoubleClick__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.rowMouseOut = function () {
      return _this.__rowMouseOut__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.rowMouseOver = function () {
      return _this.__rowMouseOver__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.clickNum = 0;
    return _this;
  }

  _createClass(TableRow, [{
    key: '__rowClick__REACT_HOT_LOADER__',
    value: function __rowClick__REACT_HOT_LOADER__(e) {
      var _this2 = this;

      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'TEXTAREA') {
        (function () {
          var rowIndex = _this2.props.index + 1;
          var _props = _this2.props,
              selectRow = _props.selectRow,
              unselectableRow = _props.unselectableRow,
              isSelected = _props.isSelected,
              onSelectRow = _props.onSelectRow;

          if (selectRow) {
            if (selectRow.clickToSelect && !unselectableRow) {
              onSelectRow(rowIndex, !isSelected, e);
            } else if (selectRow.clickToSelectAndEditCell && !unselectableRow) {
              _this2.clickNum++;
              /** if clickToSelectAndEditCell is enabled,
               *  there should be a delay to prevent a selection changed when
               *  user dblick to edit cell on same row but different cell
              **/
              setTimeout(function () {
                if (_this2.clickNum === 1) {
                  onSelectRow(rowIndex, !isSelected, e);
                }
                _this2.clickNum = 0;
              }, 200);
            }
          }
          if (_this2.props.onRowClick) _this2.props.onRowClick(rowIndex);
        })();
      }
    }
  }, {
    key: '__rowDoubleClick__REACT_HOT_LOADER__',
    value: function __rowDoubleClick__REACT_HOT_LOADER__(e) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'TEXTAREA') {
        var rowIndex = e.currentTarget.rowIndex + 1;
        if (this.props.onRowDoubleClick) {
          this.props.onRowDoubleClick(rowIndex);
        }
      }
    }
  }, {
    key: '__rowMouseOut__REACT_HOT_LOADER__',
    value: function __rowMouseOut__REACT_HOT_LOADER__(e) {
      if (this.props.onRowMouseOut) {
        this.props.onRowMouseOut(e.currentTarget.rowIndex, e);
      }
    }
  }, {
    key: '__rowMouseOver__REACT_HOT_LOADER__',
    value: function __rowMouseOver__REACT_HOT_LOADER__(e) {
      if (this.props.onRowMouseOver) {
        this.props.onRowMouseOver(e.currentTarget.rowIndex, e);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.clickNum = 0;
      var trCss = {
        style: {
          backgroundColor: this.props.isSelected ? this.props.selectRow.bgColor : null
        },
        className: (0, _classnames2.default)(this.props.isSelected ? this.props.selectRow.className : null, this.props.className)
      };

      if (this.props.selectRow && (this.props.selectRow.clickToSelect || this.props.selectRow.clickToSelectAndEditCell) || this.props.onRowClick || this.props.onRowDoubleClick) {
        return _react2.default.createElement(
          'tr',
          _extends({}, trCss, {
            onMouseOver: this.rowMouseOver,
            onMouseOut: this.rowMouseOut,
            onClick: this.rowClick,
            onDoubleClick: this.rowDoubleClick }),
          this.props.children
        );
      } else {
        return _react2.default.createElement(
          'tr',
          trCss,
          this.props.children
        );
      }
    }
  }]);

  return TableRow;
}(_react.Component);

TableRow.propTypes = {
  index: _react.PropTypes.number,
  isSelected: _react.PropTypes.bool,
  enableCellEdit: _react.PropTypes.bool,
  onRowClick: _react.PropTypes.func,
  onRowDoubleClick: _react.PropTypes.func,
  onSelectRow: _react.PropTypes.func,
  onRowMouseOut: _react.PropTypes.func,
  onRowMouseOver: _react.PropTypes.func,
  unselectableRow: _react.PropTypes.bool
};
TableRow.defaultProps = {
  onRowClick: undefined,
  onRowDoubleClick: undefined
};
var _default = TableRow;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TableRow, 'TableRow', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableRow.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/TableRow.js');
}();

;
},{"classnames":1,"react":"react"}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_util2.default.canUseDOM()) {
  var filesaver = require('./filesaver');
  var saveAs = filesaver.saveAs;
} /* eslint block-scoped-var: 0 */
/* eslint vars-on-top: 0 */
/* eslint no-var: 0 */
/* eslint no-unused-vars: 0 */


function toString(data, keys) {
  var dataString = '';
  if (data.length === 0) return dataString;

  dataString += keys.map(function (x) {
    return x.header;
  }).join(',') + '\n';

  data.map(function (row) {
    keys.map(function (col, i) {
      var field = col.field,
          format = col.format;

      var value = typeof format !== 'undefined' ? format(row[field], row) : row[field];
      var cell = typeof value !== 'undefined' ? '"' + value + '"' : '';
      dataString += cell;
      if (i + 1 < keys.length) dataString += ',';
    });

    dataString += '\n';
  });

  return dataString;
}

var exportCSV = function exportCSV(data, keys, filename) {
  var dataString = toString(data, keys);
  if (typeof window !== 'undefined') {
    saveAs(new Blob([dataString], { type: 'text/plain;charset=utf-8' }), filename, true);
  }
};

var _default = exportCSV;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(saveAs, 'saveAs', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/csv_export_util.js');

  __REACT_HOT_LOADER__.register(toString, 'toString', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/csv_export_util.js');

  __REACT_HOT_LOADER__.register(exportCSV, 'exportCSV', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/csv_export_util.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/csv_export_util.js');
}();

;
},{"./filesaver":47,"./util":58}],47:[function(require,module,exports){
"use strict";

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.1.20151003
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || function (view) {
	"use strict";
	// IE <10 is explicitly unsupported

	if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var doc = view.document
	// only get URL when necessary in case Blob.js hasn't overridden it yet
	,
	    get_URL = function get_URL() {
		return view.URL || view.webkitURL || view;
	},
	    save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
	    can_use_save_link = "download" in save_link,
	    click = function click(node) {
		var event = new MouseEvent("click");
		node.dispatchEvent(event);
	},
	    is_safari = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent),
	    webkit_req_fs = view.webkitRequestFileSystem,
	    req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem,
	    throw_outside = function throw_outside(ex) {
		(view.setImmediate || view.setTimeout)(function () {
			throw ex;
		}, 0);
	},
	    force_saveable_type = "application/octet-stream",
	    fs_min_size = 0
	// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
	// https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
	// for the reasoning behind the timeout and revocation flow
	,
	    arbitrary_revoke_timeout = 500 // in ms
	,
	    revoke = function revoke(file) {
		var revoker = function revoker() {
			if (typeof file === "string") {
				// file is an object URL
				get_URL().revokeObjectURL(file);
			} else {
				// file is a File
				file.remove();
			}
		};
		if (view.chrome) {
			revoker();
		} else {
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
	},
	    dispatch = function dispatch(filesaver, event_types, event) {
		event_types = [].concat(event_types);
		var i = event_types.length;
		while (i--) {
			var listener = filesaver["on" + event_types[i]];
			if (typeof listener === "function") {
				try {
					listener.call(filesaver, event || filesaver);
				} catch (ex) {
					throw_outside(ex);
				}
			}
		}
	},
	    auto_bom = function auto_bom(blob) {
		// prepend BOM for UTF-8 XML and text/* types (including HTML)
		if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
			return new Blob(["\uFEFF", blob], { type: blob.type });
		}
		return blob;
	},
	    FileSaver = function FileSaver(blob, name, no_auto_bom) {
		if (!no_auto_bom) {
			blob = auto_bom(blob);
		}
		// First try a.download, then web filesystem, then object URLs
		var filesaver = this,
		    type = blob.type,
		    blob_changed = false,
		    object_url,
		    target_view,
		    dispatch_all = function dispatch_all() {
			dispatch(filesaver, "writestart progress write writeend".split(" "));
		}
		// on any filesys errors revert to saving with object URLs
		,
		    fs_error = function fs_error() {
			if (target_view && is_safari && typeof FileReader !== "undefined") {
				// Safari doesn't allow downloading of blob urls
				var reader = new FileReader();
				reader.onloadend = function () {
					var base64Data = reader.result;
					target_view.location.href = "data:attachment/file" + base64Data.slice(base64Data.search(/[,;]/));
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
				};
				reader.readAsDataURL(blob);
				filesaver.readyState = filesaver.INIT;
				return;
			}
			// don't create more object URLs than needed
			if (blob_changed || !object_url) {
				object_url = get_URL().createObjectURL(blob);
			}
			if (target_view) {
				target_view.location.href = object_url;
			} else {
				var new_tab = view.open(object_url, "_blank");
				if (new_tab == undefined && is_safari) {
					//Apple do not allow window.open, see http://bit.ly/1kZffRI
					view.location.href = object_url;
				}
			}
			filesaver.readyState = filesaver.DONE;
			dispatch_all();
			revoke(object_url);
		},
		    abortable = function abortable(func) {
			return function () {
				if (filesaver.readyState !== filesaver.DONE) {
					return func.apply(this, arguments);
				}
			};
		},
		    create_if_not_found = { create: true, exclusive: false },
		    slice;
		filesaver.readyState = filesaver.INIT;
		if (!name) {
			name = "download";
		}
		if (can_use_save_link) {
			object_url = get_URL().createObjectURL(blob);
			save_link.href = object_url;
			save_link.download = name;
			setTimeout(function () {
				click(save_link);
				dispatch_all();
				revoke(object_url);
				filesaver.readyState = filesaver.DONE;
			});
			return;
		}
		// Object and web filesystem URLs have a problem saving in Google Chrome when
		// viewed in a tab, so I force save with application/octet-stream
		// http://code.google.com/p/chromium/issues/detail?id=91158
		// Update: Google errantly closed 91158, I submitted it again:
		// https://code.google.com/p/chromium/issues/detail?id=389642
		if (view.chrome && type && type !== force_saveable_type) {
			slice = blob.slice || blob.webkitSlice;
			blob = slice.call(blob, 0, blob.size, force_saveable_type);
			blob_changed = true;
		}
		// Since I can't be sure that the guessed media type will trigger a download
		// in WebKit, I append .download to the filename.
		// https://bugs.webkit.org/show_bug.cgi?id=65440
		if (webkit_req_fs && name !== "download") {
			name += ".download";
		}
		if (type === force_saveable_type || webkit_req_fs) {
			target_view = view;
		}
		if (!req_fs) {
			fs_error();
			return;
		}
		fs_min_size += blob.size;
		req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
			fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
				var save = function save() {
					dir.getFile(name, create_if_not_found, abortable(function (file) {
						file.createWriter(abortable(function (writer) {
							writer.onwriteend = function (event) {
								target_view.location.href = file.toURL();
								filesaver.readyState = filesaver.DONE;
								dispatch(filesaver, "writeend", event);
								revoke(file);
							};
							writer.onerror = function () {
								var error = writer.error;
								if (error.code !== error.ABORT_ERR) {
									fs_error();
								}
							};
							"writestart progress write abort".split(" ").forEach(function (event) {
								writer["on" + event] = filesaver["on" + event];
							});
							writer.write(blob);
							filesaver.abort = function () {
								writer.abort();
								filesaver.readyState = filesaver.DONE;
							};
							filesaver.readyState = filesaver.WRITING;
						}), fs_error);
					}), fs_error);
				};
				dir.getFile(name, { create: false }, abortable(function (file) {
					// delete file if it already exists
					file.remove();
					save();
				}), abortable(function (ex) {
					if (ex.code === ex.NOT_FOUND_ERR) {
						save();
					} else {
						fs_error();
					}
				}));
			}), fs_error);
		}), fs_error);
	},
	    FS_proto = FileSaver.prototype,
	    saveAs = function saveAs(blob, name, no_auto_bom) {
		return new FileSaver(blob, name, no_auto_bom);
	};
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function (blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name || "download");
		};
	}

	FS_proto.abort = function () {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;

	return saveAs;
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || undefined.content);
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
	module.exports.saveAs = saveAs;
} else if (typeof define !== "undefined" && define !== null && define.amd != null) {
	define([], function () {
		return saveAs;
	});
}
;

var _temp = function () {
	if (typeof __REACT_HOT_LOADER__ === 'undefined') {
		return;
	}

	__REACT_HOT_LOADER__.register(saveAs, "saveAs", "/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filesaver.js");
}();

;
},{}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Const = require('../Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint quotes: 0 */
/* eslint max-len: 0 */


var legalComparators = ['=', '>', '>=', '<', '<=', '!='];

function dateParser(d) {
  return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
}

var DateFilter = function (_Component) {
  _inherits(DateFilter, _Component);

  function DateFilter(props) {
    _classCallCheck(this, DateFilter);

    var _this = _possibleConstructorReturn(this, (DateFilter.__proto__ || Object.getPrototypeOf(DateFilter)).call(this, props));

    _this.dateComparators = _this.props.dateComparators || legalComparators;
    _this.filter = _this.filter.bind(_this);
    _this.onChangeComparator = _this.onChangeComparator.bind(_this);
    return _this;
  }

  _createClass(DateFilter, [{
    key: 'setDefaultDate',
    value: function setDefaultDate() {
      var defaultDate = '';
      var defaultValue = this.props.defaultValue;

      if (defaultValue && defaultValue.date) {
        // Set the appropriate format for the input type=date, i.e. "YYYY-MM-DD"
        defaultDate = dateParser(new Date(defaultValue.date));
      }
      return defaultDate;
    }
  }, {
    key: 'onChangeComparator',
    value: function onChangeComparator(event) {
      var date = this.refs.inputDate.value;
      var comparator = event.target.value;
      if (date === '') {
        return;
      }
      date = new Date(date);
      this.props.filterHandler({ date: date, comparator: comparator }, _Const2.default.FILTER_TYPE.DATE);
    }
  }, {
    key: 'getComparatorOptions',
    value: function getComparatorOptions() {
      var optionTags = [];
      optionTags.push(_react2.default.createElement('option', { key: '-1' }));
      for (var i = 0; i < this.dateComparators.length; i++) {
        optionTags.push(_react2.default.createElement(
          'option',
          { key: i, value: this.dateComparators[i] },
          this.dateComparators[i]
        ));
      }
      return optionTags;
    }
  }, {
    key: 'filter',
    value: function filter(event) {
      var comparator = this.refs.dateFilterComparator.value;
      var dateValue = event.target.value;
      if (dateValue) {
        this.props.filterHandler({ date: new Date(dateValue), comparator: comparator }, _Const2.default.FILTER_TYPE.DATE);
      } else {
        this.props.filterHandler(null, _Const2.default.FILTER_TYPE.DATE);
      }
    }
  }, {
    key: 'cleanFiltered',
    value: function cleanFiltered() {
      var value = this.setDefaultDate();
      var comparator = this.props.defaultValue ? this.props.defaultValue.comparator : '';
      this.setState({ isPlaceholderSelected: value === '' });
      this.refs.dateFilterComparator.value = comparator;
      this.refs.inputDate.value = value;
      this.props.filterHandler({ date: new Date(value), comparator: comparator }, _Const2.default.FILTER_TYPE.DATE);
    }
  }, {
    key: 'applyFilter',
    value: function applyFilter(filterDateObj) {
      var date = filterDateObj.date,
          comparator = filterDateObj.comparator;

      this.setState({ isPlaceholderSelected: date === '' });
      this.refs.dateFilterComparator.value = comparator;
      this.refs.inputDate.value = dateParser(date);
      this.props.filterHandler({ date: date, comparator: comparator }, _Const2.default.FILTER_TYPE.DATE);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var comparator = this.refs.dateFilterComparator.value;
      var dateValue = this.refs.inputDate.value;
      if (comparator && dateValue) {
        this.props.filterHandler({ date: new Date(dateValue), comparator: comparator }, _Const2.default.FILTER_TYPE.DATE);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var defaultValue = this.props.defaultValue;

      return _react2.default.createElement(
        'div',
        { className: 'filter date-filter' },
        _react2.default.createElement(
          'select',
          { ref: 'dateFilterComparator',
            className: 'date-filter-comparator form-control',
            onChange: this.onChangeComparator,
            defaultValue: defaultValue ? defaultValue.comparator : '' },
          this.getComparatorOptions()
        ),
        _react2.default.createElement('input', { ref: 'inputDate',
          className: 'filter date-filter-input form-control',
          type: 'date',
          onChange: this.filter,
          defaultValue: this.setDefaultDate() })
      );
    }
  }]);

  return DateFilter;
}(_react.Component);

DateFilter.propTypes = {
  filterHandler: _react.PropTypes.func.isRequired,
  defaultValue: _react.PropTypes.shape({
    date: _react.PropTypes.object,
    comparator: _react.PropTypes.oneOf(legalComparators)
  }),
  /* eslint consistent-return: 0 */
  dateComparators: function dateComparators(props, propName) {
    if (!props[propName]) {
      return;
    }
    for (var i = 0; i < props[propName].length; i++) {
      var comparatorIsValid = false;
      for (var j = 0; j < legalComparators.length; j++) {
        if (legalComparators[j] === props[propName][i]) {
          comparatorIsValid = true;
          break;
        }
      }
      if (!comparatorIsValid) {
        return new Error('Date comparator provided is not supported.\n          Use only ' + legalComparators);
      }
    }
  },
  columnName: _react.PropTypes.string
};

var _default = DateFilter;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(legalComparators, 'legalComparators', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Date.js');

  __REACT_HOT_LOADER__.register(dateParser, 'dateParser', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Date.js');

  __REACT_HOT_LOADER__.register(DateFilter, 'DateFilter', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Date.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Date.js');
}();

;
},{"../Const":33,"react":"react"}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Const = require('../Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var legalComparators = ['=', '>', '>=', '<', '<=', '!='];

var NumberFilter = function (_Component) {
  _inherits(NumberFilter, _Component);

  function NumberFilter(props) {
    _classCallCheck(this, NumberFilter);

    var _this = _possibleConstructorReturn(this, (NumberFilter.__proto__ || Object.getPrototypeOf(NumberFilter)).call(this, props));

    _this.numberComparators = _this.props.numberComparators || legalComparators;
    _this.timeout = null;
    _this.state = {
      isPlaceholderSelected: _this.props.defaultValue === undefined || _this.props.defaultValue.number === undefined || _this.props.options && _this.props.options.indexOf(_this.props.defaultValue.number) === -1
    };
    _this.onChangeNumber = _this.onChangeNumber.bind(_this);
    _this.onChangeNumberSet = _this.onChangeNumberSet.bind(_this);
    _this.onChangeComparator = _this.onChangeComparator.bind(_this);
    return _this;
  }

  _createClass(NumberFilter, [{
    key: 'onChangeNumber',
    value: function onChangeNumber(event) {
      var _this2 = this;

      var comparator = this.refs.numberFilterComparator.value;
      if (comparator === '') {
        return;
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      var filterValue = event.target.value;
      this.timeout = setTimeout(function () {
        _this2.props.filterHandler({ number: filterValue, comparator: comparator }, _Const2.default.FILTER_TYPE.NUMBER);
      }, this.props.delay);
    }
  }, {
    key: 'onChangeNumberSet',
    value: function onChangeNumberSet(event) {
      var comparator = this.refs.numberFilterComparator.value;
      var value = event.target.value;

      this.setState({ isPlaceholderSelected: value === '' });
      if (comparator === '') {
        return;
      }
      this.props.filterHandler({ number: value, comparator: comparator }, _Const2.default.FILTER_TYPE.NUMBER);
    }
  }, {
    key: 'onChangeComparator',
    value: function onChangeComparator(event) {
      var value = this.refs.numberFilter.value;
      var comparator = event.target.value;
      if (value === '') {
        return;
      }
      this.props.filterHandler({ number: value, comparator: comparator }, _Const2.default.FILTER_TYPE.NUMBER);
    }
  }, {
    key: 'cleanFiltered',
    value: function cleanFiltered() {
      var value = this.props.defaultValue ? this.props.defaultValue.number : '';
      var comparator = this.props.defaultValue ? this.props.defaultValue.comparator : '';
      this.setState({ isPlaceholderSelected: value === '' });
      this.refs.numberFilterComparator.value = comparator;
      this.refs.numberFilter.value = value;
      this.props.filterHandler({ number: value, comparator: comparator }, _Const2.default.FILTER_TYPE.NUMBER);
    }
  }, {
    key: 'applyFilter',
    value: function applyFilter(filterObj) {
      var number = filterObj.number,
          comparator = filterObj.comparator;

      this.setState({ isPlaceholderSelected: number === '' });
      this.refs.numberFilterComparator.value = comparator;
      this.refs.numberFilter.value = number;
      this.props.filterHandler({ number: number, comparator: comparator }, _Const2.default.FILTER_TYPE.NUMBER);
    }
  }, {
    key: 'getComparatorOptions',
    value: function getComparatorOptions() {
      var optionTags = [];
      optionTags.push(_react2.default.createElement('option', { key: '-1' }));
      for (var i = 0; i < this.numberComparators.length; i++) {
        optionTags.push(_react2.default.createElement(
          'option',
          { key: i, value: this.numberComparators[i] },
          this.numberComparators[i]
        ));
      }
      return optionTags;
    }
  }, {
    key: 'getNumberOptions',
    value: function getNumberOptions() {
      var optionTags = [];
      var options = this.props.options;


      optionTags.push(_react2.default.createElement(
        'option',
        { key: '-1', value: '' },
        this.props.placeholder || 'Select ' + this.props.columnName + '...'
      ));
      for (var i = 0; i < options.length; i++) {
        optionTags.push(_react2.default.createElement(
          'option',
          { key: i, value: options[i] },
          options[i]
        ));
      }
      return optionTags;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var comparator = this.refs.numberFilterComparator.value;
      var number = this.refs.numberFilter.value;
      if (comparator && number) {
        this.props.filterHandler({ number: number, comparator: comparator }, _Const2.default.FILTER_TYPE.NUMBER);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.timeout);
    }
  }, {
    key: 'render',
    value: function render() {
      var selectClass = (0, _classnames2.default)('select-filter', 'number-filter-input', 'form-control', { 'placeholder-selected': this.state.isPlaceholderSelected });

      return _react2.default.createElement(
        'div',
        { className: 'filter number-filter' },
        _react2.default.createElement(
          'select',
          { ref: 'numberFilterComparator',
            className: 'number-filter-comparator form-control',
            onChange: this.onChangeComparator,
            defaultValue: this.props.defaultValue ? this.props.defaultValue.comparator : '' },
          this.getComparatorOptions()
        ),
        this.props.options ? _react2.default.createElement(
          'select',
          { ref: 'numberFilter',
            className: selectClass,
            onChange: this.onChangeNumberSet,
            defaultValue: this.props.defaultValue ? this.props.defaultValue.number : '' },
          this.getNumberOptions()
        ) : _react2.default.createElement('input', { ref: 'numberFilter',
          type: 'number',
          className: 'number-filter-input form-control',
          placeholder: this.props.placeholder || 'Enter ' + this.props.columnName + '...',
          onChange: this.onChangeNumber,
          defaultValue: this.props.defaultValue ? this.props.defaultValue.number : '' })
      );
    }
  }]);

  return NumberFilter;
}(_react.Component);

NumberFilter.propTypes = {
  filterHandler: _react.PropTypes.func.isRequired,
  options: _react.PropTypes.arrayOf(_react.PropTypes.number),
  defaultValue: _react.PropTypes.shape({
    number: _react.PropTypes.number,
    comparator: _react.PropTypes.oneOf(legalComparators)
  }),
  delay: _react.PropTypes.number,
  /* eslint consistent-return: 0 */
  numberComparators: function numberComparators(props, propName) {
    if (!props[propName]) {
      return;
    }
    for (var i = 0; i < props[propName].length; i++) {
      var comparatorIsValid = false;
      for (var j = 0; j < legalComparators.length; j++) {
        if (legalComparators[j] === props[propName][i]) {
          comparatorIsValid = true;
          break;
        }
      }
      if (!comparatorIsValid) {
        return new Error('Number comparator provided is not supported.\n          Use only ' + legalComparators);
      }
    }
  },
  placeholder: _react.PropTypes.string,
  columnName: _react.PropTypes.string
};

NumberFilter.defaultProps = {
  delay: _Const2.default.FILTER_DELAY
};

var _default = NumberFilter;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(legalComparators, 'legalComparators', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Number.js');

  __REACT_HOT_LOADER__.register(NumberFilter, 'NumberFilter', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Number.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Number.js');
}();

;
},{"../Const":33,"classnames":1,"react":"react"}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Const = require('../Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RegexFilter = function (_Component) {
  _inherits(RegexFilter, _Component);

  function RegexFilter(props) {
    _classCallCheck(this, RegexFilter);

    var _this = _possibleConstructorReturn(this, (RegexFilter.__proto__ || Object.getPrototypeOf(RegexFilter)).call(this, props));

    _this.filter = _this.filter.bind(_this);
    _this.timeout = null;
    return _this;
  }

  _createClass(RegexFilter, [{
    key: 'filter',
    value: function filter(event) {
      var _this2 = this;

      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      var filterValue = event.target.value;
      this.timeout = setTimeout(function () {
        _this2.props.filterHandler(filterValue, _Const2.default.FILTER_TYPE.REGEX);
      }, this.props.delay);
    }
  }, {
    key: 'cleanFiltered',
    value: function cleanFiltered() {
      var value = this.props.defaultValue ? this.props.defaultValue : '';
      this.refs.inputText.value = value;
      this.props.filterHandler(value, _Const2.default.FILTER_TYPE.TEXT);
    }
  }, {
    key: 'applyFilter',
    value: function applyFilter(filterRegx) {
      this.refs.inputText.value = filterRegx;
      this.props.filterHandler(filterRegx, _Const2.default.FILTER_TYPE.REGEX);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var value = this.refs.inputText.value;
      if (value) {
        this.props.filterHandler(value, _Const2.default.FILTER_TYPE.REGEX);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.timeout);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          defaultValue = _props.defaultValue,
          placeholder = _props.placeholder,
          columnName = _props.columnName;

      return _react2.default.createElement('input', { ref: 'inputText',
        className: 'filter text-filter form-control',
        type: 'text',
        onChange: this.filter,
        placeholder: placeholder || 'Enter Regex for ' + columnName + '...',
        defaultValue: defaultValue ? defaultValue : '' });
    }
  }]);

  return RegexFilter;
}(_react.Component);

RegexFilter.propTypes = {
  filterHandler: _react.PropTypes.func.isRequired,
  defaultValue: _react.PropTypes.string,
  delay: _react.PropTypes.number,
  placeholder: _react.PropTypes.string,
  columnName: _react.PropTypes.string
};

RegexFilter.defaultProps = {
  delay: _Const2.default.FILTER_DELAY
};

var _default = RegexFilter;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(RegexFilter, 'RegexFilter', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Regex.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Regex.js');
}();

;
},{"../Const":33,"react":"react"}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Const = require('../Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectFilter = function (_Component) {
  _inherits(SelectFilter, _Component);

  function SelectFilter(props) {
    _classCallCheck(this, SelectFilter);

    var _this = _possibleConstructorReturn(this, (SelectFilter.__proto__ || Object.getPrototypeOf(SelectFilter)).call(this, props));

    _this.filter = _this.filter.bind(_this);
    _this.state = {
      isPlaceholderSelected: _this.props.defaultValue === undefined || !_this.props.options.hasOwnProperty(_this.props.defaultValue)
    };
    return _this;
  }

  _createClass(SelectFilter, [{
    key: 'filter',
    value: function filter(event) {
      var value = event.target.value;

      this.setState({ isPlaceholderSelected: value === '' });
      this.props.filterHandler(value, _Const2.default.FILTER_TYPE.SELECT);
    }
  }, {
    key: 'cleanFiltered',
    value: function cleanFiltered() {
      var value = this.props.defaultValue !== undefined ? this.props.defaultValue : '';
      this.setState({ isPlaceholderSelected: value === '' });
      this.refs.selectInput.value = value;
      this.props.filterHandler(value, _Const2.default.FILTER_TYPE.SELECT);
    }
  }, {
    key: 'applyFilter',
    value: function applyFilter(filterOption) {
      filterOption = filterOption + '';
      this.setState({ isPlaceholderSelected: filterOption === '' });
      this.refs.selectInput.value = filterOption;
      this.props.filterHandler(filterOption, _Const2.default.FILTER_TYPE.SELECT);
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      var optionTags = [];
      var _props = this.props,
          options = _props.options,
          placeholder = _props.placeholder,
          columnName = _props.columnName,
          selectText = _props.selectText;

      var selectTextValue = selectText !== undefined ? selectText : 'Select';
      optionTags.push(_react2.default.createElement(
        'option',
        { key: '-1', value: '' },
        placeholder || selectTextValue + ' ' + columnName + '...'
      ));
      Object.keys(options).map(function (key) {
        optionTags.push(_react2.default.createElement(
          'option',
          { key: key, value: key },
          options[key] + ''
        ));
      });
      return optionTags;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var value = this.refs.selectInput.value;
      if (value) {
        this.props.filterHandler(value, _Const2.default.FILTER_TYPE.SELECT);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var selectClass = (0, _classnames2.default)('filter', 'select-filter', 'form-control', { 'placeholder-selected': this.state.isPlaceholderSelected });

      return _react2.default.createElement(
        'select',
        { ref: 'selectInput',
          className: selectClass,
          onChange: this.filter,
          defaultValue: this.props.defaultValue !== undefined ? this.props.defaultValue : '' },
        this.getOptions()
      );
    }
  }]);

  return SelectFilter;
}(_react.Component);

SelectFilter.propTypes = {
  filterHandler: _react.PropTypes.func.isRequired,
  options: _react.PropTypes.object.isRequired,
  placeholder: _react.PropTypes.string,
  columnName: _react.PropTypes.string
};

var _default = SelectFilter;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(SelectFilter, 'SelectFilter', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Select.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Select.js');
}();

;
},{"../Const":33,"classnames":1,"react":"react"}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Const = require('../Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextFilter = function (_Component) {
  _inherits(TextFilter, _Component);

  function TextFilter(props) {
    _classCallCheck(this, TextFilter);

    var _this = _possibleConstructorReturn(this, (TextFilter.__proto__ || Object.getPrototypeOf(TextFilter)).call(this, props));

    _this.filter = _this.filter.bind(_this);
    _this.timeout = null;
    return _this;
  }

  _createClass(TextFilter, [{
    key: 'filter',
    value: function filter(event) {
      var _this2 = this;

      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      var filterValue = event.target.value;
      this.timeout = setTimeout(function () {
        _this2.props.filterHandler(filterValue, _Const2.default.FILTER_TYPE.TEXT);
      }, this.props.delay);
    }
  }, {
    key: 'cleanFiltered',
    value: function cleanFiltered() {
      var value = this.props.defaultValue ? this.props.defaultValue : '';
      this.refs.inputText.value = value;
      this.props.filterHandler(value, _Const2.default.FILTER_TYPE.TEXT);
    }
  }, {
    key: 'applyFilter',
    value: function applyFilter(filterText) {
      this.refs.inputText.value = filterText;
      this.props.filterHandler(filterText, _Const2.default.FILTER_TYPE.TEXT);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var defaultValue = this.refs.inputText.value;
      if (defaultValue) {
        this.props.filterHandler(defaultValue, _Const2.default.FILTER_TYPE.TEXT);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.timeout);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          placeholder = _props.placeholder,
          columnName = _props.columnName,
          defaultValue = _props.defaultValue;

      return _react2.default.createElement('input', { ref: 'inputText',
        className: 'filter text-filter form-control',
        type: 'text',
        onChange: this.filter,
        placeholder: placeholder || 'Enter ' + columnName + '...',
        defaultValue: defaultValue ? defaultValue : '' });
    }
  }]);

  return TextFilter;
}(_react.Component);

TextFilter.propTypes = {
  filterHandler: _react.PropTypes.func.isRequired,
  defaultValue: _react.PropTypes.string,
  delay: _react.PropTypes.number,
  placeholder: _react.PropTypes.string,
  columnName: _react.PropTypes.string
};

TextFilter.defaultProps = {
  delay: _Const2.default.FILTER_DELAY
};

var _default = TextFilter;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TextFilter, 'TextFilter', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Text.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/filters/Text.js');
}();

;
},{"../Const":33,"react":"react"}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableHeaderColumn = exports.BootstrapTable = undefined;

var _BootstrapTable = require('./BootstrapTable');

var _BootstrapTable2 = _interopRequireDefault(_BootstrapTable);

var _TableHeaderColumn = require('./TableHeaderColumn');

var _TableHeaderColumn2 = _interopRequireDefault(_TableHeaderColumn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof window !== 'undefined') {
  window.BootstrapTable = _BootstrapTable2.default;
  window.TableHeaderColumn = _TableHeaderColumn2.default;
}
exports.BootstrapTable = _BootstrapTable2.default;
exports.TableHeaderColumn = _TableHeaderColumn2.default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
}();

;
},{"./BootstrapTable":32,"./TableHeaderColumn":44}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PageButton = function (_Component) {
  _inherits(PageButton, _Component);

  function PageButton(props) {
    _classCallCheck(this, PageButton);

    var _this = _possibleConstructorReturn(this, (PageButton.__proto__ || Object.getPrototypeOf(PageButton)).call(this, props));

    _this.pageBtnClick = function () {
      return _this.__pageBtnClick__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    return _this;
  }

  _createClass(PageButton, [{
    key: '__pageBtnClick__REACT_HOT_LOADER__',
    value: function __pageBtnClick__REACT_HOT_LOADER__(e) {
      e.preventDefault();
      this.props.changePage(e.currentTarget.textContent);
    }
  }, {
    key: 'render',
    value: function render() {
      var classes = (0, _classnames2.default)({
        'active': this.props.active,
        'disabled': this.props.disable,
        'hidden': this.props.hidden,
        'page-item': true
      });
      return _react2.default.createElement(
        'li',
        { className: classes },
        _react2.default.createElement(
          'a',
          { href: '#', onClick: this.pageBtnClick, className: 'page-link' },
          this.props.children
        )
      );
    }
  }]);

  return PageButton;
}(_react.Component);

PageButton.propTypes = {
  changePage: _react.PropTypes.func,
  active: _react.PropTypes.bool,
  disable: _react.PropTypes.bool,
  hidden: _react.PropTypes.bool,
  children: _react.PropTypes.node
};

var _default = PageButton;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(PageButton, 'PageButton', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/pagination/PageButton.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/pagination/PageButton.js');
}();

;
},{"classnames":1,"react":"react"}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PageButton = require('./PageButton.js');

var _PageButton2 = _interopRequireDefault(_PageButton);

var _Const = require('../Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PaginationList = function (_Component) {
  _inherits(PaginationList, _Component);

  function PaginationList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PaginationList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PaginationList.__proto__ || Object.getPrototypeOf(PaginationList)).call.apply(_ref, [this].concat(args))), _this), _this.changePage = function () {
      var _this2;

      return (_this2 = _this).__changePage__REACT_HOT_LOADER__.apply(_this2, arguments);
    }, _this.changeSizePerPage = function () {
      var _this3;

      return (_this3 = _this).__changeSizePerPage__REACT_HOT_LOADER__.apply(_this3, arguments);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PaginationList, [{
    key: '__changePage__REACT_HOT_LOADER__',
    value: function __changePage__REACT_HOT_LOADER__(page) {
      var _props = this.props,
          pageStartIndex = _props.pageStartIndex,
          prePage = _props.prePage,
          currPage = _props.currPage,
          nextPage = _props.nextPage,
          lastPage = _props.lastPage,
          firstPage = _props.firstPage,
          sizePerPage = _props.sizePerPage;


      if (page === prePage) {
        page = currPage - 1 < pageStartIndex ? pageStartIndex : currPage - 1;
      } else if (page === nextPage) {
        page = currPage + 1 > this.lastPage ? this.lastPage : currPage + 1;
      } else if (page === lastPage) {
        page = this.lastPage;
      } else if (page === firstPage) {
        page = pageStartIndex;
      } else {
        page = parseInt(page, 10);
      }

      if (page !== currPage) {
        this.props.changePage(page, sizePerPage);
      }
    }
  }, {
    key: '__changeSizePerPage__REACT_HOT_LOADER__',
    value: function __changeSizePerPage__REACT_HOT_LOADER__(e) {
      e.preventDefault();

      var selectSize = parseInt(e.currentTarget.getAttribute('data-page'), 10);
      var currPage = this.props.currPage;

      if (selectSize !== this.props.sizePerPage) {
        this.totalPages = Math.ceil(this.props.dataSize / selectSize);
        this.lastPage = this.props.pageStartIndex + this.totalPages - 1;
        if (currPage > this.lastPage) currPage = this.lastPage;
        this.props.changePage(currPage, selectSize);
        if (this.props.onSizePerPageList) {
          this.props.onSizePerPageList(selectSize);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props2 = this.props,
          currPage = _props2.currPage,
          dataSize = _props2.dataSize,
          sizePerPage = _props2.sizePerPage,
          sizePerPageList = _props2.sizePerPageList,
          paginationShowsTotal = _props2.paginationShowsTotal,
          pageStartIndex = _props2.pageStartIndex,
          hideSizePerPage = _props2.hideSizePerPage;

      var sizePerPageText = '';
      this.totalPages = Math.ceil(dataSize / sizePerPage);
      this.lastPage = this.props.pageStartIndex + this.totalPages - 1;
      var pageBtns = this.makePage();
      var pageListStyle = {
        float: 'right',
        // override the margin-top defined in .pagination class in bootstrap.
        marginTop: '0px'
      };

      var sizePerPageOptions = sizePerPageList.map(function (_sizePerPage) {
        var pageText = _sizePerPage.text || _sizePerPage;
        var pageNum = _sizePerPage.value || _sizePerPage;
        if (sizePerPage === pageNum) sizePerPageText = pageText;
        return _react2.default.createElement(
          'li',
          { key: pageText, role: 'presentation' },
          _react2.default.createElement(
            'a',
            { role: 'menuitem',
              tabIndex: '-1', href: '#',
              'data-page': pageNum,
              onClick: _this4.changeSizePerPage },
            pageText
          )
        );
      });

      var offset = Math.abs(_Const2.default.PAGE_START_INDEX - pageStartIndex);
      var start = (currPage - pageStartIndex) * sizePerPage;
      start = dataSize === 0 ? 0 : start + 1;
      var to = Math.min(sizePerPage * (currPage + offset) - 1, dataSize);
      if (to >= dataSize) to--;
      var total = paginationShowsTotal ? _react2.default.createElement(
        'span',
        null,
        'Showing rows ',
        start,
        ' to\xA0',
        to + 1,
        ' of\xA0',
        dataSize
      ) : null;

      if (typeof paginationShowsTotal === 'function') {
        total = paginationShowsTotal(start, to + 1, dataSize);
      }

      var dropDownStyle = {
        visibility: hideSizePerPage ? 'hidden' : 'visible'
      };

      return _react2.default.createElement(
        'div',
        { className: 'row', style: { marginTop: 15 } },
        sizePerPageList.length > 1 ? _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { className: 'col-md-6' },
            total,
            ' ',
            _react2.default.createElement(
              'span',
              { className: 'dropdown', style: dropDownStyle },
              _react2.default.createElement(
                'button',
                { className: 'btn btn-default dropdown-toggle',
                  type: 'button', id: 'pageDropDown', 'data-toggle': 'dropdown',
                  'aria-expanded': 'true' },
                sizePerPageText,
                _react2.default.createElement(
                  'span',
                  null,
                  ' ',
                  _react2.default.createElement('span', { className: 'caret' })
                )
              ),
              _react2.default.createElement(
                'ul',
                { className: 'dropdown-menu', role: 'menu', 'aria-labelledby': 'pageDropDown' },
                sizePerPageOptions
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'col-md-6' },
            _react2.default.createElement(
              'ul',
              { className: 'pagination', style: pageListStyle },
              pageBtns
            )
          )
        ) : _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { className: 'col-md-6' },
            total
          ),
          _react2.default.createElement(
            'div',
            { className: 'col-md-6' },
            _react2.default.createElement(
              'ul',
              { className: 'pagination', style: pageListStyle },
              pageBtns
            )
          )
        )
      );
    }
  }, {
    key: 'makePage',
    value: function makePage() {
      var pages = this.getPages();
      return pages.map(function (page) {
        var isActive = page === this.props.currPage;
        var disabled = false;
        var hidden = false;
        if (this.props.currPage === this.props.pageStartIndex && (page === this.props.firstPage || page === this.props.prePage)) {
          disabled = true;
          hidden = true;
        }
        if (this.props.currPage === this.lastPage && (page === this.props.nextPage || page === this.props.lastPage)) {
          disabled = true;
          hidden = true;
        }
        return _react2.default.createElement(
          _PageButton2.default,
          { key: page,
            changePage: this.changePage,
            active: isActive,
            disable: disabled,
            hidden: hidden },
          page
        );
      }, this);
    }
  }, {
    key: 'getPages',
    value: function getPages() {
      var pages = void 0;
      var endPage = this.totalPages;
      if (endPage <= 0) return [];
      var startPage = Math.max(this.props.currPage - Math.floor(this.props.paginationSize / 2), this.props.pageStartIndex);
      endPage = startPage + this.props.paginationSize - 1;

      if (endPage > this.lastPage) {
        endPage = this.lastPage;
        startPage = endPage - this.props.paginationSize + 1;
      }

      if (startPage !== this.props.pageStartIndex && this.totalPages > this.props.paginationSize) {
        pages = [this.props.firstPage, this.props.prePage];
      } else if (this.totalPages > 1) {
        pages = [this.props.prePage];
      } else {
        pages = [];
      }

      for (var i = startPage; i <= endPage; i++) {
        if (i >= this.props.pageStartIndex) pages.push(i);
      }

      if (endPage < this.lastPage) {
        pages.push(this.props.nextPage);
        pages.push(this.props.lastPage);
      } else if (endPage === this.lastPage && this.props.currPage !== this.lastPage) {
        pages.push(this.props.nextPage);
      }

      return pages;
    }
  }]);

  return PaginationList;
}(_react.Component);

PaginationList.propTypes = {
  currPage: _react.PropTypes.number,
  sizePerPage: _react.PropTypes.number,
  dataSize: _react.PropTypes.number,
  changePage: _react.PropTypes.func,
  sizePerPageList: _react.PropTypes.array,
  paginationShowsTotal: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func]),
  paginationSize: _react.PropTypes.number,
  remote: _react.PropTypes.bool,
  onSizePerPageList: _react.PropTypes.func,
  prePage: _react.PropTypes.string,
  pageStartIndex: _react.PropTypes.number,
  hideSizePerPage: _react.PropTypes.bool
};

PaginationList.defaultProps = {
  sizePerPage: _Const2.default.SIZE_PER_PAGE,
  pageStartIndex: _Const2.default.PAGE_START_INDEX
};

var _default = PaginationList;
exports.default = _default;
;

var _temp2 = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(PaginationList, 'PaginationList', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/pagination/PaginationList.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/pagination/PaginationList.js');
}();

;
},{"../Const":33,"./PageButton.js":54,"react":"react"}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableDataStore = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint no-nested-ternary: 0 */
/* eslint guard-for-in: 0 */
/* eslint no-console: 0 */
/* eslint eqeqeq: 0 */
/* eslint one-var: 0 */


var _Const = require('../Const');

var _Const2 = _interopRequireDefault(_Const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _sort(arr, sortField, order, sortFunc, sortFuncExtraData) {
  order = order.toLowerCase();
  var isDesc = order === _Const2.default.SORT_DESC;
  arr.sort(function (a, b) {
    if (sortFunc) {
      return sortFunc(a, b, order, sortField, sortFuncExtraData);
    } else {
      var valueA = a[sortField] === null ? '' : a[sortField];
      var valueB = b[sortField] === null ? '' : b[sortField];
      if (isDesc) {
        if (typeof valueB === 'string') {
          return valueB.localeCompare(valueA);
        } else {
          return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
      } else {
        if (typeof valueA === 'string') {
          return valueA.localeCompare(valueB);
        } else {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        }
      }
    }
  });

  return arr;
}

var TableDataStore = function () {
  function TableDataStore(data) {
    _classCallCheck(this, TableDataStore);

    this.data = data;
    this.colInfos = null;
    this.filteredData = null;
    this.isOnFilter = false;
    this.filterObj = null;
    this.searchText = null;
    this.sortObj = null;
    this.pageObj = {};
    this.selected = [];
    this.multiColumnSearch = false;
    this.showOnlySelected = false;
    this.remote = false; // remote data
  }

  _createClass(TableDataStore, [{
    key: 'setProps',
    value: function setProps(props) {
      this.keyField = props.keyField;
      this.enablePagination = props.isPagination;
      this.colInfos = props.colInfos;
      this.remote = props.remote;
      this.multiColumnSearch = props.multiColumnSearch;
    }
  }, {
    key: 'setData',
    value: function setData(data) {
      this.data = data;
      if (this.remote) {
        return;
      }

      this._refresh(true);
    }
  }, {
    key: 'getColInfos',
    value: function getColInfos() {
      return this.colInfos;
    }
  }, {
    key: 'getSortInfo',
    value: function getSortInfo() {
      return this.sortObj;
    }
  }, {
    key: 'setSortInfo',
    value: function setSortInfo(order, sortField) {
      this.sortObj = {
        order: order,
        sortField: sortField
      };
    }
  }, {
    key: 'setSelectedRowKey',
    value: function setSelectedRowKey(selectedRowKeys) {
      this.selected = selectedRowKeys;
    }
  }, {
    key: 'getRowByKey',
    value: function getRowByKey(keys) {
      var _this = this;

      return keys.map(function (key) {
        var result = _this.data.filter(function (d) {
          return d[_this.keyField] === key;
        });
        if (result.length !== 0) return result[0];
      });
    }
  }, {
    key: 'getSelectedRowKeys',
    value: function getSelectedRowKeys() {
      return this.selected;
    }
  }, {
    key: 'getCurrentDisplayData',
    value: function getCurrentDisplayData() {
      if (this.isOnFilter) return this.filteredData;else return this.data;
    }
  }, {
    key: '_refresh',
    value: function _refresh(skipSorting) {
      if (this.isOnFilter) {
        if (this.filterObj !== null) this.filter(this.filterObj);
        if (this.searchText !== null) this.search(this.searchText);
      }
      if (!skipSorting && this.sortObj) {
        this.sort(this.sortObj.order, this.sortObj.sortField);
      }
    }
  }, {
    key: 'ignoreNonSelected',
    value: function ignoreNonSelected() {
      var _this2 = this;

      this.showOnlySelected = !this.showOnlySelected;
      if (this.showOnlySelected) {
        this.isOnFilter = true;
        this.filteredData = this.data.filter(function (row) {
          var result = _this2.selected.find(function (x) {
            return row[_this2.keyField] === x;
          });
          return typeof result !== 'undefined' ? true : false;
        });
      } else {
        this.isOnFilter = false;
      }
    }
  }, {
    key: 'sort',
    value: function sort(order, sortField) {
      this.setSortInfo(order, sortField);

      var currentDisplayData = this.getCurrentDisplayData();
      if (!this.colInfos[sortField]) return this;

      var _colInfos$sortField = this.colInfos[sortField],
          sortFunc = _colInfos$sortField.sortFunc,
          sortFuncExtraData = _colInfos$sortField.sortFuncExtraData;

      currentDisplayData = _sort(currentDisplayData, sortField, order, sortFunc, sortFuncExtraData);

      return this;
    }
  }, {
    key: 'page',
    value: function page(_page, sizePerPage) {
      this.pageObj.end = _page * sizePerPage - 1;
      this.pageObj.start = this.pageObj.end - (sizePerPage - 1);
      return this;
    }
  }, {
    key: 'edit',
    value: function edit(newVal, rowIndex, fieldName) {
      var currentDisplayData = this.getCurrentDisplayData();
      var rowKeyCache = void 0;
      if (!this.enablePagination) {
        currentDisplayData[rowIndex][fieldName] = newVal;
        rowKeyCache = currentDisplayData[rowIndex][this.keyField];
      } else {
        currentDisplayData[this.pageObj.start + rowIndex][fieldName] = newVal;
        rowKeyCache = currentDisplayData[this.pageObj.start + rowIndex][this.keyField];
      }
      if (this.isOnFilter) {
        this.data.forEach(function (row) {
          if (row[this.keyField] === rowKeyCache) {
            row[fieldName] = newVal;
          }
        }, this);
        if (this.filterObj !== null) this.filter(this.filterObj);
        if (this.searchText !== null) this.search(this.searchText);
      }
      return this;
    }
  }, {
    key: 'addAtBegin',
    value: function addAtBegin(newObj) {
      if (!newObj[this.keyField] || newObj[this.keyField].toString() === '') {
        throw new Error(this.keyField + ' can\'t be empty value.');
      }
      var currentDisplayData = this.getCurrentDisplayData();
      currentDisplayData.forEach(function (row) {
        if (row[this.keyField].toString() === newObj[this.keyField].toString()) {
          throw new Error(this.keyField + ' ' + newObj[this.keyField] + ' already exists');
        }
      }, this);
      currentDisplayData.unshift(newObj);
      if (this.isOnFilter) {
        this.data.unshift(newObj);
      }
      this._refresh(false);
    }
  }, {
    key: 'add',
    value: function add(newObj) {
      if (!newObj[this.keyField] || newObj[this.keyField].toString() === '') {
        throw new Error(this.keyField + ' can\'t be empty value.');
      }
      var currentDisplayData = this.getCurrentDisplayData();
      currentDisplayData.forEach(function (row) {
        if (row[this.keyField].toString() === newObj[this.keyField].toString()) {
          throw new Error(this.keyField + ' ' + newObj[this.keyField] + ' already exists');
        }
      }, this);

      currentDisplayData.push(newObj);
      if (this.isOnFilter) {
        this.data.push(newObj);
      }
      this._refresh(false);
    }
  }, {
    key: 'remove',
    value: function remove(rowKey) {
      var _this3 = this;

      var currentDisplayData = this.getCurrentDisplayData();
      var result = currentDisplayData.filter(function (row) {
        return rowKey.indexOf(row[_this3.keyField]) === -1;
      });

      if (this.isOnFilter) {
        this.data = this.data.filter(function (row) {
          return rowKey.indexOf(row[_this3.keyField]) === -1;
        });
        this.filteredData = result;
      } else {
        this.data = result;
      }
    }
  }, {
    key: 'filter',
    value: function filter(filterObj) {
      if (Object.keys(filterObj).length === 0) {
        this.filteredData = null;
        this.isOnFilter = false;
        this.filterObj = null;
        if (this.searchText) this._search(this.data);
      } else {
        var source = this.data;
        this.filterObj = filterObj;
        if (this.searchText) {
          this._search(source);
          source = this.filteredData;
        }
        this._filter(source);
      }
    }
  }, {
    key: 'filterNumber',
    value: function filterNumber(targetVal, filterVal, comparator) {
      var valid = true;
      switch (comparator) {
        case '=':
          {
            if (targetVal != filterVal) {
              valid = false;
            }
            break;
          }
        case '>':
          {
            if (targetVal <= filterVal) {
              valid = false;
            }
            break;
          }
        case '>=':
          {
            if (targetVal < filterVal) {
              valid = false;
            }
            break;
          }
        case '<':
          {
            if (targetVal >= filterVal) {
              valid = false;
            }
            break;
          }
        case '<=':
          {
            if (targetVal > filterVal) {
              valid = false;
            }
            break;
          }
        case '!=':
          {
            if (targetVal == filterVal) {
              valid = false;
            }
            break;
          }
        default:
          {
            console.error('Number comparator provided is not supported');
            break;
          }
      }
      return valid;
    }
  }, {
    key: 'filterDate',
    value: function filterDate(targetVal, filterVal, comparator) {
      // if (!targetVal) {
      //   return false;
      // }
      // return (targetVal.getDate() === filterVal.getDate() &&
      //     targetVal.getMonth() === filterVal.getMonth() &&
      //     targetVal.getFullYear() === filterVal.getFullYear());

      var valid = true;
      switch (comparator) {
        case '=':
          {
            if (targetVal != filterVal) {
              valid = false;
            }
            break;
          }
        case '>':
          {
            if (targetVal <= filterVal) {
              valid = false;
            }
            break;
          }
        case '>=':
          {
            if (targetVal < filterVal) {
              valid = false;
            }
            break;
          }
        case '<':
          {
            if (targetVal >= filterVal) {
              valid = false;
            }
            break;
          }
        case '<=':
          {
            if (targetVal > filterVal) {
              valid = false;
            }
            break;
          }
        case '!=':
          {
            if (targetVal == filterVal) {
              valid = false;
            }
            break;
          }
        default:
          {
            console.error('Date comparator provided is not supported');
            break;
          }
      }
      return valid;
    }
  }, {
    key: 'filterRegex',
    value: function filterRegex(targetVal, filterVal) {
      try {
        return new RegExp(filterVal, 'i').test(targetVal);
      } catch (e) {
        return true;
      }
    }
  }, {
    key: 'filterCustom',
    value: function filterCustom(targetVal, filterVal, callbackInfo) {
      if (callbackInfo !== null && (typeof callbackInfo === 'undefined' ? 'undefined' : _typeof(callbackInfo)) === 'object') {
        return callbackInfo.callback(targetVal, callbackInfo.callbackParameters);
      }

      return this.filterText(targetVal, filterVal);
    }
  }, {
    key: 'filterText',
    value: function filterText(targetVal, filterVal) {
      targetVal = targetVal.toString().toLowerCase();
      filterVal = filterVal.toString().toLowerCase();
      if (targetVal.indexOf(filterVal) === -1) {
        return false;
      }
      return true;
    }

    /* General search function
     * It will search for the text if the input includes that text;
     */

  }, {
    key: 'search',
    value: function search(searchText) {
      if (searchText.trim() === '') {
        this.filteredData = null;
        this.isOnFilter = false;
        this.searchText = null;
        if (this.filterObj) this._filter(this.data);
      } else {
        var source = this.data;
        this.searchText = searchText;
        if (this.filterObj) {
          this._filter(source);
          source = this.filteredData;
        }
        this._search(source);
      }
    }
  }, {
    key: '_filter',
    value: function _filter(source) {
      var _this4 = this;

      var filterObj = this.filterObj;
      this.filteredData = source.filter(function (row, r) {
        var valid = true;
        var filterVal = void 0;
        for (var key in filterObj) {
          var targetVal = row[key];
          if (targetVal === null || targetVal === undefined) {
            targetVal = '';
          }

          switch (filterObj[key].type) {
            case _Const2.default.FILTER_TYPE.NUMBER:
              {
                filterVal = filterObj[key].value.number;
                break;
              }
            case _Const2.default.FILTER_TYPE.CUSTOM:
              {
                filterVal = _typeof(filterObj[key].value) === 'object' ? undefined : typeof filterObj[key].value === 'string' ? filterObj[key].value.toLowerCase() : filterObj[key].value;
                break;
              }
            case _Const2.default.FILTER_TYPE.DATE:
              {
                filterVal = filterObj[key].value.date;
                break;
              }
            case _Const2.default.FILTER_TYPE.REGEX:
              {
                filterVal = filterObj[key].value;
                break;
              }
            default:
              {
                filterVal = typeof filterObj[key].value === 'string' ? filterObj[key].value.toLowerCase() : filterObj[key].value;
                if (filterVal === undefined) {
                  // Support old filter
                  filterVal = filterObj[key].toLowerCase();
                }
                break;
              }
          }
          var format = void 0,
              filterFormatted = void 0,
              formatExtraData = void 0,
              filterValue = void 0;
          if (_this4.colInfos[key]) {
            format = _this4.colInfos[key].format;
            filterFormatted = _this4.colInfos[key].filterFormatted;
            formatExtraData = _this4.colInfos[key].formatExtraData;
            filterValue = _this4.colInfos[key].filterValue;
            if (filterFormatted && format) {
              targetVal = format(row[key], row, formatExtraData, r);
            } else if (filterValue) {
              targetVal = filterValue(row[key], row);
            }
          }

          switch (filterObj[key].type) {
            case _Const2.default.FILTER_TYPE.NUMBER:
              {
                valid = _this4.filterNumber(targetVal, filterVal, filterObj[key].value.comparator);
                break;
              }
            case _Const2.default.FILTER_TYPE.DATE:
              {
                valid = _this4.filterDate(targetVal, filterVal, filterObj[key].value.comparator);
                break;
              }
            case _Const2.default.FILTER_TYPE.REGEX:
              {
                valid = _this4.filterRegex(targetVal, filterVal);
                break;
              }
            case _Const2.default.FILTER_TYPE.CUSTOM:
              {
                valid = _this4.filterCustom(targetVal, filterVal, filterObj[key].value);
                break;
              }
            default:
              {
                if (filterObj[key].type === _Const2.default.FILTER_TYPE.SELECT && filterFormatted && filterFormatted && format) {
                  filterVal = format(filterVal, row, formatExtraData, r);
                }
                valid = _this4.filterText(targetVal, filterVal);
                break;
              }
          }
          if (!valid) {
            break;
          }
        }
        return valid;
      });
      this.isOnFilter = true;
    }
  }, {
    key: '_search',
    value: function _search(source) {
      var _this5 = this;

      var searchTextArray = [];

      if (this.multiColumnSearch) {
        searchTextArray = this.searchText.split(' ');
      } else {
        searchTextArray.push(this.searchText);
      }
      this.filteredData = source.filter(function (row, r) {
        var keys = Object.keys(row);
        var valid = false;
        // for loops are ugly, but performance matters here.
        // And you cant break from a forEach.
        // http://jsperf.com/for-vs-foreach/66
        for (var i = 0, keysLength = keys.length; i < keysLength; i++) {
          var key = keys[i];
          // fixed data filter when misunderstand 0 is false
          var filterSpecialNum = false;
          if (!isNaN(row[key]) && parseInt(row[key], 10) === 0) {
            filterSpecialNum = true;
          }
          if (_this5.colInfos[key] && (row[key] || filterSpecialNum)) {
            var _colInfos$key = _this5.colInfos[key],
                format = _colInfos$key.format,
                filterFormatted = _colInfos$key.filterFormatted,
                filterValue = _colInfos$key.filterValue,
                formatExtraData = _colInfos$key.formatExtraData,
                searchable = _colInfos$key.searchable;

            var targetVal = row[key];
            if (searchable) {
              if (filterFormatted && format) {
                targetVal = format(targetVal, row, formatExtraData, r);
              } else if (filterValue) {
                targetVal = filterValue(targetVal, row);
              }
              for (var j = 0, textLength = searchTextArray.length; j < textLength; j++) {
                var filterVal = searchTextArray[j].toLowerCase();
                if (targetVal.toString().toLowerCase().indexOf(filterVal) !== -1) {
                  valid = true;
                  break;
                }
              }
            }
          }
        }
        return valid;
      });
      this.isOnFilter = true;
    }
  }, {
    key: 'getDataIgnoringPagination',
    value: function getDataIgnoringPagination() {
      return this.getCurrentDisplayData();
    }
  }, {
    key: 'get',
    value: function get() {
      var _data = this.getCurrentDisplayData();

      if (_data.length === 0) return _data;

      if (this.remote || !this.enablePagination) {
        return _data;
      } else {
        var result = [];
        for (var i = this.pageObj.start; i <= this.pageObj.end; i++) {
          result.push(_data[i]);
          if (i + 1 === _data.length) break;
        }
        return result;
      }
    }
  }, {
    key: 'getKeyField',
    value: function getKeyField() {
      return this.keyField;
    }
  }, {
    key: 'getDataNum',
    value: function getDataNum() {
      return this.getCurrentDisplayData().length;
    }
  }, {
    key: 'isChangedPage',
    value: function isChangedPage() {
      return this.pageObj.start && this.pageObj.end ? true : false;
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return this.data.length === 0 || this.data === null || this.data === undefined;
    }
  }, {
    key: 'getAllRowkey',
    value: function getAllRowkey() {
      var _this6 = this;

      return this.data.map(function (row) {
        return row[_this6.keyField];
      });
    }
  }]);

  return TableDataStore;
}();

exports.TableDataStore = TableDataStore;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_sort, '_sort', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/store/TableDataStore.js');

  __REACT_HOT_LOADER__.register(TableDataStore, 'TableDataStore', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/store/TableDataStore.js');
}();

;
},{"../Const":33}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Const = require('../Const');

var _Const2 = _interopRequireDefault(_Const);

var _Editor = require('../Editor');

var _Editor2 = _interopRequireDefault(_Editor);

var _Notification = require('../Notification.js');

var _Notification2 = _interopRequireDefault(_Notification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToolBar = function (_Component) {
  _inherits(ToolBar, _Component);

  function ToolBar(props) {
    var _arguments = arguments;

    _classCallCheck(this, ToolBar);

    var _this = _possibleConstructorReturn(this, (ToolBar.__proto__ || Object.getPrototypeOf(ToolBar)).call(this, props));

    _this.handleSaveBtnClick = function () {
      return _this.__handleSaveBtnClick__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleShowOnlyToggle = function () {
      return _this.__handleShowOnlyToggle__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleDropRowBtnClick = function () {
      return _this.__handleDropRowBtnClick__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleDebounce = function (func, wait, immediate) {
      var timeout = void 0;

      return function () {
        var later = function later() {
          timeout = null;

          if (!immediate) {
            func.apply(_this, _arguments);
          }
        };

        var callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait || 0);

        if (callNow) {
          func.appy(_this, _arguments);
        }
      };
    };

    _this.handleKeyUp = function () {
      return _this.__handleKeyUp__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleExportCSV = function () {
      return _this.__handleExportCSV__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.handleClearBtnClick = function () {
      return _this.__handleClearBtnClick__REACT_HOT_LOADER__.apply(_this, arguments);
    };

    _this.timeouteClear = 0;
    _this.modalClassName;
    _this.state = {
      isInsertRowTrigger: true,
      validateState: null,
      shakeEditor: false,
      showSelected: false
    };
    return _this;
  }

  _createClass(ToolBar, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var delay = this.props.searchDelayTime ? this.props.searchDelayTime : 0;
      this.debounceCallback = this.handleDebounce(function () {
        _this2.props.onSearch(_this2.refs.seachInput.value);
      }, delay);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearTimeout();
    }
  }, {
    key: 'clearTimeout',
    value: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function () {
      if (this.timeouteClear) {
        clearTimeout(this.timeouteClear);
        this.timeouteClear = 0;
      }
    })

    // modified by iuculanop
    // BEGIN

  }, {
    key: 'checkAndParseForm',
    value: function checkAndParseForm() {
      var _this3 = this;

      var newObj = {};
      var validateState = {};
      var isValid = true;
      var checkVal = void 0;
      var responseType = void 0;
      var tempValue = void 0;

      this.props.columns.forEach(function (column, i) {
        if (column.autoValue) {
          // when you want same auto generate value and not allow edit, example ID field
          var time = new Date().getTime();
          tempValue = typeof column.autoValue === 'function' ? column.autoValue() : 'autovalue-' + time;
        } else if (column.hiddenOnInsert) {
          tempValue = '';
        } else {
          var dom = this.refs[column.field + i];
          tempValue = dom.value;

          if (column.editable && column.editable.type === 'checkbox') {
            var values = tempValue.split(':');
            tempValue = dom.checked ? values[0] : values[1];
          }

          if (column.editable && column.editable.validator) {
            // process validate
            checkVal = column.editable.validator(tempValue);
            responseType = typeof checkVal === 'undefined' ? 'undefined' : _typeof(checkVal);
            if (responseType !== 'object' && checkVal !== true) {
              this.refs.notifier.notice('error', 'Form validate errors, please checking!', 'Pressed ESC can cancel');
              isValid = false;
              validateState[column.field] = checkVal;
            } else if (responseType === 'object' && checkVal.isValid !== true) {
              this.refs.notifier.notice(checkVal.notification.type, checkVal.notification.msg, checkVal.notification.title);
              isValid = false;
              validateState[column.field] = checkVal.notification.msg;
            }
          }
        }

        newObj[column.field] = tempValue;
      }, this);

      if (isValid) {
        return newObj;
      } else {
        this.clearTimeout();
        // show error in form and shake it
        this.setState({ validateState: validateState, shakeEditor: true });
        this.timeouteClear = setTimeout(function () {
          _this3.setState({ shakeEditor: false });
        }, 300);
        return null;
      }
    }
    // END

  }, {
    key: '__handleSaveBtnClick__REACT_HOT_LOADER__',
    value: function __handleSaveBtnClick__REACT_HOT_LOADER__() {
      var _this4 = this;

      var newObj = this.checkAndParseForm();
      if (!newObj) {
        // validate errors
        return;
      }
      var msg = this.props.onAddRow(newObj);
      if (msg) {
        this.refs.notifier.notice('error', msg, 'Pressed ESC can cancel');
        this.clearTimeout();
        // shake form and hack prevent modal hide
        this.setState({
          shakeEditor: true,
          validateState: 'this is hack for prevent bootstrap modal hide'
        });
        // clear animate class
        this.timeouteClear = setTimeout(function () {
          _this4.setState({ shakeEditor: false });
        }, 300);
      } else {
        // reset state and hide modal hide
        this.setState({
          validateState: null,
          shakeEditor: false
        }, function () {
          document.querySelector('.modal-backdrop').click();
          document.querySelector('.' + _this4.modalClassName).click();
        });
        // reset form
        this.refs.form.reset();
      }
    }
  }, {
    key: '__handleShowOnlyToggle__REACT_HOT_LOADER__',
    value: function __handleShowOnlyToggle__REACT_HOT_LOADER__() {
      this.setState({
        showSelected: !this.state.showSelected
      });
      this.props.onShowOnlySelected();
    }
  }, {
    key: '__handleDropRowBtnClick__REACT_HOT_LOADER__',
    value: function __handleDropRowBtnClick__REACT_HOT_LOADER__() {
      this.props.onDropRow();
    }
  }, {
    key: 'handleCloseBtn',
    value: function handleCloseBtn() {
      this.refs.warning.style.display = 'none';
    }
  }, {
    key: '__handleKeyUp__REACT_HOT_LOADER__',
    value: function __handleKeyUp__REACT_HOT_LOADER__(event) {
      event.persist();
      this.debounceCallback(event);
    }
  }, {
    key: '__handleExportCSV__REACT_HOT_LOADER__',
    value: function __handleExportCSV__REACT_HOT_LOADER__() {
      this.props.onExportCSV();
    }
  }, {
    key: '__handleClearBtnClick__REACT_HOT_LOADER__',
    value: function __handleClearBtnClick__REACT_HOT_LOADER__() {
      this.refs.seachInput.value = '';
      this.props.onSearch('');
    }
  }, {
    key: 'render',
    value: function render() {
      this.modalClassName = 'bs-table-modal-sm' + ToolBar.modalSeq++;
      var insertBtn = null;
      var deleteBtn = null;
      var exportCSV = null;
      var showSelectedOnlyBtn = null;

      if (this.props.enableInsert) {
        insertBtn = _react2.default.createElement(
          'button',
          { type: 'button',
            className: 'btn btn-info react-bs-table-add-btn',
            'data-toggle': 'modal',
            'data-target': '.' + this.modalClassName },
          _react2.default.createElement('i', { className: 'glyphicon glyphicon-plus' }),
          ' ',
          this.props.insertText
        );
      }

      if (this.props.enableDelete) {
        deleteBtn = _react2.default.createElement(
          'button',
          { type: 'button',
            className: 'btn btn-warning react-bs-table-del-btn',
            'data-toggle': 'tooltip',
            'data-placement': 'right',
            title: 'Drop selected row',
            onClick: this.handleDropRowBtnClick },
          _react2.default.createElement('i', { className: 'glyphicon glyphicon-trash' }),
          ' ',
          this.props.deleteText
        );
      }

      if (this.props.enableShowOnlySelected) {
        showSelectedOnlyBtn = _react2.default.createElement(
          'button',
          { type: 'button',
            onClick: this.handleShowOnlyToggle,
            className: 'btn btn-primary',
            'data-toggle': 'button',
            'aria-pressed': 'false' },
          this.state.showSelected ? _Const2.default.SHOW_ALL : _Const2.default.SHOW_ONLY_SELECT
        );
      }

      if (this.props.enableExportCSV) {
        exportCSV = _react2.default.createElement(
          'button',
          { type: 'button',
            className: 'btn btn-success hidden-print',
            onClick: this.handleExportCSV },
          _react2.default.createElement('i', { className: 'glyphicon glyphicon-export' }),
          this.props.exportCSVText
        );
      }

      var searchTextInput = this.renderSearchPanel();
      var modal = this.props.enableInsert ? this.renderInsertRowModal() : null;

      return _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'div',
          { className: 'col-xs-12 col-sm-6 col-md-6 col-lg-8' },
          _react2.default.createElement(
            'div',
            { className: 'btn-group btn-group-sm', role: 'group' },
            exportCSV,
            insertBtn,
            deleteBtn,
            showSelectedOnlyBtn
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'col-xs-12 col-sm-6 col-md-6 col-lg-4' },
          searchTextInput
        ),
        _react2.default.createElement(_Notification2.default, { ref: 'notifier' }),
        modal
      );
    }
  }, {
    key: 'renderSearchPanel',
    value: function renderSearchPanel() {
      if (this.props.enableSearch) {
        var classNames = 'form-group form-group-sm react-bs-table-search-form';
        var clearBtn = null;
        if (this.props.clearSearch) {
          clearBtn = _react2.default.createElement(
            'span',
            { className: 'input-group-btn' },
            _react2.default.createElement(
              'button',
              {
                className: 'btn btn-default',
                type: 'button',
                onClick: this.handleClearBtnClick },
              'Clear'
            )
          );
          classNames += ' input-group input-group-sm';
        }

        return _react2.default.createElement(
          'div',
          { className: classNames },
          _react2.default.createElement('input', { ref: 'seachInput',
            className: 'form-control',
            type: 'text',
            defaultValue: this.props.defaultSearch,
            placeholder: this.props.searchPlaceholder ? this.props.searchPlaceholder : 'Search',
            onKeyUp: this.handleKeyUp }),
          clearBtn
        );
      } else {
        return null;
      }
    }
  }, {
    key: 'renderInsertRowModal',
    value: function renderInsertRowModal() {
      var _this5 = this;

      var validateState = this.state.validateState || {};
      var shakeEditor = this.state.shakeEditor;
      var inputField = this.props.columns.map(function (column, i) {
        var editable = column.editable,
            format = column.format,
            field = column.field,
            name = column.name,
            autoValue = column.autoValue,
            hiddenOnInsert = column.hiddenOnInsert;

        var attr = {
          ref: field + i,
          placeholder: editable.placeholder ? editable.placeholder : name
        };

        if (autoValue || hiddenOnInsert) {
          // when you want same auto generate value
          // and not allow edit, for example ID field
          return null;
        }
        var error = validateState[field] ? _react2.default.createElement(
          'span',
          { className: 'help-block bg-danger' },
          validateState[field]
        ) : null;

        // let editor = Editor(editable,attr,format);
        // if(editor.props.type && editor.props.type == 'checkbox'){
        return _react2.default.createElement(
          'div',
          { className: 'form-group', key: field },
          _react2.default.createElement(
            'label',
            null,
            name
          ),
          (0, _Editor2.default)(editable, attr, format, '', undefined, _this5.props.ignoreEditable),
          error
        );
      });
      var modalClass = (0, _classnames2.default)('modal', 'fade', this.modalClassName, {
        // hack prevent bootstrap modal hide by reRender
        'in': shakeEditor || this.state.validateState
      });
      var dialogClass = (0, _classnames2.default)('modal-dialog', 'modal-sm', {
        'animated': shakeEditor,
        'shake': shakeEditor
      });
      return _react2.default.createElement(
        'div',
        { ref: 'modal', className: modalClass, tabIndex: '-1', role: 'dialog' },
        _react2.default.createElement(
          'div',
          { className: dialogClass },
          _react2.default.createElement(
            'div',
            { className: 'modal-content' },
            _react2.default.createElement(
              'div',
              { className: 'modal-header' },
              _react2.default.createElement(
                'button',
                { type: 'button',
                  className: 'close',
                  'data-dismiss': 'modal',
                  'aria-label': 'Close' },
                _react2.default.createElement(
                  'span',
                  { 'aria-hidden': 'true' },
                  '\xD7'
                )
              ),
              _react2.default.createElement(
                'h4',
                { className: 'modal-title' },
                'New Record'
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'modal-body' },
              _react2.default.createElement(
                'form',
                { ref: 'form' },
                inputField
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'modal-footer' },
              _react2.default.createElement(
                'button',
                { type: 'button',
                  className: 'btn btn-default',
                  'data-dismiss': 'modal' },
                this.props.closeText
              ),
              _react2.default.createElement(
                'button',
                { type: 'button',
                  className: 'btn btn-primary',
                  onClick: this.handleSaveBtnClick },
                this.props.saveText
              )
            )
          )
        )
      );
    }
  }]);

  return ToolBar;
}(_react.Component);

ToolBar.modalSeq = 0;


ToolBar.propTypes = {
  onAddRow: _react.PropTypes.func,
  onDropRow: _react.PropTypes.func,
  onShowOnlySelected: _react.PropTypes.func,
  enableInsert: _react.PropTypes.bool,
  enableDelete: _react.PropTypes.bool,
  enableSearch: _react.PropTypes.bool,
  enableShowOnlySelected: _react.PropTypes.bool,
  columns: _react.PropTypes.array,
  searchPlaceholder: _react.PropTypes.string,
  exportCSVText: _react.PropTypes.string,
  insertText: _react.PropTypes.string,
  deleteText: _react.PropTypes.string,
  saveText: _react.PropTypes.string,
  closeText: _react.PropTypes.string,
  clearSearch: _react.PropTypes.bool,
  ignoreEditable: _react.PropTypes.bool,
  defaultSearch: _react.PropTypes.string
};

ToolBar.defaultProps = {
  enableInsert: false,
  enableDelete: false,
  enableSearch: false,
  enableShowOnlySelected: false,
  clearSearch: false,
  ignoreEditable: false,
  exportCSVText: _Const2.default.EXPORT_CSV_TEXT,
  insertText: _Const2.default.INSERT_BTN_TEXT,
  deleteText: _Const2.default.DELETE_BTN_TEXT,
  saveText: _Const2.default.SAVE_BTN_TEXT,
  closeText: _Const2.default.CLOSE_BTN_TEXT
};

var _default = ToolBar;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ToolBar, 'ToolBar', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/toolbar/ToolBar.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/toolbar/ToolBar.js');
}();

;
},{"../Const":33,"../Editor":34,"../Notification.js":37,"classnames":1,"react":"react"}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Const = require('./Const');

var _Const2 = _interopRequireDefault(_Const);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  renderReactSortCaret: function renderReactSortCaret(order) {
    var orderClass = (0, _classnames2.default)('order', {
      'dropup': order === _Const2.default.SORT_ASC
    });
    return _react2.default.createElement(
      'span',
      { className: orderClass },
      _react2.default.createElement('span', { className: 'caret', style: { margin: '10px 5px' } })
    );
  },
  getScrollBarWidth: function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = '100%';
    inner.style.height = '200px';

    var outer = document.createElement('div');
    outer.style.position = 'absolute';
    outer.style.top = '0px';
    outer.style.left = '0px';
    outer.style.visibility = 'hidden';
    outer.style.width = '200px';
    outer.style.height = '150px';
    outer.style.overflow = 'hidden';
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 === w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return w1 - w2;
  },
  canUseDOM: function canUseDOM() {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }
};
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', '/Users/allen/Node/react-bootstrap-table-new/react-bootstrap-table/src/util.js');
}();

;
},{"./Const":33,"classnames":1,"react":"react"}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _sortBy = require('lodash/sortBy');

var _sortBy2 = _interopRequireDefault(_sortBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = function () {
	function Manager() {
		_classCallCheck(this, Manager);

		this.refs = {};
	}

	_createClass(Manager, [{
		key: 'add',
		value: function add(collection, ref) {
			if (!this.refs[collection]) this.refs[collection] = [];

			this.refs[collection].push(ref);
		}
	}, {
		key: 'remove',
		value: function remove(collection, ref) {
			var index = this.getIndex(collection, ref);

			if (index !== -1) {
				this.refs[collection].splice(index, 1);
			}
		}
	}, {
		key: 'getActive',
		value: function getActive() {
			var _this = this;

			return (0, _find2.default)(this.refs[this.active.collection], function (_ref) {
				var node = _ref.node;
				return node.sortableInfo.index == _this.active.index;
			});
		}
	}, {
		key: 'getIndex',
		value: function getIndex(collection, ref) {
			return this.refs[collection].indexOf(ref);
		}
	}, {
		key: 'getOrderedRefs',
		value: function getOrderedRefs() {
			var collection = arguments.length <= 0 || arguments[0] === undefined ? this.active.collection : arguments[0];

			return (0, _sortBy2.default)(this.refs[collection], function (_ref2) {
				var node = _ref2.node;
				return node.sortableInfo.index;
			});
		}
	}]);

	return Manager;
}();

exports.default = Manager;
},{"lodash/find":179,"lodash/sortBy":197}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = SortableContainer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Manager = require('../Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _utils = require('../utils');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Export Higher Order Sortable Container Component
function SortableContainer(WrappedComponent) {
	var _class, _temp;

	var config = arguments.length <= 1 || arguments[1] === undefined ? { withRef: false } : arguments[1];

	return _temp = _class = function (_Component) {
		_inherits(_class, _Component);

		function _class(props) {
			_classCallCheck(this, _class);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, props));

			_this.handleStart = function (e) {
				var _this$props = _this.props;
				var distance = _this$props.distance;
				var shouldCancelStart = _this$props.shouldCancelStart;


				if (e.button === 2 || shouldCancelStart(e)) {
					return false;
				}

				_this._touched = true;
				_this._pos = {
					x: e.clientX,
					y: e.clientY
				};

				var node = (0, _utils.closest)(e.target, function (el) {
					return el.sortableInfo != null;
				});

				if (node && node.sortableInfo && !_this.state.sorting) {
					var useDragHandle = _this.props.useDragHandle;
					var _node$sortableInfo = node.sortableInfo;
					var index = _node$sortableInfo.index;
					var collection = _node$sortableInfo.collection;


					if (useDragHandle && !(0, _utils.closest)(e.target, function (el) {
						return el.sortableHandle != null;
					})) return;

					_this.manager.active = { index: index, collection: collection };

					if (!distance) {
						_this.pressTimer = setTimeout(function () {
							return _this.handlePress(e);
						}, _this.props.pressDelay);
					}
				}
			};

			_this.handleMove = function (e) {
				var distance = _this.props.distance;


				if (!_this.state.sorting && _this._touched) {
					_this._delta = {
						x: _this._pos.x - e.clientX,
						y: _this._pos.y - e.clientY
					};
					var delta = Math.abs(_this._delta.x) + Math.abs(_this._delta.y);

					if (!distance) {
						_this.cancel();
					} else if (delta >= distance) {
						_this.handlePress(e);
					}
				}
			};

			_this.handleEnd = function () {
				var distance = _this.props.distance;


				_this._touched = false;

				if (!distance) {
					_this.cancel();
				}
			};

			_this.cancel = function () {
				if (!_this.state.sorting) {
					clearTimeout(_this.pressTimer);
					_this.manager.active = null;
				}
			};

			_this.handlePress = function (e) {
				var active = _this.manager.getActive();

				if (active) {
					var _this$props2 = _this.props;
					var axis = _this$props2.axis;
					var onSortStart = _this$props2.onSortStart;
					var helperClass = _this$props2.helperClass;
					var hideSortableGhost = _this$props2.hideSortableGhost;
					var useWindowAsScrollContainer = _this$props2.useWindowAsScrollContainer;
					var getHelperDimensions = _this$props2.getHelperDimensions;
					var node = active.node;
					var collection = active.collection;
					var index = node.sortableInfo.index;

					var margin = (0, _utils.getElementMargin)(node);

					var containerBoundingRect = _this.container.getBoundingClientRect();
					var dimensions = getHelperDimensions({ index: index, node: node, collection: collection });

					_this.node = node;
					_this.width = dimensions.width;
					_this.height = dimensions.height;
					_this.margin = margin;
					_this.dimension = axis === 'x' ? _this.width : _this.height;
					_this.marginOffset = {
						x: _this.margin.left + _this.margin.right,
						y: Math.max(_this.margin.top, _this.margin.bottom)
					};
					_this.boundingClientRect = node.getBoundingClientRect();
					_this.index = index;
					_this.newIndex = index;

					var edge = _this.edge = axis === 'x' ? 'Left' : 'Top';
					_this.offsetEdge = _this.getEdgeOffset(edge, node);
					_this.initialOffset = _this.getOffset(e);
					_this.initialScroll = _this.scrollContainer['scroll' + edge];

					_this.helper = _this.document.body.appendChild(node.cloneNode(true));
					_this.helper.style.position = 'fixed';
					_this.helper.style.top = _this.boundingClientRect.top - margin.top + 'px';
					_this.helper.style.left = _this.boundingClientRect.left - margin.left + 'px';
					_this.helper.style.width = _this.width + 'px';
					_this.helper.style.boxSizing = 'border-box';

					if (hideSortableGhost) {
						_this.sortableGhost = node;
						node.style.visibility = 'hidden';
					}

					if (axis === 'x') {
						_this.minTranslate = (useWindowAsScrollContainer ? 0 : containerBoundingRect.left) - _this.boundingClientRect.left - _this.width / 2;
						_this.maxTranslate = (useWindowAsScrollContainer ? _this.contentWindow.innerWidth : containerBoundingRect.left + containerBoundingRect.width) - _this.boundingClientRect.left - _this.width / 2;
					} else {
						_this.minTranslate = (useWindowAsScrollContainer ? 0 : containerBoundingRect.top) - _this.boundingClientRect.top - _this.height / 2;
						_this.maxTranslate = (useWindowAsScrollContainer ? _this.contentWindow.innerHeight : containerBoundingRect.top + containerBoundingRect.height) - _this.boundingClientRect.top - _this.height / 2;
					}

					if (helperClass) {
						var _this$helper$classLis;

						(_this$helper$classLis = _this.helper.classList).add.apply(_this$helper$classLis, _toConsumableArray(helperClass.split(' ')));
					}

					_this.listenerNode = e.touches ? node : _this.contentWindow;
					_utils.events.move.forEach(function (eventName) {
						return _this.listenerNode.addEventListener(eventName, _this.handleSortMove, false);
					});
					_utils.events.end.forEach(function (eventName) {
						return _this.listenerNode.addEventListener(eventName, _this.handleSortEnd, false);
					});

					_this.setState({
						sorting: true,
						sortingIndex: index
					});

					if (onSortStart) onSortStart({ node: node, index: index, collection: collection }, e);
				}
			};

			_this.handleSortMove = function (e) {
				var onSortMove = _this.props.onSortMove;

				e.preventDefault(); // Prevent scrolling on mobile

				_this.updatePosition(e);
				_this.animateNodes();
				_this.autoscroll();

				if (onSortMove) onSortMove(e);
			};

			_this.handleSortEnd = function (e) {
				var _this$props3 = _this.props;
				var hideSortableGhost = _this$props3.hideSortableGhost;
				var onSortEnd = _this$props3.onSortEnd;
				var collection = _this.manager.active.collection;

				// Remove the event listeners if the node is still in the DOM

				if (_this.listenerNode) {
					_utils.events.move.forEach(function (eventName) {
						return _this.listenerNode.removeEventListener(eventName, _this.handleSortMove);
					});
					_utils.events.end.forEach(function (eventName) {
						return _this.listenerNode.removeEventListener(eventName, _this.handleSortEnd);
					});
				}

				// Remove the helper from the DOM
				_this.helper.parentNode.removeChild(_this.helper);

				if (hideSortableGhost && _this.sortableGhost) {
					_this.sortableGhost.style.visibility = '';
				}

				var nodes = _this.manager.refs[collection];
				for (var i = 0, len = nodes.length; i < len; i++) {
					var node = nodes[i];
					var el = node.node;

					// Clear the cached offsetTop / offsetLeft value
					node.edgeOffset = null;

					// Remove the transforms / transitions
					el.style[_utils.vendorPrefix + 'Transform'] = '';
					el.style[_utils.vendorPrefix + 'TransitionDuration'] = '';
				}

				if (typeof onSortEnd === 'function') {
					onSortEnd({
						oldIndex: _this.index,
						newIndex: _this.newIndex,
						collection: collection
					}, e);
				}

				// Stop autoscroll
				clearInterval(_this.autoscrollInterval);
				_this.autoscrollInterval = null;

				// Update state
				_this.manager.active = null;

				_this.setState({
					sorting: false,
					sortingIndex: null
				});

				_this._touched = false;
			};

			_this.autoscroll = function () {
				var translate = _this.translate;
				var direction = 0;
				var speed = 1;
				var acceleration = 10;

				if (translate >= _this.maxTranslate - _this.dimension / 2) {
					direction = 1; // Scroll Down
					speed = acceleration * Math.abs((_this.maxTranslate - _this.dimension / 2 - translate) / _this.dimension);
				} else if (translate <= _this.minTranslate + _this.dimension / 2) {
					direction = -1; // Scroll Up
					speed = acceleration * Math.abs((translate - _this.dimension / 2 - _this.minTranslate) / _this.dimension);
				}

				if (_this.autoscrollInterval) {
					clearTimeout(_this.autoscrollInterval);
					_this.autoscrollInterval = null;
					_this.isAutoScrolling = false;
				}

				if (direction !== 0) {
					_this.autoscrollInterval = setInterval(function () {
						_this.isAutoScrolling = true;
						var offset = 1 * speed * direction;
						_this.scrollContainer['scroll' + _this.edge] += offset;
						_this.translate += offset;
						_this.animateNodes();
					}, 5);
				}
			};

			_this.manager = new _Manager2.default();
			_this.events = {
				start: _this.handleStart,
				move: _this.handleMove,
				end: _this.handleEnd
			};

			(0, _invariant2.default)(!(props.distance && props.pressDelay), 'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.');

			_this.state = {};
			return _this;
		}

		_createClass(_class, [{
			key: 'getChildContext',
			value: function getChildContext() {
				return {
					manager: this.manager
				};
			}
		}, {
			key: 'componentDidMount',
			value: function componentDidMount() {
				var _this2 = this;

				var _props = this.props;
				var contentWindow = _props.contentWindow;
				var getContainer = _props.getContainer;
				var useWindowAsScrollContainer = _props.useWindowAsScrollContainer;


				this.container = typeof getContainer === 'function' ? getContainer(this.getWrappedInstance()) : _reactDom2.default.findDOMNode(this);
				this.document = this.container.ownerDocument || document;
				this.scrollContainer = useWindowAsScrollContainer ? this.document.body : this.container;
				this.contentWindow = typeof contentWindow === 'function' ? contentWindow() : contentWindow;

				var _loop = function _loop(key) {
					_utils.events[key].forEach(function (eventName) {
						return _this2.container.addEventListener(eventName, _this2.events[key], false);
					});
				};

				for (var key in this.events) {
					_loop(key);
				}
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				var _this3 = this;

				var _loop2 = function _loop2(key) {
					_utils.events[key].forEach(function (eventName) {
						return _this3.container.removeEventListener(eventName, _this3.events[key]);
					});
				};

				for (var key in this.events) {
					_loop2(key);
				}
			}
		}, {
			key: 'getEdgeOffset',
			value: function getEdgeOffset(edge, node) {
				var offset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

				// Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested
				if (node) {
					if (node.parentNode !== this.container) {
						return this.getEdgeOffset(edge, node.parentNode, offset + node['offset' + edge]);
					} else {
						return node['offset' + edge] + offset;
					}
				}
			}
		}, {
			key: 'getOffset',
			value: function getOffset(e) {
				return {
					x: e.touches ? e.touches[0].clientX : e.clientX,
					y: e.touches ? e.touches[0].clientY : e.clientY
				};
			}
		}, {
			key: 'getLockPixelOffsets',
			value: function getLockPixelOffsets() {
				var lockOffset = this.props.lockOffset;


				if (!Array.isArray(lockOffset)) {
					lockOffset = [lockOffset, lockOffset];
				}

				(0, _invariant2.default)(lockOffset.length === 2, 'lockOffset prop of SortableContainer should be a single ' + 'value or an array of exactly two values. Given %s', lockOffset);

				var _lockOffset = lockOffset;

				var _lockOffset2 = _slicedToArray(_lockOffset, 2);

				var minLockOffset = _lockOffset2[0];
				var maxLockOffset = _lockOffset2[1];


				return [this.getLockPixelOffset(minLockOffset), this.getLockPixelOffset(maxLockOffset)];
			}
		}, {
			key: 'getLockPixelOffset',
			value: function getLockPixelOffset(lockOffset) {
				var offset = lockOffset;
				var unit = 'px';

				if (typeof lockOffset === 'string') {
					var match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);

					(0, _invariant2.default)(match !== null, 'lockOffset value should be a number or a string of a ' + 'number followed by "px" or "%". Given %s', lockOffset);

					offset = parseFloat(lockOffset);
					unit = match[1];
				}

				(0, _invariant2.default)(isFinite(offset), 'lockOffset value should be a finite. Given %s', lockOffset);

				if (unit === '%') {
					offset = offset * this.dimension / 100;
				}

				return offset;
			}
		}, {
			key: 'updatePosition',
			value: function updatePosition(e) {
				var _props2 = this.props;
				var axis = _props2.axis;
				var lockAxis = _props2.lockAxis;
				var lockToContainerEdges = _props2.lockToContainerEdges;

				var offset = this.getOffset(e);
				var translate = {
					x: offset.x - this.initialOffset.x,
					y: offset.y - this.initialOffset.y
				};

				this.translate = translate[axis];

				if (lockToContainerEdges) {
					var _getLockPixelOffsets = this.getLockPixelOffsets();

					var _getLockPixelOffsets2 = _slicedToArray(_getLockPixelOffsets, 2);

					var minLockOffset = _getLockPixelOffsets2[0];
					var maxLockOffset = _getLockPixelOffsets2[1];

					var minOffset = this.dimension / 2 - minLockOffset;
					var maxOffset = this.dimension / 2 - maxLockOffset;

					translate[axis] = (0, _utils.limit)(this.minTranslate + minOffset, this.maxTranslate - maxOffset, translate[axis]);
				}

				switch (lockAxis) {
					case 'x':
						translate.y = 0;
						break;
					case 'y':
						translate.x = 0;
						break;
				}

				this.helper.style[_utils.vendorPrefix + 'Transform'] = 'translate3d(' + translate.x + 'px,' + translate.y + 'px, 0)';
			}
		}, {
			key: 'animateNodes',
			value: function animateNodes() {
				var _props3 = this.props;
				var axis = _props3.axis;
				var transitionDuration = _props3.transitionDuration;
				var hideSortableGhost = _props3.hideSortableGhost;

				var nodes = this.manager.getOrderedRefs();
				var deltaScroll = this.scrollContainer['scroll' + this.edge] - this.initialScroll;
				var sortingOffset = this.offsetEdge + this.translate + deltaScroll;
				this.newIndex = null;

				for (var i = 0, len = nodes.length; i < len; i++) {
					var _nodes$i = nodes[i];
					var node = _nodes$i.node;
					var edgeOffset = _nodes$i.edgeOffset;

					var index = node.sortableInfo.index;
					var dimension = axis === 'x' ? node.offsetWidth : node.offsetHeight;
					var offset = this.dimension > dimension ? dimension / 2 : this.dimension / 2;
					var translate = 0;
					var translateX = 0;
					var translateY = 0;

					// If we haven't cached the node's offsetTop / offsetLeft value
					if (edgeOffset == null) {
						nodes[i].edgeOffset = edgeOffset = this.getEdgeOffset(this.edge, node);
					}

					// If the node is the one we're currently animating, skip it
					if (index === this.index) {
						if (hideSortableGhost) {
							/*
        * With windowing libraries such as `react-virtualized`, the sortableGhost
        * node may change while scrolling down and then back up (or vice-versa),
        * so we need to update the reference to the new node just to be safe.
        */
							this.sortableGhost = node;
							node.style.visibility = 'hidden';
						}
						continue;
					}

					if (transitionDuration) {
						node.style[_utils.vendorPrefix + 'TransitionDuration'] = transitionDuration + 'ms';
					}

					if (index > this.index && sortingOffset + offset >= edgeOffset) {
						translate = -(this.dimension + this.marginOffset[axis]);
						this.newIndex = index;
					} else if (index < this.index && sortingOffset <= edgeOffset + offset) {
						translate = this.dimension + this.marginOffset[axis];

						if (this.newIndex == null) {
							this.newIndex = index;
						}
					}

					if (axis === 'x') {
						translateX = translate;
					} else {
						translateY = translate;
					}

					node.style[_utils.vendorPrefix + 'Transform'] = 'translate3d(' + translateX + 'px,' + translateY + 'px,0)';
				}

				if (this.newIndex == null) {
					this.newIndex = this.index;
				}
			}
		}, {
			key: 'getWrappedInstance',
			value: function getWrappedInstance() {
				(0, _invariant2.default)(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call');
				return this.refs.wrappedInstance;
			}
		}, {
			key: 'render',
			value: function render() {
				var ref = config.withRef ? 'wrappedInstance' : null;

				return _react2.default.createElement(WrappedComponent, _extends({ ref: ref }, this.props, this.state));
			}
		}]);

		return _class;
	}(_react.Component), _class.displayName = WrappedComponent.displayName ? 'SortableList(' + WrappedComponent.displayName + ')' : 'SortableList', _class.WrappedComponent = WrappedComponent, _class.defaultProps = {
		axis: 'y',
		transitionDuration: 300,
		pressDelay: 0,
		distance: 0,
		useWindowAsScrollContainer: false,
		hideSortableGhost: true,
		contentWindow: typeof window !== 'undefined' ? window : null,
		shouldCancelStart: function shouldCancelStart(e) {
			// Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
			if (['input', 'textarea', 'select', 'option'].indexOf(e.target.tagName.toLowerCase()) !== -1) {
				return true; // Return true to cancel sorting
			}
		},
		lockToContainerEdges: false,
		lockOffset: '50%',
		getHelperDimensions: function getHelperDimensions(_ref) {
			var node = _ref.node;
			return {
				width: node.offsetWidth,
				height: node.offsetHeight
			};
		}
	}, _class.propTypes = {
		axis: _react.PropTypes.oneOf(['x', 'y']),
		distance: _react.PropTypes.number,
		lockAxis: _react.PropTypes.string,
		helperClass: _react.PropTypes.string,
		transitionDuration: _react.PropTypes.number,
		contentWindow: _react.PropTypes.any,
		onSortStart: _react.PropTypes.func,
		onSortMove: _react.PropTypes.func,
		onSortEnd: _react.PropTypes.func,
		shouldCancelStart: _react.PropTypes.func,
		pressDelay: _react.PropTypes.number,
		useDragHandle: _react.PropTypes.bool,
		useWindowAsScrollContainer: _react.PropTypes.bool,
		hideSortableGhost: _react.PropTypes.bool,
		lockToContainerEdges: _react.PropTypes.bool,
		lockOffset: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]))]),
		getContainer: _react.PropTypes.func,
		getHelperDimensions: _react.PropTypes.func
	}, _class.childContextTypes = {
		manager: _react.PropTypes.object.isRequired
	}, _temp;
}
},{"../Manager":59,"../utils":64,"invariant":27,"react":"react","react-dom":"react-dom"}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = SortableElement;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Export Higher Order Sortable Element Component
function SortableElement(WrappedComponent) {
    var _class, _temp;

    var config = arguments.length <= 1 || arguments[1] === undefined ? { withRef: false } : arguments[1];

    return _temp = _class = function (_Component) {
        _inherits(_class, _Component);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
        }

        _createClass(_class, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _props = this.props;
                var collection = _props.collection;
                var disabled = _props.disabled;
                var index = _props.index;


                if (!disabled) {
                    this.setDraggable(collection, index);
                }
            }
        }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                if (this.props.index !== nextProps.index && this.node) {
                    this.node.sortableInfo.index = nextProps.index;
                }
                if (this.props.disabled !== nextProps.disabled) {
                    var collection = nextProps.collection;
                    var disabled = nextProps.disabled;
                    var index = nextProps.index;

                    if (disabled) {
                        this.removeDraggable(collection);
                    } else {
                        this.setDraggable(collection, index);
                    }
                } else if (this.props.collection !== nextProps.collection) {
                    this.removeDraggable(this.props.collection);
                    this.setDraggable(nextProps.collection, nextProps.index);
                }
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                var _props2 = this.props;
                var collection = _props2.collection;
                var disabled = _props2.disabled;


                if (!disabled) this.removeDraggable(collection);
            }
        }, {
            key: 'setDraggable',
            value: function setDraggable(collection, index) {
                var node = this.node = (0, _reactDom.findDOMNode)(this);

                node.sortableInfo = { index: index, collection: collection };

                this.ref = { node: node };
                this.context.manager.add(collection, this.ref);
            }
        }, {
            key: 'removeDraggable',
            value: function removeDraggable(collection) {
                this.context.manager.remove(collection, this.ref);
            }
        }, {
            key: 'getWrappedInstance',
            value: function getWrappedInstance() {
                (0, _invariant2.default)(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableElement() call');
                return this.refs.wrappedInstance;
            }
        }, {
            key: 'render',
            value: function render() {
                var ref = config.withRef ? 'wrappedInstance' : null;
                return _react2.default.createElement(WrappedComponent, _extends({ ref: ref }, this.props));
            }
        }]);

        return _class;
    }(_react.Component), _class.displayName = WrappedComponent.displayName ? 'SortableElement(' + WrappedComponent.displayName + ')' : 'SortableElement', _class.WrappedComponent = WrappedComponent, _class.contextTypes = {
        manager: _react.PropTypes.object.isRequired
    }, _class.propTypes = {
        index: _react.PropTypes.number.isRequired,
        collection: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
        disabled: _react.PropTypes.bool
    }, _class.defaultProps = {
        collection: 0
    }, _temp;
}
},{"invariant":27,"react":"react","react-dom":"react-dom"}],62:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = SortableHandle;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Export Higher Order Sortable Element Component
function SortableHandle(WrappedComponent) {
    var _class, _temp;

    var config = arguments.length <= 1 || arguments[1] === undefined ? { withRef: false } : arguments[1];

    return _temp = _class = function (_Component) {
        _inherits(_class, _Component);

        function _class() {
            _classCallCheck(this, _class);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
        }

        _createClass(_class, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var node = (0, _reactDom.findDOMNode)(this);
                node.sortableHandle = true;
            }
        }, {
            key: 'getWrappedInstance',
            value: function getWrappedInstance() {
                (0, _invariant2.default)(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableHandle() call');
                return this.refs.wrappedInstance;
            }
        }, {
            key: 'render',
            value: function render() {
                var ref = config.withRef ? 'wrappedInstance' : null;
                return _react2.default.createElement(WrappedComponent, _extends({ ref: ref }, this.props));
            }
        }]);

        return _class;
    }(_react.Component), _class.displayName = WrappedComponent.displayName ? 'SortableHandle(' + WrappedComponent.displayName + ')' : 'SortableHandle', _class.WrappedComponent = WrappedComponent, _temp;
}
},{"invariant":27,"react":"react","react-dom":"react-dom"}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayMove = exports.SortableHandle = exports.SortableElement = exports.SortableContainer = undefined;

var _utils = require('./utils');

Object.defineProperty(exports, 'arrayMove', {
  enumerable: true,
  get: function get() {
    return _utils.arrayMove;
  }
});

var _SortableContainer2 = require('./SortableContainer');

var _SortableContainer3 = _interopRequireDefault(_SortableContainer2);

var _SortableElement2 = require('./SortableElement');

var _SortableElement3 = _interopRequireDefault(_SortableElement2);

var _SortableHandle2 = require('./SortableHandle');

var _SortableHandle3 = _interopRequireDefault(_SortableHandle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.SortableContainer = _SortableContainer3.default;
exports.SortableElement = _SortableElement3.default;
exports.SortableHandle = _SortableHandle3.default;
},{"./SortableContainer":60,"./SortableElement":61,"./SortableHandle":62,"./utils":64}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.arrayMove = arrayMove;
exports.closest = closest;
exports.limit = limit;
exports.getElementMargin = getElementMargin;
function arrayMove(arr, previousIndex, newIndex) {
    var array = arr.slice(0);
    if (newIndex >= array.length) {
        var k = newIndex - array.length;
        while (k-- + 1) {
            array.push(undefined);
        }
    }
    array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
    return array;
}

var events = exports.events = {
    start: ['touchstart', 'mousedown'],
    move: ['touchmove', 'mousemove'],
    end: ['touchend', 'touchcancel', 'mouseup']
};

var vendorPrefix = exports.vendorPrefix = function () {
    if (typeof window === 'undefined' || typeof document === 'undefined') return ''; // server environment
    var styles = window.getComputedStyle(document.documentElement, '');
    var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];

    switch (pre) {
        case 'ms':
            return 'ms';
        default:
            return pre && pre.length ? pre[0].toUpperCase() + pre.substr(1) : '';
    }
}();

function closest(el, fn) {
    while (el) {
        if (fn(el)) return el;
        el = el.parentNode;
    }
}

function limit(min, max, value) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}

function getCSSPixelValue(stringValue) {
    if (stringValue.substr(-2) === 'px') {
        return parseFloat(stringValue);
    }
    return 0;
}

function getElementMargin(element) {
    var style = window.getComputedStyle(element);

    return {
        top: getCSSPixelValue(style.marginTop),
        right: getCSSPixelValue(style.marginRight),
        bottom: getCSSPixelValue(style.marginBottom),
        left: getCSSPixelValue(style.marginLeft)
    };
}
},{}],65:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":126,"./_root":163}],66:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":131,"./_hashDelete":132,"./_hashGet":133,"./_hashHas":134,"./_hashSet":135}],67:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":144,"./_listCacheDelete":145,"./_listCacheGet":146,"./_listCacheHas":147,"./_listCacheSet":148}],68:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":126,"./_root":163}],69:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":149,"./_mapCacheDelete":150,"./_mapCacheGet":151,"./_mapCacheHas":152,"./_mapCacheSet":153}],70:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":126,"./_root":163}],71:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":126,"./_root":163}],72:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":69,"./_setCacheAdd":164,"./_setCacheHas":165}],73:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":67,"./_stackClear":169,"./_stackDelete":170,"./_stackGet":171,"./_stackHas":172,"./_stackSet":173}],74:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":163}],75:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":163}],76:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":126,"./_root":163}],77:[function(require,module,exports){
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],78:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":108,"./_isIndex":137,"./isArguments":184,"./isArray":185,"./isBuffer":187,"./isTypedArray":193}],79:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],80:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],81:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],82:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":178}],83:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":87,"./_createBaseEach":116}],84:[function(require,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],85:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"./_arrayPush":80,"./_isFlattenable":136}],86:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":117}],87:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":86,"./keys":194}],88:[function(require,module,exports){
var castPath = require('./_castPath'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_castPath":112,"./_toKey":175}],89:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  value = Object(value);
  return (symToStringTag && symToStringTag in value)
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":74,"./_getRawTag":127,"./_objectToString":160}],90:[function(require,module,exports){
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

},{}],91:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":89,"./isObjectLike":191}],92:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObject = require('./isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":93,"./isObject":190,"./isObjectLike":191}],93:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":73,"./_equalArrays":120,"./_equalByTag":121,"./_equalObjects":122,"./_getTag":128,"./isArray":185,"./isBuffer":187,"./isTypedArray":193}],94:[function(require,module,exports){
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./_Stack":73,"./_baseIsEqual":92}],95:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isMasked":141,"./_toSource":176,"./isFunction":188,"./isObject":190}],96:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":89,"./isLength":189,"./isObjectLike":191}],97:[function(require,module,exports){
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

},{"./_baseMatches":100,"./_baseMatchesProperty":101,"./identity":183,"./isArray":185,"./property":196}],98:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":142,"./_nativeKeys":158}],99:[function(require,module,exports){
var baseEach = require('./_baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

},{"./_baseEach":83,"./isArrayLike":186}],100:[function(require,module,exports){
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

},{"./_baseIsMatch":94,"./_getMatchData":125,"./_matchesStrictComparable":155}],101:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;

},{"./_baseIsEqual":92,"./_isKey":139,"./_isStrictComparable":143,"./_matchesStrictComparable":155,"./_toKey":175,"./get":181,"./hasIn":182}],102:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    baseSortBy = require('./_baseSortBy'),
    baseUnary = require('./_baseUnary'),
    compareMultiple = require('./_compareMultiple'),
    identity = require('./identity');

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

module.exports = baseOrderBy;

},{"./_arrayMap":79,"./_baseIteratee":97,"./_baseMap":99,"./_baseSortBy":107,"./_baseUnary":110,"./_compareMultiple":114,"./identity":183}],103:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],104:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

},{"./_baseGet":88}],105:[function(require,module,exports){
var identity = require('./identity'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;

},{"./_overRest":162,"./_setToString":167,"./identity":183}],106:[function(require,module,exports){
var constant = require('./constant'),
    defineProperty = require('./_defineProperty'),
    identity = require('./identity');

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;

},{"./_defineProperty":119,"./constant":177,"./identity":183}],107:[function(require,module,exports){
/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

module.exports = baseSortBy;

},{}],108:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],109:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    arrayMap = require('./_arrayMap'),
    isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":74,"./_arrayMap":79,"./isArray":185,"./isSymbol":192}],110:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],111:[function(require,module,exports){
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],112:[function(require,module,exports){
var isArray = require('./isArray'),
    isKey = require('./_isKey'),
    stringToPath = require('./_stringToPath'),
    toString = require('./toString');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;

},{"./_isKey":139,"./_stringToPath":174,"./isArray":185,"./toString":202}],113:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

module.exports = compareAscending;

},{"./isSymbol":192}],114:[function(require,module,exports){
var compareAscending = require('./_compareAscending');

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

module.exports = compareMultiple;

},{"./_compareAscending":113}],115:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":163}],116:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":186}],117:[function(require,module,exports){
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],118:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    isArrayLike = require('./isArrayLike'),
    keys = require('./keys');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;

},{"./_baseIteratee":97,"./isArrayLike":186,"./keys":194}],119:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":126}],120:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome'),
    cacheHas = require('./_cacheHas');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":72,"./_arraySome":81,"./_cacheHas":111}],121:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":74,"./_Uint8Array":75,"./_equalArrays":120,"./_mapToArray":154,"./_setToArray":166,"./eq":178}],122:[function(require,module,exports){
var keys = require('./keys');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

},{"./keys":194}],123:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],124:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":140}],125:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;

},{"./_isStrictComparable":143,"./keys":194}],126:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":95,"./_getValue":129}],127:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":74}],128:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":65,"./_Map":68,"./_Promise":70,"./_Set":71,"./_WeakMap":76,"./_baseGetTag":89,"./_toSource":176}],129:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],130:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isLength = require('./isLength'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":112,"./_isIndex":137,"./_toKey":175,"./isArguments":184,"./isArray":185,"./isLength":189}],131:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

},{"./_nativeCreate":157}],132:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

},{}],133:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":157}],134:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":157}],135:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":157}],136:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray');

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;

},{"./_Symbol":74,"./isArguments":184,"./isArray":185}],137:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],138:[function(require,module,exports){
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

},{"./_isIndex":137,"./eq":178,"./isArrayLike":186,"./isObject":190}],139:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

},{"./isArray":185,"./isSymbol":192}],140:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],141:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":115}],142:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],143:[function(require,module,exports){
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"./isObject":190}],144:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

},{}],145:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":82}],146:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":82}],147:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":82}],148:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":82}],149:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":66,"./_ListCache":67,"./_Map":68}],150:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

},{"./_getMapData":124}],151:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":124}],152:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":124}],153:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":124}],154:[function(require,module,exports){
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],155:[function(require,module,exports){
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;

},{}],156:[function(require,module,exports){
var memoize = require('./memoize');

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;

},{"./memoize":195}],157:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":126}],158:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":161}],159:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":123}],160:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],161:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],162:[function(require,module,exports){
var apply = require('./_apply');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;

},{"./_apply":77}],163:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":123}],164:[function(require,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],165:[function(require,module,exports){
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],166:[function(require,module,exports){
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],167:[function(require,module,exports){
var baseSetToString = require('./_baseSetToString'),
    shortOut = require('./_shortOut');

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;

},{"./_baseSetToString":106,"./_shortOut":168}],168:[function(require,module,exports){
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;

},{}],169:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

},{"./_ListCache":67}],170:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

},{}],171:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],172:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],173:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

},{"./_ListCache":67,"./_Map":68,"./_MapCache":69}],174:[function(require,module,exports){
var memoizeCapped = require('./_memoizeCapped');

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./_memoizeCapped":156}],175:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

},{"./isSymbol":192}],176:[function(require,module,exports){
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],177:[function(require,module,exports){
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],178:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],179:[function(require,module,exports){
var createFind = require('./_createFind'),
    findIndex = require('./findIndex');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;

},{"./_createFind":118,"./findIndex":180}],180:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIteratee = require('./_baseIteratee'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;

},{"./_baseFindIndex":84,"./_baseIteratee":97,"./toInteger":200}],181:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":88}],182:[function(require,module,exports){
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

},{"./_baseHasIn":90,"./_hasPath":130}],183:[function(require,module,exports){
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],184:[function(require,module,exports){
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":91,"./isObjectLike":191}],185:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],186:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":188,"./isLength":189}],187:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":163,"./stubFalse":198}],188:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":89,"./isObject":190}],189:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],190:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],191:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],192:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":89,"./isObjectLike":191}],193:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":96,"./_baseUnary":110,"./_nodeUtil":159}],194:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":78,"./_baseKeys":98,"./isArrayLike":186}],195:[function(require,module,exports){
var MapCache = require('./_MapCache');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":69}],196:[function(require,module,exports){
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

},{"./_baseProperty":103,"./_basePropertyDeep":104,"./_isKey":139,"./_toKey":175}],197:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten'),
    baseOrderBy = require('./_baseOrderBy'),
    baseRest = require('./_baseRest'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, [function(o) { return o.user; }]);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 */
var sortBy = baseRest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});

module.exports = sortBy;

},{"./_baseFlatten":85,"./_baseOrderBy":102,"./_baseRest":105,"./_isIterateeCall":138}],198:[function(require,module,exports){
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],199:[function(require,module,exports){
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;

},{"./toNumber":201}],200:[function(require,module,exports){
var toFinite = require('./toFinite');

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;

},{"./toFinite":199}],201:[function(require,module,exports){
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isObject":190,"./isSymbol":192}],202:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":109}],203:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omit2 = require("lodash/omit");

var _omit3 = _interopRequireDefault(_omit2);

var _includes2 = require("lodash/includes");

var _includes3 = _interopRequireDefault(_includes2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactAddonsUpdate = require("react-addons-update");

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _ToastMessage = require("./ToastMessage");

var _ToastMessage2 = _interopRequireDefault(_ToastMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToastContainer = function (_Component) {
  _inherits(ToastContainer, _Component);

  function ToastContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ToastContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ToastContainer.__proto__ || Object.getPrototypeOf(ToastContainer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      toasts: [],
      toastId: 0,
      messageList: []
    }, _this._handle_toast_remove = _this._handle_toast_remove.bind(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ToastContainer, [{
    key: "error",
    value: function error(message, title, optionsOverride) {
      this._notify(this.props.toastType.error, message, title, optionsOverride);
    }
  }, {
    key: "info",
    value: function info(message, title, optionsOverride) {
      this._notify(this.props.toastType.info, message, title, optionsOverride);
    }
  }, {
    key: "success",
    value: function success(message, title, optionsOverride) {
      this._notify(this.props.toastType.success, message, title, optionsOverride);
    }
  }, {
    key: "warning",
    value: function warning(message, title, optionsOverride) {
      this._notify(this.props.toastType.warning, message, title, optionsOverride);
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this2 = this;

      Object.keys(this.refs).forEach(function (key) {
        _this2.refs[key].hideToast(false);
      });
    }
  }, {
    key: "_notify",
    value: function _notify(type, message, title) {
      var _this3 = this;

      var optionsOverride = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      if (this.props.preventDuplicates) {
        if ((0, _includes3.default)(this.state.messageList, message)) {
          return;
        }
      }
      var key = this.state.toastId++;
      var toastId = key;
      var newToast = (0, _reactAddonsUpdate2.default)(optionsOverride, {
        $merge: {
          type: type,
          title: title,
          message: message,
          toastId: toastId,
          key: key,
          ref: "toasts__" + key,
          handleOnClick: function handleOnClick(e) {
            if ("function" === typeof optionsOverride.handleOnClick) {
              optionsOverride.handleOnClick();
            }
            return _this3._handle_toast_on_click(e);
          },
          handleRemove: this._handle_toast_remove
        }
      });
      var toastOperation = _defineProperty({}, "" + (this.props.newestOnTop ? "$unshift" : "$push"), [newToast]);

      var messageOperation = _defineProperty({}, "" + (this.props.newestOnTop ? "$unshift" : "$push"), [message]);

      var nextState = (0, _reactAddonsUpdate2.default)(this.state, {
        toasts: toastOperation,
        messageList: messageOperation
      });
      this.setState(nextState);
    }
  }, {
    key: "_handle_toast_on_click",
    value: function _handle_toast_on_click(event) {
      this.props.onClick(event);
      if (event.defaultPrevented) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    }
  }, {
    key: "_handle_toast_remove",
    value: function _handle_toast_remove(toastId) {
      var _this4 = this;

      if (this.props.preventDuplicates) {
        this.state.previousMessage = "";
      }
      var operationName = "" + (this.props.newestOnTop ? "reduceRight" : "reduce");
      this.state.toasts[operationName](function (found, toast, index) {
        if (found || toast.toastId !== toastId) {
          return false;
        }
        _this4.setState((0, _reactAddonsUpdate2.default)(_this4.state, {
          toasts: { $splice: [[index, 1]] },
          messageList: { $splice: [[index, 1]] }
        }));
        return true;
      }, false);
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var divProps = (0, _omit3.default)(this.props, ["toastType", "toastMessageFactory", "preventDuplicates", "newestOnTop"]);

      return _react2.default.createElement(
        "div",
        _extends({}, divProps, { "aria-live": "polite", role: "alert" }),
        this.state.toasts.map(function (toast) {
          return _this5.props.toastMessageFactory(toast);
        })
      );
    }
  }]);

  return ToastContainer;
}(_react.Component);

ToastContainer.propTypes = {
  toastType: _react.PropTypes.shape({
    error: _react.PropTypes.string,
    info: _react.PropTypes.string,
    success: _react.PropTypes.string,
    warning: _react.PropTypes.string
  }).isRequired,
  id: _react.PropTypes.string.isRequired,
  toastMessageFactory: _react.PropTypes.func.isRequired,
  preventDuplicates: _react.PropTypes.bool.isRequired,
  newestOnTop: _react.PropTypes.bool.isRequired,
  onClick: _react.PropTypes.func.isRequired
};
ToastContainer.defaultProps = {
  toastType: {
    error: "error",
    info: "info",
    success: "success",
    warning: "warning"
  },
  id: "toast-container",
  toastMessageFactory: _react2.default.createFactory(_ToastMessage2.default.animation),
  preventDuplicates: true,
  newestOnTop: true,
  onClick: function onClick() {}
};
exports.default = ToastContainer;
},{"./ToastMessage":205,"lodash/includes":331,"lodash/omit":347,"react":"react","react-addons-update":31}],204:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ReactTransitionEvents = require("react/lib/ReactTransitionEvents");

var _ReactTransitionEvents2 = _interopRequireDefault(_ReactTransitionEvents);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _elementClass = require("element-class");

var _elementClass2 = _interopRequireDefault(_elementClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TICK = 17;
var toString = Object.prototype.toString;
exports.default = {
  getDefaultProps: function getDefaultProps() {
    return {
      transition: null, // some examples defined in index.scss (scale, fadeInOut, rotate)
      showAnimation: "animated bounceIn", // or other animations from animate.css
      hideAnimation: "animated bounceOut",
      timeOut: 5000,
      extendedTimeOut: 1000
    };
  },
  componentWillMount: function componentWillMount() {
    this.classNameQueue = [];
    this.isHiding = false;
    this.intervalId = null;
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    this._is_mounted = true;
    this._show();
    var node = _reactDom2.default.findDOMNode(this);

    var onHideComplete = function onHideComplete() {
      if (_this.isHiding) {
        _this._set_is_hiding(false);
        _ReactTransitionEvents2.default.removeEndEventListener(node, onHideComplete);
        _this._handle_remove();
      }
    };
    _ReactTransitionEvents2.default.addEndEventListener(node, onHideComplete);

    if (this.props.timeOut > 0) {
      this._set_interval_id(setTimeout(this.hideToast, this.props.timeOut));
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this._is_mounted = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }
  },
  _set_transition: function _set_transition(hide) {
    var animationType = hide ? "leave" : "enter";
    var node = _reactDom2.default.findDOMNode(this);
    var className = this.props.transition + "-" + animationType;
    var activeClassName = className + "-active";

    var endListener = function endListener(e) {
      if (e && e.target !== node) {
        return;
      }

      var classList = (0, _elementClass2.default)(node);
      classList.remove(className);
      classList.remove(activeClassName);

      _ReactTransitionEvents2.default.removeEndEventListener(node, endListener);
    };

    _ReactTransitionEvents2.default.addEndEventListener(node, endListener);

    (0, _elementClass2.default)(node).add(className);

    // Need to do this to actually trigger a transition.
    this._queue_class(activeClassName);
  },
  _clear_transition: function _clear_transition(hide) {
    var node = _reactDom2.default.findDOMNode(this);
    var animationType = hide ? "leave" : "enter";
    var className = this.props.transition + "-" + animationType;
    var activeClassName = className + "-active";

    var classList = (0, _elementClass2.default)(node);
    classList.remove(className);
    classList.remove(activeClassName);
  },
  _set_animation: function _set_animation(hide) {
    var node = _reactDom2.default.findDOMNode(this);
    var animations = this._get_animation_classes(hide);
    var endListener = function endListener(e) {
      if (e && e.target !== node) {
        return;
      }

      animations.forEach(function (anim) {
        return (0, _elementClass2.default)(node).remove(anim);
      });

      _ReactTransitionEvents2.default.removeEndEventListener(node, endListener);
    };

    _ReactTransitionEvents2.default.addEndEventListener(node, endListener);

    animations.forEach(function (anim) {
      return (0, _elementClass2.default)(node).add(anim);
    });
  },
  _get_animation_classes: function _get_animation_classes(hide) {
    var animations = hide ? this.props.hideAnimation : this.props.showAnimation;
    if ("[object Array]" === toString.call(animations)) {
      return animations;
    } else if ("string" === typeof animations) {
      return animations.split(" ");
    }
  },
  _clear_animation: function _clear_animation(hide) {
    var node = _reactDom2.default.findDOMNode(this);
    var animations = this._get_animation_classes(hide);
    animations.forEach(function (animation) {
      return (0, _elementClass2.default)(node).remove(animation);
    });
  },
  _queue_class: function _queue_class(className) {
    this.classNameQueue.push(className);

    if (!this.timeout) {
      this.timeout = setTimeout(this._flush_class_name_queue, TICK);
    }
  },
  _flush_class_name_queue: function _flush_class_name_queue() {
    var _this2 = this;

    if (this._is_mounted) {
      (function () {
        var node = _reactDom2.default.findDOMNode(_this2);
        _this2.classNameQueue.forEach(function (className) {
          return (0, _elementClass2.default)(node).add(className);
        });
      })();
    }
    this.classNameQueue.length = 0;
    this.timeout = null;
  },
  _show: function _show() {
    if (this.props.transition) {
      this._set_transition();
    } else if (this.props.showAnimation) {
      this._set_animation();
    }
  },
  handleMouseEnter: function handleMouseEnter() {
    clearTimeout(this.intervalId);
    this._set_interval_id(null);
    if (this.isHiding) {
      this._set_is_hiding(false);

      if (this.props.hideAnimation) {
        this._clear_animation(true);
      } else if (this.props.transition) {
        this._clear_transition(true);
      }
    }
  },
  handleMouseLeave: function handleMouseLeave() {
    if (!this.isHiding && (this.props.timeOut > 0 || this.props.extendedTimeOut > 0)) {
      this._set_interval_id(setTimeout(this.hideToast, this.props.extendedTimeOut));
    }
  },
  hideToast: function hideToast(override) {
    if (this.isHiding || this.intervalId === null && !override) {
      return;
    }

    this._set_is_hiding(true);
    if (this.props.transition) {
      this._set_transition(true);
    } else if (this.props.hideAnimation) {
      this._set_animation(true);
    } else {
      this._handle_remove();
    }
  },
  _set_interval_id: function _set_interval_id(intervalId) {
    this.intervalId = intervalId;
  },
  _set_is_hiding: function _set_is_hiding(isHiding) {
    this.isHiding = isHiding;
  }
};
},{"element-class":2,"react-dom":"react-dom","react/lib/ReactTransitionEvents":355}],205:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jQuery = exports.animation = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactAddonsUpdate = require("react-addons-update");

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _animationMixin = require("./animationMixin");

var _animationMixin2 = _interopRequireDefault(_animationMixin);

var _jQueryMixin = require("./jQueryMixin");

var _jQueryMixin2 = _interopRequireDefault(_jQueryMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}

var ToastMessageSpec = {
  displayName: "ToastMessage",

  getDefaultProps: function getDefaultProps() {
    var iconClassNames = {
      error: "toast-error",
      info: "toast-info",
      success: "toast-success",
      warning: "toast-warning"
    };

    return {
      className: "toast",
      iconClassNames: iconClassNames,
      titleClassName: "toast-title",
      messageClassName: "toast-message",
      tapToDismiss: true,
      closeButton: false
    };
  },
  handleOnClick: function handleOnClick(event) {
    this.props.handleOnClick(event);
    if (this.props.tapToDismiss) {
      this.hideToast(true);
    }
  },
  _handle_close_button_click: function _handle_close_button_click(event) {
    event.stopPropagation();
    this.hideToast(true);
  },
  _handle_remove: function _handle_remove() {
    this.props.handleRemove(this.props.toastId);
  },
  _render_close_button: function _render_close_button() {
    return this.props.closeButton ? _react2.default.createElement("button", {
      className: "toast-close-button", role: "button",
      onClick: this._handle_close_button_click,
      dangerouslySetInnerHTML: { __html: "&times;" }
    }) : false;
  },
  _render_title_element: function _render_title_element() {
    return this.props.title ? _react2.default.createElement(
      "div",
      { className: this.props.titleClassName },
      this.props.title
    ) : false;
  },
  _render_message_element: function _render_message_element() {
    return this.props.message ? _react2.default.createElement(
      "div",
      { className: this.props.messageClassName },
      this.props.message
    ) : false;
  },
  render: function render() {
    var iconClassName = this.props.iconClassName || this.props.iconClassNames[this.props.type];

    return _react2.default.createElement(
      "div",
      {
        className: (0, _classnames2.default)(this.props.className, iconClassName),
        style: this.props.style,
        onClick: this.handleOnClick,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave
      },
      this._render_close_button(),
      this._render_title_element(),
      this._render_message_element()
    );
  }
};

var animation = exports.animation = _react2.default.createClass((0, _reactAddonsUpdate2.default)(ToastMessageSpec, {
  displayName: { $set: "ToastMessage.animation" },
  mixins: { $set: [_animationMixin2.default] }
}));

var jQuery = exports.jQuery = _react2.default.createClass((0, _reactAddonsUpdate2.default)(ToastMessageSpec, {
  displayName: { $set: "ToastMessage.jQuery" },
  mixins: { $set: [_jQueryMixin2.default] }
}));

/*
 * assign default noop functions
 */
ToastMessageSpec.handleMouseEnter = noop;
ToastMessageSpec.handleMouseLeave = noop;
ToastMessageSpec.hideToast = noop;

var ToastMessage = _react2.default.createClass(ToastMessageSpec);

ToastMessage.animation = animation;
ToastMessage.jQuery = jQuery;

exports.default = ToastMessage;
},{"./animationMixin":204,"./jQueryMixin":206,"classnames":1,"react":"react","react-addons-update":31}],206:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function call_show_method($node, props) {
  $node[props.showMethod]({
    duration: props.showDuration,
    easing: props.showEasing
  });
}

exports.default = {
  getDefaultProps: function getDefaultProps() {
    return {
      style: {
        display: "none" },
      showMethod: "fadeIn", // slideDown, and show are built into jQuery
      showDuration: 300,
      showEasing: "swing", // and linear are built into jQuery
      hideMethod: "fadeOut",
      hideDuration: 1000,
      hideEasing: "swing",
      //
      timeOut: 5000,
      extendedTimeOut: 1000
    };
  },
  getInitialState: function getInitialState() {
    return {
      intervalId: null,
      isHiding: false
    };
  },
  componentDidMount: function componentDidMount() {
    call_show_method(this._get_$_node(), this.props);
    if (this.props.timeOut > 0) {
      this._set_interval_id(setTimeout(this.hideToast, this.props.timeOut));
    }
  },
  handleMouseEnter: function handleMouseEnter() {
    clearTimeout(this.state.intervalId);
    this._set_interval_id(null);
    this._set_is_hiding(false);

    call_show_method(this._get_$_node().stop(true, true), this.props);
  },
  handleMouseLeave: function handleMouseLeave() {
    if (!this.state.isHiding && (this.props.timeOut > 0 || this.props.extendedTimeOut > 0)) {
      this._set_interval_id(setTimeout(this.hideToast, this.props.extendedTimeOut));
    }
  },
  hideToast: function hideToast(override) {
    if (this.state.isHiding || this.state.intervalId === null && !override) {
      return;
    }
    this.setState({ isHiding: true });

    this._get_$_node()[this.props.hideMethod]({
      duration: this.props.hideDuration,
      easing: this.props.hideEasing,
      complete: this._handle_remove
    });
  },
  _get_$_node: function _get_$_node() {
    /* eslint-disable no-undef */
    return jQuery(_reactDom2.default.findDOMNode(this));
    /* eslint-enable no-undef */
  },
  _set_interval_id: function _set_interval_id(intervalId) {
    this.setState({
      intervalId: intervalId
    });
  },
  _set_is_hiding: function _set_is_hiding(isHiding) {
    this.setState({
      isHiding: isHiding
    });
  }
};
},{"react-dom":"react-dom"}],207:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToastMessage = exports.ToastContainer = undefined;

var _ToastContainer = require("./ToastContainer");

var _ToastContainer2 = _interopRequireDefault(_ToastContainer);

var _ToastMessage = require("./ToastMessage");

var _ToastMessage2 = _interopRequireDefault(_ToastMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ToastContainer = _ToastContainer2.default;
exports.ToastMessage = _ToastMessage2.default;
},{"./ToastContainer":203,"./ToastMessage":205}],208:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"./_getNative":273,"./_root":314,"dup":65}],209:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./_hashClear":280,"./_hashDelete":281,"./_hashGet":282,"./_hashHas":283,"./_hashSet":284,"dup":66}],210:[function(require,module,exports){
arguments[4][67][0].apply(exports,arguments)
},{"./_listCacheClear":294,"./_listCacheDelete":295,"./_listCacheGet":296,"./_listCacheHas":297,"./_listCacheSet":298,"dup":67}],211:[function(require,module,exports){
arguments[4][68][0].apply(exports,arguments)
},{"./_getNative":273,"./_root":314,"dup":68}],212:[function(require,module,exports){
arguments[4][69][0].apply(exports,arguments)
},{"./_mapCacheClear":299,"./_mapCacheDelete":300,"./_mapCacheGet":301,"./_mapCacheHas":302,"./_mapCacheSet":303,"dup":69}],213:[function(require,module,exports){
arguments[4][70][0].apply(exports,arguments)
},{"./_getNative":273,"./_root":314,"dup":70}],214:[function(require,module,exports){
arguments[4][71][0].apply(exports,arguments)
},{"./_getNative":273,"./_root":314,"dup":71}],215:[function(require,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"./_ListCache":210,"./_stackClear":318,"./_stackDelete":319,"./_stackGet":320,"./_stackHas":321,"./_stackSet":322,"dup":73}],216:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"./_root":314,"dup":74}],217:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"./_root":314,"dup":75}],218:[function(require,module,exports){
arguments[4][76][0].apply(exports,arguments)
},{"./_getNative":273,"./_root":314,"dup":76}],219:[function(require,module,exports){
/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;

},{}],220:[function(require,module,exports){
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

module.exports = addSetEntry;

},{}],221:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"dup":77}],222:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],223:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"./_baseTimes":248,"./_isIndex":289,"./isArguments":332,"./isArray":333,"./isBuffer":335,"./isTypedArray":342,"dup":78}],224:[function(require,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"dup":79}],225:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"dup":80}],226:[function(require,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],227:[function(require,module,exports){
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

},{"./_baseAssignValue":231,"./eq":328}],228:[function(require,module,exports){
arguments[4][82][0].apply(exports,arguments)
},{"./eq":328,"dup":82}],229:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":263,"./keys":343}],230:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;

},{"./_copyObject":263,"./keysIn":344}],231:[function(require,module,exports){
var defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

},{"./_defineProperty":267}],232:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    baseAssignIn = require('./_baseAssignIn'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    copySymbolsIn = require('./_copySymbolsIn'),
    getAllKeys = require('./_getAllKeys'),
    getAllKeysIn = require('./_getAllKeysIn'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isObject = require('./isObject'),
    keys = require('./keys');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":215,"./_arrayEach":222,"./_assignValue":227,"./_baseAssign":229,"./_baseAssignIn":230,"./_cloneBuffer":255,"./_copyArray":262,"./_copySymbols":264,"./_copySymbolsIn":265,"./_getAllKeys":270,"./_getAllKeysIn":271,"./_getTag":278,"./_initCloneArray":285,"./_initCloneByTag":286,"./_initCloneObject":287,"./isArray":333,"./isBuffer":335,"./isObject":338,"./keys":343}],233:[function(require,module,exports){
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;

},{"./isObject":338}],234:[function(require,module,exports){
arguments[4][84][0].apply(exports,arguments)
},{"dup":84}],235:[function(require,module,exports){
arguments[4][85][0].apply(exports,arguments)
},{"./_arrayPush":225,"./_isFlattenable":288,"dup":85}],236:[function(require,module,exports){
arguments[4][88][0].apply(exports,arguments)
},{"./_castPath":253,"./_toKey":325,"dup":88}],237:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":225,"./isArray":333}],238:[function(require,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"./_Symbol":216,"./_getRawTag":275,"./_objectToString":310,"dup":89}],239:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIsNaN = require('./_baseIsNaN'),
    strictIndexOf = require('./_strictIndexOf');

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;

},{"./_baseFindIndex":234,"./_baseIsNaN":241,"./_strictIndexOf":323}],240:[function(require,module,exports){
arguments[4][91][0].apply(exports,arguments)
},{"./_baseGetTag":238,"./isObjectLike":339,"dup":91}],241:[function(require,module,exports){
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;

},{}],242:[function(require,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"./_isMasked":292,"./_toSource":326,"./isFunction":336,"./isObject":338,"dup":95}],243:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./_baseGetTag":238,"./isLength":337,"./isObjectLike":339,"dup":96}],244:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"./_isPrototype":293,"./_nativeKeys":307,"dup":98}],245:[function(require,module,exports){
var isObject = require('./isObject'),
    isPrototype = require('./_isPrototype'),
    nativeKeysIn = require('./_nativeKeysIn');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;

},{"./_isPrototype":293,"./_nativeKeysIn":308,"./isObject":338}],246:[function(require,module,exports){
arguments[4][106][0].apply(exports,arguments)
},{"./_defineProperty":267,"./constant":327,"./identity":330,"dup":106}],247:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],248:[function(require,module,exports){
arguments[4][108][0].apply(exports,arguments)
},{"dup":108}],249:[function(require,module,exports){
arguments[4][109][0].apply(exports,arguments)
},{"./_Symbol":216,"./_arrayMap":224,"./isArray":333,"./isSymbol":341,"dup":109}],250:[function(require,module,exports){
arguments[4][110][0].apply(exports,arguments)
},{"dup":110}],251:[function(require,module,exports){
var castPath = require('./_castPath'),
    last = require('./last'),
    parent = require('./_parent'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

module.exports = baseUnset;

},{"./_castPath":253,"./_parent":313,"./_toKey":325,"./last":345}],252:[function(require,module,exports){
var arrayMap = require('./_arrayMap');

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;

},{"./_arrayMap":224}],253:[function(require,module,exports){
arguments[4][112][0].apply(exports,arguments)
},{"./_isKey":290,"./_stringToPath":324,"./isArray":333,"./toString":353,"dup":112}],254:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":217}],255:[function(require,module,exports){
var root = require('./_root');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{"./_root":314}],256:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":254}],257:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;

},{"./_addMapEntry":219,"./_arrayReduce":226,"./_mapToArray":304}],258:[function(require,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],259:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;

},{"./_addSetEntry":220,"./_arrayReduce":226,"./_setToArray":315}],260:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":216}],261:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":254}],262:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],263:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    baseAssignValue = require('./_baseAssignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":227,"./_baseAssignValue":231}],264:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":263,"./_getSymbols":276}],265:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbolsIn = require('./_getSymbolsIn');

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;

},{"./_copyObject":263,"./_getSymbolsIn":277}],266:[function(require,module,exports){
arguments[4][115][0].apply(exports,arguments)
},{"./_root":314,"dup":115}],267:[function(require,module,exports){
arguments[4][119][0].apply(exports,arguments)
},{"./_getNative":273,"dup":119}],268:[function(require,module,exports){
var flatten = require('./flatten'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;

},{"./_overRest":312,"./_setToString":316,"./flatten":329}],269:[function(require,module,exports){
arguments[4][123][0].apply(exports,arguments)
},{"dup":123}],270:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":237,"./_getSymbols":276,"./keys":343}],271:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbolsIn = require('./_getSymbolsIn'),
    keysIn = require('./keysIn');

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;

},{"./_baseGetAllKeys":237,"./_getSymbolsIn":277,"./keysIn":344}],272:[function(require,module,exports){
arguments[4][124][0].apply(exports,arguments)
},{"./_isKeyable":291,"dup":124}],273:[function(require,module,exports){
arguments[4][126][0].apply(exports,arguments)
},{"./_baseIsNative":242,"./_getValue":279,"dup":126}],274:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":311}],275:[function(require,module,exports){
arguments[4][127][0].apply(exports,arguments)
},{"./_Symbol":216,"dup":127}],276:[function(require,module,exports){
var overArg = require('./_overArg'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

module.exports = getSymbols;

},{"./_overArg":311,"./stubArray":348}],277:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;

},{"./_arrayPush":225,"./_getPrototype":274,"./_getSymbols":276,"./stubArray":348}],278:[function(require,module,exports){
arguments[4][128][0].apply(exports,arguments)
},{"./_DataView":208,"./_Map":211,"./_Promise":213,"./_Set":214,"./_WeakMap":218,"./_baseGetTag":238,"./_toSource":326,"dup":128}],279:[function(require,module,exports){
arguments[4][129][0].apply(exports,arguments)
},{"dup":129}],280:[function(require,module,exports){
arguments[4][131][0].apply(exports,arguments)
},{"./_nativeCreate":306,"dup":131}],281:[function(require,module,exports){
arguments[4][132][0].apply(exports,arguments)
},{"dup":132}],282:[function(require,module,exports){
arguments[4][133][0].apply(exports,arguments)
},{"./_nativeCreate":306,"dup":133}],283:[function(require,module,exports){
arguments[4][134][0].apply(exports,arguments)
},{"./_nativeCreate":306,"dup":134}],284:[function(require,module,exports){
arguments[4][135][0].apply(exports,arguments)
},{"./_nativeCreate":306,"dup":135}],285:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],286:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":254,"./_cloneDataView":256,"./_cloneMap":257,"./_cloneRegExp":258,"./_cloneSet":259,"./_cloneSymbol":260,"./_cloneTypedArray":261}],287:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":233,"./_getPrototype":274,"./_isPrototype":293}],288:[function(require,module,exports){
arguments[4][136][0].apply(exports,arguments)
},{"./_Symbol":216,"./isArguments":332,"./isArray":333,"dup":136}],289:[function(require,module,exports){
arguments[4][137][0].apply(exports,arguments)
},{"dup":137}],290:[function(require,module,exports){
arguments[4][139][0].apply(exports,arguments)
},{"./isArray":333,"./isSymbol":341,"dup":139}],291:[function(require,module,exports){
arguments[4][140][0].apply(exports,arguments)
},{"dup":140}],292:[function(require,module,exports){
arguments[4][141][0].apply(exports,arguments)
},{"./_coreJsData":266,"dup":141}],293:[function(require,module,exports){
arguments[4][142][0].apply(exports,arguments)
},{"dup":142}],294:[function(require,module,exports){
arguments[4][144][0].apply(exports,arguments)
},{"dup":144}],295:[function(require,module,exports){
arguments[4][145][0].apply(exports,arguments)
},{"./_assocIndexOf":228,"dup":145}],296:[function(require,module,exports){
arguments[4][146][0].apply(exports,arguments)
},{"./_assocIndexOf":228,"dup":146}],297:[function(require,module,exports){
arguments[4][147][0].apply(exports,arguments)
},{"./_assocIndexOf":228,"dup":147}],298:[function(require,module,exports){
arguments[4][148][0].apply(exports,arguments)
},{"./_assocIndexOf":228,"dup":148}],299:[function(require,module,exports){
arguments[4][149][0].apply(exports,arguments)
},{"./_Hash":209,"./_ListCache":210,"./_Map":211,"dup":149}],300:[function(require,module,exports){
arguments[4][150][0].apply(exports,arguments)
},{"./_getMapData":272,"dup":150}],301:[function(require,module,exports){
arguments[4][151][0].apply(exports,arguments)
},{"./_getMapData":272,"dup":151}],302:[function(require,module,exports){
arguments[4][152][0].apply(exports,arguments)
},{"./_getMapData":272,"dup":152}],303:[function(require,module,exports){
arguments[4][153][0].apply(exports,arguments)
},{"./_getMapData":272,"dup":153}],304:[function(require,module,exports){
arguments[4][154][0].apply(exports,arguments)
},{"dup":154}],305:[function(require,module,exports){
arguments[4][156][0].apply(exports,arguments)
},{"./memoize":346,"dup":156}],306:[function(require,module,exports){
arguments[4][157][0].apply(exports,arguments)
},{"./_getNative":273,"dup":157}],307:[function(require,module,exports){
arguments[4][158][0].apply(exports,arguments)
},{"./_overArg":311,"dup":158}],308:[function(require,module,exports){
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;

},{}],309:[function(require,module,exports){
arguments[4][159][0].apply(exports,arguments)
},{"./_freeGlobal":269,"dup":159}],310:[function(require,module,exports){
arguments[4][160][0].apply(exports,arguments)
},{"dup":160}],311:[function(require,module,exports){
arguments[4][161][0].apply(exports,arguments)
},{"dup":161}],312:[function(require,module,exports){
arguments[4][162][0].apply(exports,arguments)
},{"./_apply":221,"dup":162}],313:[function(require,module,exports){
var baseGet = require('./_baseGet'),
    baseSlice = require('./_baseSlice');

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;

},{"./_baseGet":236,"./_baseSlice":247}],314:[function(require,module,exports){
arguments[4][163][0].apply(exports,arguments)
},{"./_freeGlobal":269,"dup":163}],315:[function(require,module,exports){
arguments[4][166][0].apply(exports,arguments)
},{"dup":166}],316:[function(require,module,exports){
arguments[4][167][0].apply(exports,arguments)
},{"./_baseSetToString":246,"./_shortOut":317,"dup":167}],317:[function(require,module,exports){
arguments[4][168][0].apply(exports,arguments)
},{"dup":168}],318:[function(require,module,exports){
arguments[4][169][0].apply(exports,arguments)
},{"./_ListCache":210,"dup":169}],319:[function(require,module,exports){
arguments[4][170][0].apply(exports,arguments)
},{"dup":170}],320:[function(require,module,exports){
arguments[4][171][0].apply(exports,arguments)
},{"dup":171}],321:[function(require,module,exports){
arguments[4][172][0].apply(exports,arguments)
},{"dup":172}],322:[function(require,module,exports){
arguments[4][173][0].apply(exports,arguments)
},{"./_ListCache":210,"./_Map":211,"./_MapCache":212,"dup":173}],323:[function(require,module,exports){
/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;

},{}],324:[function(require,module,exports){
arguments[4][174][0].apply(exports,arguments)
},{"./_memoizeCapped":305,"dup":174}],325:[function(require,module,exports){
arguments[4][175][0].apply(exports,arguments)
},{"./isSymbol":341,"dup":175}],326:[function(require,module,exports){
arguments[4][176][0].apply(exports,arguments)
},{"dup":176}],327:[function(require,module,exports){
arguments[4][177][0].apply(exports,arguments)
},{"dup":177}],328:[function(require,module,exports){
arguments[4][178][0].apply(exports,arguments)
},{"dup":178}],329:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten');

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;

},{"./_baseFlatten":235}],330:[function(require,module,exports){
arguments[4][183][0].apply(exports,arguments)
},{"dup":183}],331:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    toInteger = require('./toInteger'),
    values = require('./values');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

module.exports = includes;

},{"./_baseIndexOf":239,"./isArrayLike":334,"./isString":340,"./toInteger":351,"./values":354}],332:[function(require,module,exports){
arguments[4][184][0].apply(exports,arguments)
},{"./_baseIsArguments":240,"./isObjectLike":339,"dup":184}],333:[function(require,module,exports){
arguments[4][185][0].apply(exports,arguments)
},{"dup":185}],334:[function(require,module,exports){
arguments[4][186][0].apply(exports,arguments)
},{"./isFunction":336,"./isLength":337,"dup":186}],335:[function(require,module,exports){
arguments[4][187][0].apply(exports,arguments)
},{"./_root":314,"./stubFalse":349,"dup":187}],336:[function(require,module,exports){
arguments[4][188][0].apply(exports,arguments)
},{"./_baseGetTag":238,"./isObject":338,"dup":188}],337:[function(require,module,exports){
arguments[4][189][0].apply(exports,arguments)
},{"dup":189}],338:[function(require,module,exports){
arguments[4][190][0].apply(exports,arguments)
},{"dup":190}],339:[function(require,module,exports){
arguments[4][191][0].apply(exports,arguments)
},{"dup":191}],340:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;

},{"./_baseGetTag":238,"./isArray":333,"./isObjectLike":339}],341:[function(require,module,exports){
arguments[4][192][0].apply(exports,arguments)
},{"./_baseGetTag":238,"./isObjectLike":339,"dup":192}],342:[function(require,module,exports){
arguments[4][193][0].apply(exports,arguments)
},{"./_baseIsTypedArray":243,"./_baseUnary":250,"./_nodeUtil":309,"dup":193}],343:[function(require,module,exports){
arguments[4][194][0].apply(exports,arguments)
},{"./_arrayLikeKeys":223,"./_baseKeys":244,"./isArrayLike":334,"dup":194}],344:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeysIn = require('./_baseKeysIn'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

},{"./_arrayLikeKeys":223,"./_baseKeysIn":245,"./isArrayLike":334}],345:[function(require,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],346:[function(require,module,exports){
arguments[4][195][0].apply(exports,arguments)
},{"./_MapCache":212,"dup":195}],347:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseClone = require('./_baseClone'),
    baseUnset = require('./_baseUnset'),
    castPath = require('./_castPath'),
    copyObject = require('./_copyObject'),
    flatRest = require('./_flatRest'),
    getAllKeysIn = require('./_getAllKeysIn');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

module.exports = omit;

},{"./_arrayMap":224,"./_baseClone":232,"./_baseUnset":251,"./_castPath":253,"./_copyObject":263,"./_flatRest":268,"./_getAllKeysIn":271}],348:[function(require,module,exports){
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],349:[function(require,module,exports){
arguments[4][198][0].apply(exports,arguments)
},{"dup":198}],350:[function(require,module,exports){
arguments[4][199][0].apply(exports,arguments)
},{"./toNumber":352,"dup":199}],351:[function(require,module,exports){
arguments[4][200][0].apply(exports,arguments)
},{"./toFinite":350,"dup":200}],352:[function(require,module,exports){
arguments[4][201][0].apply(exports,arguments)
},{"./isObject":338,"./isSymbol":341,"dup":201}],353:[function(require,module,exports){
arguments[4][202][0].apply(exports,arguments)
},{"./_baseToString":249,"dup":202}],354:[function(require,module,exports){
var baseValues = require('./_baseValues'),
    keys = require('./keys');

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;

},{"./_baseValues":252,"./keys":343}],355:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactTransitionEvents
 */

'use strict';

var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var getVendorPrefixedEventName = require('./getVendorPrefixedEventName');

var endEvents = [];

function detectEvents() {
  var animEnd = getVendorPrefixedEventName('animationend');
  var transEnd = getVendorPrefixedEventName('transitionend');

  if (animEnd) {
    endEvents.push(animEnd);
  }

  if (transEnd) {
    endEvents.push(transEnd);
  }
}

if (ExecutionEnvironment.canUseDOM) {
  detectEvents();
}

// We use the raw {add|remove}EventListener() call because EventListener
// does not know how to remove event listeners and we really should
// clean up. Also, these events are not triggered in older browsers
// so we should be A-OK here.

function addEventListener(node, eventName, eventListener) {
  node.addEventListener(eventName, eventListener, false);
}

function removeEventListener(node, eventName, eventListener) {
  node.removeEventListener(eventName, eventListener, false);
}

var ReactTransitionEvents = {
  addEndEventListener: function (node, eventListener) {
    if (endEvents.length === 0) {
      // If CSS transitions are not supported, trigger an "end animation"
      // event immediately.
      window.setTimeout(eventListener, 0);
      return;
    }
    endEvents.forEach(function (endEvent) {
      addEventListener(node, endEvent, eventListener);
    });
  },

  removeEndEventListener: function (node, eventListener) {
    if (endEvents.length === 0) {
      return;
    }
    endEvents.forEach(function (endEvent) {
      removeEventListener(node, endEvent, eventListener);
    });
  }
};

module.exports = ReactTransitionEvents;
},{"./getVendorPrefixedEventName":356,"fbjs/lib/ExecutionEnvironment":3}],356:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getVendorPrefixedEventName
 */

'use strict';

var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

/**
 * Generate a mapping of standard vendor prefixes using the defined style property and event name.
 *
 * @param {string} styleProp
 * @param {string} eventName
 * @returns {object}
 */
function makePrefixMap(styleProp, eventName) {
  var prefixes = {};

  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes['Webkit' + styleProp] = 'webkit' + eventName;
  prefixes['Moz' + styleProp] = 'moz' + eventName;
  prefixes['ms' + styleProp] = 'MS' + eventName;
  prefixes['O' + styleProp] = 'o' + eventName.toLowerCase();

  return prefixes;
}

/**
 * A list of event names to a configurable list of vendor prefixes.
 */
var vendorPrefixes = {
  animationend: makePrefixMap('Animation', 'AnimationEnd'),
  animationiteration: makePrefixMap('Animation', 'AnimationIteration'),
  animationstart: makePrefixMap('Animation', 'AnimationStart'),
  transitionend: makePrefixMap('Transition', 'TransitionEnd')
};

/**
 * Event names that have already been detected and prefixed (if applicable).
 */
var prefixedEventNames = {};

/**
 * Element to check for prefixes on.
 */
var style = {};

/**
 * Bootstrap if a DOM exists.
 */
if (ExecutionEnvironment.canUseDOM) {
  style = document.createElement('div').style;

  // On some platforms, in particular some releases of Android 4.x,
  // the un-prefixed "animation" and "transition" properties are defined on the
  // style object but the events that fire will still be prefixed, so we need
  // to check if the un-prefixed events are usable, and if not remove them from the map.
  if (!('AnimationEvent' in window)) {
    delete vendorPrefixes.animationend.animation;
    delete vendorPrefixes.animationiteration.animation;
    delete vendorPrefixes.animationstart.animation;
  }

  // Same as above
  if (!('TransitionEvent' in window)) {
    delete vendorPrefixes.transitionend.transition;
  }
}

/**
 * Attempts to determine the correct vendor prefixed event name.
 *
 * @param {string} eventName
 * @returns {string}
 */
function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  } else if (!vendorPrefixes[eventName]) {
    return eventName;
  }

  var prefixMap = vendorPrefixes[eventName];

  for (var styleProp in prefixMap) {
    if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
      return prefixedEventNames[eventName] = prefixMap[styleProp];
    }
  }

  return '';
}

module.exports = getVendorPrefixedEventName;
},{"fbjs/lib/ExecutionEnvironment":3}],357:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule update
 */

/* global hasOwnProperty:true */

'use strict';

var _assign = require('object-assign');

var keyOf = require('fbjs/lib/keyOf');
var invariant = require('fbjs/lib/invariant');
var hasOwnProperty = {}.hasOwnProperty;

function shallowCopy(x) {
  if (Array.isArray(x)) {
    return x.concat();
  } else if (x && typeof x === 'object') {
    return _assign(new x.constructor(), x);
  } else {
    return x;
  }
}

var COMMAND_PUSH = keyOf({ $push: null });
var COMMAND_UNSHIFT = keyOf({ $unshift: null });
var COMMAND_SPLICE = keyOf({ $splice: null });
var COMMAND_SET = keyOf({ $set: null });
var COMMAND_MERGE = keyOf({ $merge: null });
var COMMAND_APPLY = keyOf({ $apply: null });

var ALL_COMMANDS_LIST = [COMMAND_PUSH, COMMAND_UNSHIFT, COMMAND_SPLICE, COMMAND_SET, COMMAND_MERGE, COMMAND_APPLY];

var ALL_COMMANDS_SET = {};

ALL_COMMANDS_LIST.forEach(function (command) {
  ALL_COMMANDS_SET[command] = true;
});

function invariantArrayCase(value, spec, command) {
  !Array.isArray(value) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected target of %s to be an array; got %s.', command, value) : invariant(false) : void 0;
  var specValue = spec[command];
  !Array.isArray(specValue) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array; got %s. ' + 'Did you forget to wrap your parameter in an array?', command, specValue) : invariant(false) : void 0;
}

function update(value, spec) {
  !(typeof spec === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): You provided a key path to update() that did not contain one ' + 'of %s. Did you forget to include {%s: ...}?', ALL_COMMANDS_LIST.join(', '), COMMAND_SET) : invariant(false) : void 0;

  if (hasOwnProperty.call(spec, COMMAND_SET)) {
    !(Object.keys(spec).length === 1) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot have more than one key in an object with %s', COMMAND_SET) : invariant(false) : void 0;

    return spec[COMMAND_SET];
  }

  var nextValue = shallowCopy(value);

  if (hasOwnProperty.call(spec, COMMAND_MERGE)) {
    var mergeObj = spec[COMMAND_MERGE];
    !(mergeObj && typeof mergeObj === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): %s expects a spec of type \'object\'; got %s', COMMAND_MERGE, mergeObj) : invariant(false) : void 0;
    !(nextValue && typeof nextValue === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): %s expects a target of type \'object\'; got %s', COMMAND_MERGE, nextValue) : invariant(false) : void 0;
    _assign(nextValue, spec[COMMAND_MERGE]);
  }

  if (hasOwnProperty.call(spec, COMMAND_PUSH)) {
    invariantArrayCase(value, spec, COMMAND_PUSH);
    spec[COMMAND_PUSH].forEach(function (item) {
      nextValue.push(item);
    });
  }

  if (hasOwnProperty.call(spec, COMMAND_UNSHIFT)) {
    invariantArrayCase(value, spec, COMMAND_UNSHIFT);
    spec[COMMAND_UNSHIFT].forEach(function (item) {
      nextValue.unshift(item);
    });
  }

  if (hasOwnProperty.call(spec, COMMAND_SPLICE)) {
    !Array.isArray(value) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected %s target to be an array; got %s', COMMAND_SPLICE, value) : invariant(false) : void 0;
    !Array.isArray(spec[COMMAND_SPLICE]) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array of arrays; got %s. ' + 'Did you forget to wrap your parameters in an array?', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : invariant(false) : void 0;
    spec[COMMAND_SPLICE].forEach(function (args) {
      !Array.isArray(args) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be an array of arrays; got %s. ' + 'Did you forget to wrap your parameters in an array?', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : invariant(false) : void 0;
      nextValue.splice.apply(nextValue, args);
    });
  }

  if (hasOwnProperty.call(spec, COMMAND_APPLY)) {
    !(typeof spec[COMMAND_APPLY] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'update(): expected spec of %s to be a function; got %s.', COMMAND_APPLY, spec[COMMAND_APPLY]) : invariant(false) : void 0;
    nextValue = spec[COMMAND_APPLY](nextValue);
  }

  for (var k in spec) {
    if (!(ALL_COMMANDS_SET.hasOwnProperty(k) && ALL_COMMANDS_SET[k])) {
      nextValue[k] = update(value[k], spec[k]);
    }
  }

  return nextValue;
}

module.exports = update;
}).call(this,require('_process'))
},{"_process":7,"fbjs/lib/invariant":4,"fbjs/lib/keyOf":5,"object-assign":28}],358:[function(require,module,exports){
'use strict';
module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};

},{}],359:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

if (process.env.NODE_ENV !== 'production') {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))
},{"_process":7}],360:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESET_SAVE_GEARMAP = exports.SAVE_GEARMAP_FAILURE = exports.SAVE_GEARMAP_SUCCESS = exports.SAVE_GEARMAP = exports.RESET_GEARMAP = exports.FETCH_GEARMAP_FAILURE = exports.FETCH_GEARMAP_SUCCESS = exports.FETCH_GEARMAP = undefined;
exports.fetchGearmap = fetchGearmap;
exports.fetchGearmapSuccess = fetchGearmapSuccess;
exports.fetchGearmapFailure = fetchGearmapFailure;
exports.saveGearmap = saveGearmap;
exports.saveGearmapSuccess = saveGearmapSuccess;
exports.saveGearmapFailure = saveGearmapFailure;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('../config.const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Infowin list
var FETCH_GEARMAP = exports.FETCH_GEARMAP = 'FETCH_GEARMAP';
var FETCH_GEARMAP_SUCCESS = exports.FETCH_GEARMAP_SUCCESS = 'FETCH_GEARMAP_SUCCESS';
var FETCH_GEARMAP_FAILURE = exports.FETCH_GEARMAP_FAILURE = 'FETCH_GEARMAP_FAILURE';
var RESET_GEARMAP = exports.RESET_GEARMAP = 'RESET_GEARMAP';

//Infowin save order
var SAVE_GEARMAP = exports.SAVE_GEARMAP = 'SAVE_GEARMAP';
var SAVE_GEARMAP_SUCCESS = exports.SAVE_GEARMAP_SUCCESS = 'SAVE_GEARMAP_SUCCESS';
var SAVE_GEARMAP_FAILURE = exports.SAVE_GEARMAP_FAILURE = 'SAVE_GEARMAP_FAILURE';
var RESET_SAVE_GEARMAP = exports.RESET_SAVE_GEARMAP = 'RESET_SAVE_GEARMAP';

function fetchGearmap(worldId, newOrderObject) {
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/gearmap',
    params: { worldId: worldId }
  });

  return {
    type: FETCH_GEARMAP,
    payload: request
  };
}

function fetchGearmapSuccess(gearmap) {
  return {
    type: FETCH_GEARMAP_SUCCESS,
    payload: gearmap
  };
}

function fetchGearmapFailure(error) {
  return {
    type: FETCH_GEARMAP_FAILURE,
    payload: error
  };
}

/* Save */

function saveGearmap(worldId, gearmap) {
  var request = (0, _axios2.default)({
    method: 'put',
    url: _config.ROOT_URL + '/gearmap',
    data: { worldId: worldId, gearmap: gearmap || null }
  });

  return {
    type: SAVE_GEARMAP,
    payload: request
  };
}

function saveGearmapSuccess(gearmap) {
  return {
    type: SAVE_GEARMAP_SUCCESS,
    payload: gearmap
  };
}

function saveGearmapFailure(error) {
  return {
    type: SAVE_GEARMAP_FAILURE,
    payload: error
  };
}

},{"../config.const":386,"axios":"axios"}],361:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPDATE_INFOWINCAM_FAILURE = exports.UPDATE_INFOWINCAM_SUCCESS = exports.UPDATE_INFOWINCAM = exports.CLONE_INFOWIN_FAILURE = exports.CLONE_INFOWIN_SUCCESS = exports.CLONE_INFOWIN = exports.RESET_DELETED_INFOWIN = exports.DELETE_INFOWIN_FAILURE = exports.DELETE_INFOWIN_SUCCESS = exports.DELETE_INFOWIN = exports.RESET_ACTIVE_INFOWIN = exports.FETCH_INFOWIN_FAILURE = exports.FETCH_INFOWIN_SUCCESS = exports.FETCH_INFOWIN = exports.RESET_INFOWIN_FIELDS = exports.VALIDATE_INFOWIN_FIELDS_FAILURE = exports.VALIDATE_INFOWIN_FIELDS_SUCCESS = exports.VALIDATE_INFOWIN_FIELDS = exports.UPDATE_INFOWIN_FAILURE = exports.UPDATE_INFOWIN_SUCCESS = exports.UPDATE_INFOWIN = exports.RESET_NEW_INFOWIN = exports.CREATE_INFOWIN_FAILURE = exports.CREATE_INFOWIN_SUCCESS = exports.CREATE_INFOWIN = exports.RESET_SAVE_OINFOWINS = exports.SAVE_OINFOWINS_FAILURE = exports.SAVE_OINFOWINS_SUCCESS = exports.SAVE_OINFOWINS = exports.RESET_INFOWINS = exports.FETCH_INFOWINS_FAILURE = exports.FETCH_INFOWINS_SUCCESS = exports.FETCH_INFOWINS = undefined;
exports.fetchInfowins = fetchInfowins;
exports.fetchInfowinsSuccess = fetchInfowinsSuccess;
exports.fetchInfowinsFailure = fetchInfowinsFailure;
exports.saveOInfowins = saveOInfowins;
exports.saveOInfowinsSuccess = saveOInfowinsSuccess;
exports.saveOInfowinsFailure = saveOInfowinsFailure;
exports.validateInfowinFields = validateInfowinFields;
exports.validateInfowinFieldsSuccess = validateInfowinFieldsSuccess;
exports.validateInfowinFieldsFailure = validateInfowinFieldsFailure;
exports.resetInfowinFields = resetInfowinFields;
exports.createInfowin = createInfowin;
exports.createInfowinSuccess = createInfowinSuccess;
exports.createInfowinFailure = createInfowinFailure;
exports.resetNewInfowin = resetNewInfowin;
exports.resetDeletedInfowin = resetDeletedInfowin;
exports.updateInfowinCam = updateInfowinCam;
exports.updateInfowinCamSuccess = updateInfowinCamSuccess;
exports.updateInfowinCamFailure = updateInfowinCamFailure;
exports.fetchInfowin = fetchInfowin;
exports.fetchInfowinSuccess = fetchInfowinSuccess;
exports.fetchInfowinFailure = fetchInfowinFailure;
exports.resetActiveInfowin = resetActiveInfowin;
exports.updateInfowin = updateInfowin;
exports.updateInfowinSuccess = updateInfowinSuccess;
exports.updateInfowinFailure = updateInfowinFailure;
exports.deleteInfowin = deleteInfowin;
exports.deleteInfowinSuccess = deleteInfowinSuccess;
exports.deleteInfowinFailure = deleteInfowinFailure;
exports.cloneInfowin = cloneInfowin;
exports.cloneInfowinSuccess = cloneInfowinSuccess;
exports.cloneInfowinFailure = cloneInfowinFailure;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('../config.const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Infowin list
var FETCH_INFOWINS = exports.FETCH_INFOWINS = 'FETCH_INFOWINS';
var FETCH_INFOWINS_SUCCESS = exports.FETCH_INFOWINS_SUCCESS = 'FETCH_INFOWINS_SUCCESS';
var FETCH_INFOWINS_FAILURE = exports.FETCH_INFOWINS_FAILURE = 'FETCH_INFOWINS_FAILURE';
var RESET_INFOWINS = exports.RESET_INFOWINS = 'RESET_INFOWINS';

//Infowin save order
var SAVE_OINFOWINS = exports.SAVE_OINFOWINS = 'SAVE_OINFOWINS';
var SAVE_OINFOWINS_SUCCESS = exports.SAVE_OINFOWINS_SUCCESS = 'SAVE_OINFOWINS_SUCCESS';
var SAVE_OINFOWINS_FAILURE = exports.SAVE_OINFOWINS_FAILURE = 'SAVE_OINFOWINS_FAILURE';
var RESET_SAVE_OINFOWINS = exports.RESET_SAVE_OINFOWINS = 'RESET_SAVE_OINFOWINS';

//Create new infowin
var CREATE_INFOWIN = exports.CREATE_INFOWIN = 'CREATE_INFOWIN';
var CREATE_INFOWIN_SUCCESS = exports.CREATE_INFOWIN_SUCCESS = 'CREATE_INFOWIN_SUCCESS';
var CREATE_INFOWIN_FAILURE = exports.CREATE_INFOWIN_FAILURE = 'CREATE_INFOWIN_FAILURE';
var RESET_NEW_INFOWIN = exports.RESET_NEW_INFOWIN = 'RESET_NEW_INFOWIN';

//Create new infowin
var UPDATE_INFOWIN = exports.UPDATE_INFOWIN = 'UPDATE_INFOWIN';
var UPDATE_INFOWIN_SUCCESS = exports.UPDATE_INFOWIN_SUCCESS = 'UPDATE_INFOWIN_SUCCESS';
var UPDATE_INFOWIN_FAILURE = exports.UPDATE_INFOWIN_FAILURE = 'UPDATE_INFOWIN_FAILURE';

//Validate infowin fields like Title, Categries on the server
var VALIDATE_INFOWIN_FIELDS = exports.VALIDATE_INFOWIN_FIELDS = 'VALIDATE_INFOWIN_FIELDS';
var VALIDATE_INFOWIN_FIELDS_SUCCESS = exports.VALIDATE_INFOWIN_FIELDS_SUCCESS = 'VALIDATE_INFOWIN_FIELDS_SUCCESS';
var VALIDATE_INFOWIN_FIELDS_FAILURE = exports.VALIDATE_INFOWIN_FIELDS_FAILURE = 'VALIDATE_INFOWIN_FIELDS_FAILURE';
var RESET_INFOWIN_FIELDS = exports.RESET_INFOWIN_FIELDS = 'RESET_INFOWIN_FIELDS';

//Fetch infowin
var FETCH_INFOWIN = exports.FETCH_INFOWIN = 'FETCH_INFOWIN';
var FETCH_INFOWIN_SUCCESS = exports.FETCH_INFOWIN_SUCCESS = 'FETCH_INFOWIN_SUCCESS';
var FETCH_INFOWIN_FAILURE = exports.FETCH_INFOWIN_FAILURE = 'FETCH_INFOWIN_FAILURE';
var RESET_ACTIVE_INFOWIN = exports.RESET_ACTIVE_INFOWIN = 'RESET_ACTIVE_INFOWIN';

//Delete infowin
var DELETE_INFOWIN = exports.DELETE_INFOWIN = 'DELETE_INFOWIN';
var DELETE_INFOWIN_SUCCESS = exports.DELETE_INFOWIN_SUCCESS = 'DELETE_INFOWIN_SUCCESS';
var DELETE_INFOWIN_FAILURE = exports.DELETE_INFOWIN_FAILURE = 'DELETE_INFOWIN_FAILURE';
var RESET_DELETED_INFOWIN = exports.RESET_DELETED_INFOWIN = 'RESET_DELETED_INFOWIN';

//Clone infowin
var CLONE_INFOWIN = exports.CLONE_INFOWIN = 'CLONE_INFOWIN';
var CLONE_INFOWIN_SUCCESS = exports.CLONE_INFOWIN_SUCCESS = 'CLONE_INFOWIN_SUCCESS';
var CLONE_INFOWIN_FAILURE = exports.CLONE_INFOWIN_FAILURE = 'CLONE_INFOWIN_FAILURE';

//Update CameraCoords
var UPDATE_INFOWINCAM = exports.UPDATE_INFOWINCAM = 'UPDATE_INFOWINCAM';
var UPDATE_INFOWINCAM_SUCCESS = exports.UPDATE_INFOWINCAM_SUCCESS = 'UPDATE_INFOWINCAM_SUCCESS';
var UPDATE_INFOWINCAM_FAILURE = exports.UPDATE_INFOWINCAM_FAILURE = 'UPDATE_INFOWINCAM_FAILURE';

function fetchInfowins(worldId, newOrderObject) {
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/infowins',
    params: { worldId: worldId },
    headers: []
  });

  return {
    type: FETCH_INFOWINS,
    payload: request
  };
}

function fetchInfowinsSuccess(infowins) {
  return {
    type: FETCH_INFOWINS_SUCCESS,
    payload: infowins
  };
}

function fetchInfowinsFailure(error) {
  return {
    type: FETCH_INFOWINS_FAILURE,
    payload: error
  };
}

/* Save order */

function saveOInfowins(worldId, newOrderObject) {
  var request = (0, _axios2.default)({
    method: 'post',
    url: _config.ROOT_URL + '/infowinsOrder',
    data: { worldId: worldId, nOrder: newOrderObject || null },
    headers: []
  });

  return {
    type: SAVE_OINFOWINS,
    payload: request
  };
}

function saveOInfowinsSuccess(infowins) {
  return {
    type: SAVE_OINFOWINS_SUCCESS,
    payload: infowins
  };
}

function saveOInfowinsFailure(error) {
  return {
    type: SAVE_OINFOWINS_FAILURE,
    payload: error
  };
}

/* Validate */

function validateInfowinFields(props) {
  //note: we cant have /infowins/validateFields because it'll match /infowins/:id path!
  var request = _axios2.default.infowin(_config.ROOT_URL + '/infowins/validate/fields', props);

  return {
    type: VALIDATE_INFOWIN_FIELDS,
    payload: request
  };
}

function validateInfowinFieldsSuccess() {
  return {
    type: VALIDATE_INFOWIN_FIELDS_SUCCESS
  };
}

function validateInfowinFieldsFailure(error) {
  return {
    type: VALIDATE_INFOWIN_FIELDS_FAILURE,
    payload: error
  };
}

/* New */

function resetInfowinFields() {
  return {
    type: RESET_INFOWIN_FIELDS
  };
};

function createInfowin(props, parentType, parentId) {
  var request = (0, _axios2.default)({
    method: 'post',
    data: { infowin: props, parentType: parentType, parentId: parentId },
    url: _config.ROOT_URL + '/infowins'
  });

  return {
    type: CREATE_INFOWIN,
    payload: request
  };
}

function createInfowinSuccess(newInfowin) {
  return {
    type: CREATE_INFOWIN_SUCCESS,
    payload: newInfowin
  };
}

function createInfowinFailure(error) {
  return {
    type: CREATE_INFOWIN_FAILURE,
    payload: error
  };
}

function resetNewInfowin() {
  return {
    type: RESET_NEW_INFOWIN
  };
};

function resetDeletedInfowin() {
  return {
    type: RESET_DELETED_INFOWIN
  };
};

/* UPDATE_INFOWINCAM */

function updateInfowinCam(infowin) {

  var request = new Promise(function (resolve, reject) {
    var ct = window.app3dInfowiner.infowinPosition();
    //setTimeout(function() {
    var newInfowin = _.clone(infowin || {});
    if (!newInfowin.cameraPosition) {
      newInfowin.cameraPosition = { x: 0, y: 0, z: 0 };
    }
    if (!newInfowin.targetPosition) {
      newInfowin.targetPosition = { x: 0, y: 0, z: 0 };
    }
    newInfowin.cameraPosition.x = Math.round(ct[0].x * 1000) / 1000;
    newInfowin.cameraPosition.y = Math.round(ct[0].y * 1000) / 1000;
    newInfowin.cameraPosition.z = Math.round(ct[0].z * 1000) / 1000;
    newInfowin.targetPosition.x = Math.round(ct[1].x * 1000) / 1000;
    newInfowin.targetPosition.y = Math.round(ct[1].y * 1000) / 1000;
    newInfowin.targetPosition.z = Math.round(ct[1].z * 1000) / 1000;
    resolve({ data: { data: newInfowin } });
    //}, 200);
  });

  return {
    type: UPDATE_INFOWINCAM,
    payload: request
  };
}

function updateInfowinCamSuccess(newInfowin) {
  return {
    type: UPDATE_INFOWINCAM_SUCCESS,
    payload: newInfowin
  };
}

function updateInfowinCamFailure(error) {
  return {
    type: UPDATE_INFOWINCAM_FAILURE,
    payload: error
  };
}

/* Fetch Infowin (single) */

function fetchInfowin(id) {
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/infowins/' + id
  });

  return {
    type: FETCH_INFOWIN,
    payload: request
  };
}

function fetchInfowinSuccess(activeInfowin) {
  return {
    type: FETCH_INFOWIN_SUCCESS,
    payload: activeInfowin
  };
}

function fetchInfowinFailure(error) {
  return {
    type: FETCH_INFOWIN_FAILURE,
    payload: error
  };
}

function resetActiveInfowin() {
  return {
    type: RESET_ACTIVE_INFOWIN
  };
};

/* MODIFY */
function updateInfowin(infowin) {
  var request = (0, _axios2.default)({
    method: 'put',
    data: { infowin: infowin },
    url: _config.ROOT_URL + '/infowins'
  });

  return {
    type: UPDATE_INFOWIN,
    payload: request
  };
}

function updateInfowinSuccess(activeInfowin) {
  return {
    type: UPDATE_INFOWIN_SUCCESS,
    payload: activeInfowin
  };
}

function updateInfowinFailure(error) {
  return {
    type: UPDATE_INFOWIN_FAILURE,
    payload: error
  };
}

/* DELETE */

function deleteInfowin(parentType, parentId, id) {
  var request = (0, _axios2.default)({
    method: 'delete',
    url: _config.ROOT_URL + '/infowins',
    data: { infowinId: id, parentType: parentType, parentId: parentId }
  });
  return {
    type: DELETE_INFOWIN,
    payload: request
  };
}

function deleteInfowinSuccess(deletedInfowin) {
  return {
    type: DELETE_INFOWIN_SUCCESS,
    payload: deletedInfowin
  };
}

function deleteInfowinFailure(response) {
  return {
    type: DELETE_INFOWIN_FAILURE,
    payload: response
  };
}

/* CLONE */

function cloneInfowin(parentType, parentId, relativePosition, id) {
  var request = (0, _axios2.default)({
    method: 'POST',
    url: _config.ROOT_URL + '/infowins/clone',
    data: { originalInfowinId: id, parentType: parentType, parentId: parentId, relativePosition: relativePosition }
  });
  return {
    type: CLONE_INFOWIN,
    payload: request
  };
}

function cloneInfowinSuccess(clonedInfowin) {
  return {
    type: CLONE_INFOWIN_SUCCESS,
    payload: clonedInfowin
  };
}

function cloneInfowinFailure(response) {
  return {
    type: CLONE_INFOWIN_FAILURE,
    payload: response
  };
}

},{"../config.const":386,"axios":"axios"}],362:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPDATE_MARKERCAM_FAILURE = exports.UPDATE_MARKERCAM_SUCCESS = exports.UPDATE_MARKERCAM = exports.CLONE_MARKER_FAILURE = exports.CLONE_MARKER_SUCCESS = exports.CLONE_MARKER = exports.RESET_DELETED_MARKER = exports.DELETE_MARKER_FAILURE = exports.DELETE_MARKER_SUCCESS = exports.DELETE_MARKER = exports.RESET_ACTIVE_MARKER = exports.FETCH_MARKER_FAILURE = exports.FETCH_MARKER_SUCCESS = exports.FETCH_MARKER = exports.RESET_MARKER_FIELDS = exports.VALIDATE_MARKER_FIELDS_FAILURE = exports.VALIDATE_MARKER_FIELDS_SUCCESS = exports.VALIDATE_MARKER_FIELDS = exports.UPDATE_MARKER_FAILURE = exports.UPDATE_MARKER_SUCCESS = exports.UPDATE_MARKER = exports.RESET_NEW_MARKER = exports.CREATE_MARKER_FAILURE = exports.CREATE_MARKER_SUCCESS = exports.CREATE_MARKER = exports.RESET_SAVE_OMARKERS = exports.SAVE_OMARKERS_FAILURE = exports.SAVE_OMARKERS_SUCCESS = exports.SAVE_OMARKERS = exports.RESET_MARKERS = exports.FETCH_MARKERS_FAILURE = exports.FETCH_MARKERS_SUCCESS = exports.FETCH_MARKERS = undefined;
exports.fetchMarkers = fetchMarkers;
exports.fetchMarkersSuccess = fetchMarkersSuccess;
exports.fetchMarkersFailure = fetchMarkersFailure;
exports.saveOMarkers = saveOMarkers;
exports.saveOMarkersSuccess = saveOMarkersSuccess;
exports.saveOMarkersFailure = saveOMarkersFailure;
exports.validateMarkerFields = validateMarkerFields;
exports.validateMarkerFieldsSuccess = validateMarkerFieldsSuccess;
exports.validateMarkerFieldsFailure = validateMarkerFieldsFailure;
exports.resetMarkerFields = resetMarkerFields;
exports.createMarker = createMarker;
exports.createMarkerSuccess = createMarkerSuccess;
exports.createMarkerFailure = createMarkerFailure;
exports.resetNewMarker = resetNewMarker;
exports.resetDeletedMarker = resetDeletedMarker;
exports.fetchMarker = fetchMarker;
exports.fetchMarkerSuccess = fetchMarkerSuccess;
exports.fetchMarkerFailure = fetchMarkerFailure;
exports.resetActiveMarker = resetActiveMarker;
exports.updateMarker = updateMarker;
exports.updateMarkerSuccess = updateMarkerSuccess;
exports.updateMarkerFailure = updateMarkerFailure;
exports.deleteMarker = deleteMarker;
exports.deleteMarkerSuccess = deleteMarkerSuccess;
exports.deleteMarkerFailure = deleteMarkerFailure;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('../config.const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Marker list
var FETCH_MARKERS = exports.FETCH_MARKERS = 'FETCH_MARKERS';
var FETCH_MARKERS_SUCCESS = exports.FETCH_MARKERS_SUCCESS = 'FETCH_MARKERS_SUCCESS';
var FETCH_MARKERS_FAILURE = exports.FETCH_MARKERS_FAILURE = 'FETCH_MARKERS_FAILURE';
var RESET_MARKERS = exports.RESET_MARKERS = 'RESET_MARKERS';

//Marker save order
var SAVE_OMARKERS = exports.SAVE_OMARKERS = 'SAVE_OMARKERS';
var SAVE_OMARKERS_SUCCESS = exports.SAVE_OMARKERS_SUCCESS = 'SAVE_OMARKERS_SUCCESS';
var SAVE_OMARKERS_FAILURE = exports.SAVE_OMARKERS_FAILURE = 'SAVE_OMARKERS_FAILURE';
var RESET_SAVE_OMARKERS = exports.RESET_SAVE_OMARKERS = 'RESET_SAVE_OMARKERS';

//Create new marker
var CREATE_MARKER = exports.CREATE_MARKER = 'CREATE_MARKER';
var CREATE_MARKER_SUCCESS = exports.CREATE_MARKER_SUCCESS = 'CREATE_MARKER_SUCCESS';
var CREATE_MARKER_FAILURE = exports.CREATE_MARKER_FAILURE = 'CREATE_MARKER_FAILURE';
var RESET_NEW_MARKER = exports.RESET_NEW_MARKER = 'RESET_NEW_MARKER';

//Create new marker
var UPDATE_MARKER = exports.UPDATE_MARKER = 'UPDATE_MARKER';
var UPDATE_MARKER_SUCCESS = exports.UPDATE_MARKER_SUCCESS = 'UPDATE_MARKER_SUCCESS';
var UPDATE_MARKER_FAILURE = exports.UPDATE_MARKER_FAILURE = 'UPDATE_MARKER_FAILURE';

//Validate marker fields like Title, Categries on the server
var VALIDATE_MARKER_FIELDS = exports.VALIDATE_MARKER_FIELDS = 'VALIDATE_MARKER_FIELDS';
var VALIDATE_MARKER_FIELDS_SUCCESS = exports.VALIDATE_MARKER_FIELDS_SUCCESS = 'VALIDATE_MARKER_FIELDS_SUCCESS';
var VALIDATE_MARKER_FIELDS_FAILURE = exports.VALIDATE_MARKER_FIELDS_FAILURE = 'VALIDATE_MARKER_FIELDS_FAILURE';
var RESET_MARKER_FIELDS = exports.RESET_MARKER_FIELDS = 'RESET_MARKER_FIELDS';

//Fetch marker
var FETCH_MARKER = exports.FETCH_MARKER = 'FETCH_MARKER';
var FETCH_MARKER_SUCCESS = exports.FETCH_MARKER_SUCCESS = 'FETCH_MARKER_SUCCESS';
var FETCH_MARKER_FAILURE = exports.FETCH_MARKER_FAILURE = 'FETCH_MARKER_FAILURE';
var RESET_ACTIVE_MARKER = exports.RESET_ACTIVE_MARKER = 'RESET_ACTIVE_MARKER';

//Delete marker
var DELETE_MARKER = exports.DELETE_MARKER = 'DELETE_MARKER';
var DELETE_MARKER_SUCCESS = exports.DELETE_MARKER_SUCCESS = 'DELETE_MARKER_SUCCESS';
var DELETE_MARKER_FAILURE = exports.DELETE_MARKER_FAILURE = 'DELETE_MARKER_FAILURE';
var RESET_DELETED_MARKER = exports.RESET_DELETED_MARKER = 'RESET_DELETED_MARKER';

//Clone marker
var CLONE_MARKER = exports.CLONE_MARKER = 'CLONE_MARKER';
var CLONE_MARKER_SUCCESS = exports.CLONE_MARKER_SUCCESS = 'CLONE_MARKER_SUCCESS';
var CLONE_MARKER_FAILURE = exports.CLONE_MARKER_FAILURE = 'CLONE_MARKER_FAILURE';

//Update CameraCoords
var UPDATE_MARKERCAM = exports.UPDATE_MARKERCAM = 'UPDATE_MARKERCAM';
var UPDATE_MARKERCAM_SUCCESS = exports.UPDATE_MARKERCAM_SUCCESS = 'UPDATE_MARKERCAM_SUCCESS';
var UPDATE_MARKERCAM_FAILURE = exports.UPDATE_MARKERCAM_FAILURE = 'UPDATE_MARKERCAM_FAILURE';

function fetchMarkers(worldId, newOrderObject) {
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/markers',
    params: { worldId: worldId },
    headers: []
  });

  return {
    type: FETCH_MARKERS,
    payload: request
  };
}

function fetchMarkersSuccess(markers) {
  return {
    type: FETCH_MARKERS_SUCCESS,
    payload: markers
  };
}

function fetchMarkersFailure(error) {
  return {
    type: FETCH_MARKERS_FAILURE,
    payload: error
  };
}

/* Save order */

function saveOMarkers(worldId, newOrderObject) {
  var request = (0, _axios2.default)({
    method: 'post',
    url: _config.ROOT_URL + '/markersOrder',
    data: { worldId: worldId, nOrder: newOrderObject || null },
    headers: []
  });

  return {
    type: SAVE_OMARKERS,
    payload: request
  };
}

function saveOMarkersSuccess(markers) {
  return {
    type: SAVE_OMARKERS_SUCCESS,
    payload: markers
  };
}

function saveOMarkersFailure(error) {
  return {
    type: SAVE_OMARKERS_FAILURE,
    payload: error
  };
}

/* Validate */

function validateMarkerFields(props) {
  //note: we cant have /markers/validateFields because it'll match /markers/:id path!
  var request = _axios2.default.marker(_config.ROOT_URL + '/markers/validate/fields', props);

  return {
    type: VALIDATE_MARKER_FIELDS,
    payload: request
  };
}

function validateMarkerFieldsSuccess() {
  return {
    type: VALIDATE_MARKER_FIELDS_SUCCESS
  };
}

function validateMarkerFieldsFailure(error) {
  return {
    type: VALIDATE_MARKER_FIELDS_FAILURE,
    payload: error
  };
}

/* New */

function resetMarkerFields() {
  return {
    type: RESET_MARKER_FIELDS
  };
};

function createMarker(props, parentId) {
  var request = (0, _axios2.default)({
    method: 'post',
    data: { marker: props, parentId: parentId },
    url: _config.ROOT_URL + '/markers'
  });

  return {
    type: CREATE_MARKER,
    payload: request
  };
}

function createMarkerSuccess(newMarker) {
  return {
    type: CREATE_MARKER_SUCCESS,
    payload: newMarker
  };
}

function createMarkerFailure(error) {
  return {
    type: CREATE_MARKER_FAILURE,
    payload: error
  };
}

function resetNewMarker() {
  return {
    type: RESET_NEW_MARKER
  };
};

function resetDeletedMarker() {
  return {
    type: RESET_DELETED_MARKER
  };
};

/* Fetch Marker (single) */

function fetchMarker(id) {
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/markers/' + id
  });

  return {
    type: FETCH_MARKER,
    payload: request
  };
}

function fetchMarkerSuccess(activeMarker) {
  return {
    type: FETCH_MARKER_SUCCESS,
    payload: activeMarker
  };
}

function fetchMarkerFailure(error) {
  return {
    type: FETCH_MARKER_FAILURE,
    payload: error
  };
}

function resetActiveMarker() {
  return {
    type: RESET_ACTIVE_MARKER
  };
};

/* MODIFY */
function updateMarker(marker, parentId) {
  var request = (0, _axios2.default)({
    method: 'put',
    data: { marker: marker, parentId: parentId },
    url: _config.ROOT_URL + '/markers'
  });

  return {
    type: UPDATE_MARKER,
    payload: request
  };
}

function updateMarkerSuccess(activeMarker) {
  return {
    type: UPDATE_MARKER_SUCCESS,
    payload: activeMarker
  };
}

function updateMarkerFailure(error) {
  return {
    type: UPDATE_MARKER_FAILURE,
    payload: error
  };
}

/* DELETE */

function deleteMarker(parentId, id) {
  var request = (0, _axios2.default)({
    method: 'delete',
    url: _config.ROOT_URL + '/markers',
    data: { markerId: id, parentId: parentId }
  });
  return {
    type: DELETE_MARKER,
    payload: request
  };
}

function deleteMarkerSuccess(deletedMarker) {
  return {
    type: DELETE_MARKER_SUCCESS,
    payload: deletedMarker
  };
}

function deleteMarkerFailure(response) {
  return {
    type: DELETE_MARKER_FAILURE,
    payload: response
  };
}

},{"../config.const":386,"axios":"axios"}],363:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPDATE_QUESTIONCAM_FAILURE = exports.UPDATE_QUESTIONCAM_SUCCESS = exports.UPDATE_QUESTIONCAM = exports.RESET_DELETED_QUESTION = exports.DELETE_QUESTION_FAILURE = exports.DELETE_QUESTION_SUCCESS = exports.DELETE_QUESTION = exports.RESET_ACTIVE_QUESTION = exports.FETCH_QUESTION_FAILURE = exports.FETCH_QUESTION_SUCCESS = exports.FETCH_QUESTION = exports.RESET_QUESTION_FIELDS = exports.VALIDATE_QUESTION_FIELDS_FAILURE = exports.VALIDATE_QUESTION_FIELDS_SUCCESS = exports.VALIDATE_QUESTION_FIELDS = exports.UPDATE_QUESTION_FAILURE = exports.UPDATE_QUESTION_SUCCESS = exports.UPDATE_QUESTION = exports.RESET_NEW_QUESTION = exports.CREATE_QUESTION_FAILURE = exports.CREATE_QUESTION_SUCCESS = exports.CREATE_QUESTION = exports.RESET_SAVE_OQUESTIONS = exports.SAVE_OQUESTIONS_FAILURE = exports.SAVE_OQUESTIONS_SUCCESS = exports.SAVE_OQUESTIONS = exports.RESET_QUESTIONS = exports.FETCH_QUESTIONS_FAILURE = exports.FETCH_QUESTIONS_SUCCESS = exports.FETCH_QUESTIONS = undefined;
exports.fetchQuestions = fetchQuestions;
exports.fetchQuestionsSuccess = fetchQuestionsSuccess;
exports.fetchQuestionsFailure = fetchQuestionsFailure;
exports.saveOQuestions = saveOQuestions;
exports.saveOQuestionsSuccess = saveOQuestionsSuccess;
exports.saveOQuestionsFailure = saveOQuestionsFailure;
exports.validateQuestionFields = validateQuestionFields;
exports.validateQuestionFieldsSuccess = validateQuestionFieldsSuccess;
exports.validateQuestionFieldsFailure = validateQuestionFieldsFailure;
exports.resetQuestionFields = resetQuestionFields;
exports.createQuestion = createQuestion;
exports.createQuestionSuccess = createQuestionSuccess;
exports.createQuestionFailure = createQuestionFailure;
exports.resetNewQuestion = resetNewQuestion;
exports.resetDeletedQuestion = resetDeletedQuestion;
exports.updateQuestionCamSuccess = updateQuestionCamSuccess;
exports.updateQuestionCamFailure = updateQuestionCamFailure;
exports.fetchQuestion = fetchQuestion;
exports.fetchQuestionSuccess = fetchQuestionSuccess;
exports.fetchQuestionFailure = fetchQuestionFailure;
exports.resetActiveQuestion = resetActiveQuestion;
exports.updateQuestion = updateQuestion;
exports.updateQuestionSuccess = updateQuestionSuccess;
exports.updateQuestionFailure = updateQuestionFailure;
exports.deleteQuestion = deleteQuestion;
exports.deleteQuestionSuccess = deleteQuestionSuccess;
exports.deleteQuestionFailure = deleteQuestionFailure;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('../config.const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Infowin list
var FETCH_QUESTIONS = exports.FETCH_QUESTIONS = 'FETCH_QUESTIONS';
var FETCH_QUESTIONS_SUCCESS = exports.FETCH_QUESTIONS_SUCCESS = 'FETCH_QUESTIONS_SUCCESS';
var FETCH_QUESTIONS_FAILURE = exports.FETCH_QUESTIONS_FAILURE = 'FETCH_QUESTIONS_FAILURE';
var RESET_QUESTIONS = exports.RESET_QUESTIONS = 'RESET_QUESTIONS';

//Infowin save order
var SAVE_OQUESTIONS = exports.SAVE_OQUESTIONS = 'SAVE_OQUESTIONS';
var SAVE_OQUESTIONS_SUCCESS = exports.SAVE_OQUESTIONS_SUCCESS = 'SAVE_OQUESTIONS_SUCCESS';
var SAVE_OQUESTIONS_FAILURE = exports.SAVE_OQUESTIONS_FAILURE = 'SAVE_OQUESTIONS_FAILURE';
var RESET_SAVE_OQUESTIONS = exports.RESET_SAVE_OQUESTIONS = 'RESET_SAVE_OQUESTIONS';

//Create new infowin
var CREATE_QUESTION = exports.CREATE_QUESTION = 'CREATE_QUESTION';
var CREATE_QUESTION_SUCCESS = exports.CREATE_QUESTION_SUCCESS = 'CREATE_QUESTION_SUCCESS';
var CREATE_QUESTION_FAILURE = exports.CREATE_QUESTION_FAILURE = 'CREATE_QUESTION_FAILURE';
var RESET_NEW_QUESTION = exports.RESET_NEW_QUESTION = 'RESET_NEW_QUESTION';

//Create new infowin
var UPDATE_QUESTION = exports.UPDATE_QUESTION = 'UPDATE_QUESTION';
var UPDATE_QUESTION_SUCCESS = exports.UPDATE_QUESTION_SUCCESS = 'UPDATE_QUESTION_SUCCESS';
var UPDATE_QUESTION_FAILURE = exports.UPDATE_QUESTION_FAILURE = 'UPDATE_QUESTION_FAILURE';

//Validate infowin fields like Title, Categries on the server
var VALIDATE_QUESTION_FIELDS = exports.VALIDATE_QUESTION_FIELDS = 'VALIDATE_QUESTION_FIELDS';
var VALIDATE_QUESTION_FIELDS_SUCCESS = exports.VALIDATE_QUESTION_FIELDS_SUCCESS = 'VALIDATE_QUESTION_FIELDS_SUCCESS';
var VALIDATE_QUESTION_FIELDS_FAILURE = exports.VALIDATE_QUESTION_FIELDS_FAILURE = 'VALIDATE_QUESTION_FIELDS_FAILURE';
var RESET_QUESTION_FIELDS = exports.RESET_QUESTION_FIELDS = 'RESET_QUESTION_FIELDS';

//Fetch infowin
var FETCH_QUESTION = exports.FETCH_QUESTION = 'FETCH_QUESTION';
var FETCH_QUESTION_SUCCESS = exports.FETCH_QUESTION_SUCCESS = 'FETCH_QUESTION_SUCCESS';
var FETCH_QUESTION_FAILURE = exports.FETCH_QUESTION_FAILURE = 'FETCH_QUESTION_FAILURE';
var RESET_ACTIVE_QUESTION = exports.RESET_ACTIVE_QUESTION = 'RESET_ACTIVE_QUESTION';

//Delete infowin
var DELETE_QUESTION = exports.DELETE_QUESTION = 'DELETE_QUESTION';
var DELETE_QUESTION_SUCCESS = exports.DELETE_QUESTION_SUCCESS = 'DELETE_QUESTION_SUCCESS';
var DELETE_QUESTION_FAILURE = exports.DELETE_QUESTION_FAILURE = 'DELETE_QUESTION_FAILURE';
var RESET_DELETED_QUESTION = exports.RESET_DELETED_QUESTION = 'RESET_DELETED_QUESTION';

//Update CameraCoords
var UPDATE_QUESTIONCAM = exports.UPDATE_QUESTIONCAM = 'UPDATE_QUESTIONCAM';
var UPDATE_QUESTIONCAM_SUCCESS = exports.UPDATE_QUESTIONCAM_SUCCESS = 'UPDATE_QUESTIONCAM_SUCCESS';
var UPDATE_QUESTIONCAM_FAILURE = exports.UPDATE_QUESTIONCAM_FAILURE = 'UPDATE_QUESTIONCAM_FAILURE';

function fetchQuestions(worldId, newOrderObject) {
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/questions',
    params: { worldId: worldId },
    headers: []
  });

  return {
    type: FETCH_QUESTIONS,
    payload: request
  };
}

function fetchQuestionsSuccess(infowins) {
  return {
    type: FETCH_QUESTIONS_SUCCESS,
    payload: infowins
  };
}

function fetchQuestionsFailure(error) {
  return {
    type: FETCH_QUESTIONS_FAILURE,
    payload: error
  };
}

/* Save order */

function saveOQuestions(worldId, newOrderObject) {
  var request = (0, _axios2.default)({
    method: 'post',
    url: _config.ROOT_URL + '/questionsOrder',
    data: { worldId: worldId, nOrder: newOrderObject || null },
    headers: []
  });

  return {
    type: SAVE_OQUESTIONS,
    payload: request
  };
}

function saveOQuestionsSuccess(questions) {
  return {
    type: SAVE_OQUESTIONS_SUCCESS,
    payload: questions
  };
}

function saveOQuestionsFailure(error) {
  return {
    type: SAVE_OQUESTIONS_FAILURE,
    payload: error
  };
}

/* Validate */

function validateQuestionFields(props) {
  //note: we cant have /infowins/validateFields because it'll match /infowins/:id path!
  var request = _axios2.default.question(_config.ROOT_URL + '/questions/validate/fields', props);

  return {
    type: VALIDATE_QUESTION_FIELDS,
    payload: request
  };
}

function validateQuestionFieldsSuccess() {
  return {
    type: VALIDATE_QUESTION_FIELDS_SUCCESS
  };
}

function validateQuestionFieldsFailure(error) {
  return {
    type: VALIDATE_QUESTION_FIELDS_FAILURE,
    payload: error
  };
}

/* New */

function resetQuestionFields() {
  return {
    type: RESET_QUESTION_FIELDS
  };
};

function createQuestion(props, parentType, parentId) {
  console.log("createQuestion=", props);
  var request = (0, _axios2.default)({
    method: 'post',
    data: { question: props, parentType: parentType, parentId: parentId },
    url: _config.ROOT_URL + '/questions'
  });

  return {
    type: CREATE_QUESTION,
    payload: request
  };
}

function createQuestionSuccess(newQuestion) {
  console.log("createQuestionSuccess=", newQuestion);
  return {
    type: CREATE_QUESTION_SUCCESS,
    payload: newQuestion
  };
}

function createQuestionFailure(error) {
  return {
    type: CREATE_QUESTION_FAILURE,
    payload: error
  };
}

function resetNewQuestion() {
  return {
    type: RESET_NEW_QUESTION
  };
};

function resetDeletedQuestion() {
  return {
    type: RESET_DELETED_QUESTION
  };
};

/* UPDATE_INFOWINCAM */
/*
export function updateQuestionCam(question) {

  const request = new Promise(
    function(resolve, reject) {
      var ct = window.app3dQuestioner.infowinPosition();
      //setTimeout(function() {
        var newQuestion = _.clone(question || {});
        if (!newQuestion.cameraPosition) { newQuestion.cameraPosition = { x:0, y:0, z:0 }; }
        if (!newQuestion.targetPosition) { newQuestion.targetPosition = { x:0, y:0, z:0 }; }
        newQuestion.cameraPosition.x = Math.round(ct[0].x * 1000) / 1000;
        newQuestion.cameraPosition.y = Math.round(ct[0].y * 1000) / 1000;
        newQuestion.cameraPosition.z = Math.round(ct[0].z * 1000) / 1000;
        newQuestion.targetPosition.x = Math.round(ct[1].x * 1000) / 1000;
        newQuestion.targetPosition.y = Math.round(ct[1].y * 1000) / 1000;
        newQuestion.targetPosition.z = Math.round(ct[1].z * 1000) / 1000;
        resolve({data: { data: newQuestion} });
      //}, 200);
    }
  );

  return {
    type: UPDATE_QUESTIONCAM,
    payload: request
  };
}
*/
function updateQuestionCamSuccess(newQuestion) {
  return {
    type: UPDATE_QUESTIONCAM_SUCCESS,
    payload: newQuestion
  };
}

function updateQuestionCamFailure(error) {
  return {
    type: UPDATE_QUESTIONCAM_FAILURE,
    payload: error
  };
}

/* Fetch Infowin (single) */

function fetchQuestion(id) {
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/questions/' + id
  });

  return {
    type: FETCH_QUESTION,
    payload: request
  };
}

function fetchQuestionSuccess(activeQuestion) {
  console.log("fetchQuestionSuccess:", activeQuestion);
  return {
    type: FETCH_QUESTION_SUCCESS,
    payload: activeQuestion
  };
}

function fetchQuestionFailure(error) {
  return {
    type: FETCH_QUESTION_FAILURE,
    payload: error
  };
}

function resetActiveQuestion() {
  return {
    type: RESET_ACTIVE_QUESTION
  };
};

/* MODIFY */
function updateQuestion(question) {
  var request = (0, _axios2.default)({
    method: 'put',
    data: { question: question },
    url: _config.ROOT_URL + '/questions'
  });

  return {
    type: UPDATE_QUESTION,
    payload: request
  };
}

function updateQuestionSuccess(activeQuestion) {
  return {
    type: UPDATE_QUESTION_SUCCESS,
    payload: activeQuestion
  };
}

function updateQuestionFailure(error) {
  return {
    type: UPDATE_QUESTION_FAILURE,
    payload: error
  };
}

/* DELETE */

function deleteQuestion(parentType, parentId, id) {
  var request = (0, _axios2.default)({
    method: 'delete',
    url: _config.ROOT_URL + '/questions',
    data: { questionId: id, parentType: parentType, parentId: parentId }
  });
  return {
    type: DELETE_QUESTION,
    payload: request
  };
}

function deleteQuestionSuccess(deletedQuestion) {
  return {
    type: DELETE_QUESTION_SUCCESS,
    payload: deletedQuestion
  };
}

function deleteQuestionFailure(response) {
  return {
    type: DELETE_QUESTION_FAILURE,
    payload: response
  };
}

},{"../config.const":386,"axios":"axios"}],364:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FETCH_THREEDOBJECTS_FAILURE = exports.FETCH_THREEDOBJECTS_SUCCESS = exports.FETCH_THREEDOBJECTS = undefined;
exports.fetchThreeDObjects = fetchThreeDObjects;
exports.fetchThreeDObjectsSuccess = fetchThreeDObjectsSuccess;
exports.fetchThreeDObjectsFailure = fetchThreeDObjectsFailure;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('../config.const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//ThreeDObject list
var FETCH_THREEDOBJECTS = exports.FETCH_THREEDOBJECTS = 'FETCH_THREEDOBJECTS';
var FETCH_THREEDOBJECTS_SUCCESS = exports.FETCH_THREEDOBJECTS_SUCCESS = 'FETCH_THREEDOBJECTS_SUCCESS';
var FETCH_THREEDOBJECTS_FAILURE = exports.FETCH_THREEDOBJECTS_FAILURE = 'FETCH_THREEDOBJECTS_FAILURE';

function fetchThreeDObjects() {
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/threeDObjects',
    params: {},
    headers: []
  });

  return {
    type: FETCH_THREEDOBJECTS,
    payload: request
  };
}

function fetchThreeDObjectsSuccess(threeDObjects) {
  return {
    type: FETCH_THREEDOBJECTS_SUCCESS,
    payload: threeDObjects
  };
}

function fetchThreeDObjectsFailure(error) {
  return {
    type: FETCH_THREEDOBJECTS_FAILURE,
    payload: error
  };
}

},{"../config.const":386,"axios":"axios"}],365:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPDATE_VIEWCAM_FAILURE = exports.UPDATE_VIEWCAM_SUCCESS = exports.UPDATE_VIEWCAM = exports.RESET_DELETED_VIEW = exports.DELETE_VIEW_FAILURE = exports.DELETE_VIEW_SUCCESS = exports.DELETE_VIEW = exports.RESET_ACTIVE_VIEW = exports.FETCH_VIEW_FAILURE = exports.FETCH_VIEW_SUCCESS = exports.FETCH_VIEW = exports.RESET_VIEW_FIELDS = exports.VALIDATE_VIEW_FIELDS_FAILURE = exports.VALIDATE_VIEW_FIELDS_SUCCESS = exports.VALIDATE_VIEW_FIELDS = exports.UPDATE_VIEW_FAILURE = exports.UPDATE_VIEW_SUCCESS = exports.UPDATE_VIEW = exports.RESET_NEW_VIEW = exports.CREATE_VIEW_FAILURE = exports.CREATE_VIEW_SUCCESS = exports.CREATE_VIEW = exports.RESET_SAVE_OVIEWS = exports.SAVE_OVIEWS_FAILURE = exports.SAVE_OVIEWS_SUCCESS = exports.SAVE_OVIEWS = exports.RESET_VIEWS = exports.FETCH_VIEWS_FAILURE = exports.FETCH_VIEWS_SUCCESS = exports.FETCH_VIEWS = undefined;
exports.fetchViews = fetchViews;
exports.fetchViewsSuccess = fetchViewsSuccess;
exports.fetchViewsFailure = fetchViewsFailure;
exports.saveOViews = saveOViews;
exports.saveOViewsSuccess = saveOViewsSuccess;
exports.saveOViewsFailure = saveOViewsFailure;
exports.validateViewFields = validateViewFields;
exports.validateViewFieldsSuccess = validateViewFieldsSuccess;
exports.validateViewFieldsFailure = validateViewFieldsFailure;
exports.resetViewFields = resetViewFields;
exports.createView = createView;
exports.createViewSuccess = createViewSuccess;
exports.createViewFailure = createViewFailure;
exports.resetNewView = resetNewView;
exports.resetDeletedView = resetDeletedView;
exports.updateViewCam = updateViewCam;
exports.updateViewCamSuccess = updateViewCamSuccess;
exports.updateViewCamFailure = updateViewCamFailure;
exports.fetchView = fetchView;
exports.fetchViewSuccess = fetchViewSuccess;
exports.fetchViewFailure = fetchViewFailure;
exports.resetActiveView = resetActiveView;
exports.updateView = updateView;
exports.updateViewSuccess = updateViewSuccess;
exports.updateViewFailure = updateViewFailure;
exports.deleteView = deleteView;
exports.deleteViewSuccess = deleteViewSuccess;
exports.deleteViewFailure = deleteViewFailure;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('../config.const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//View list
var FETCH_VIEWS = exports.FETCH_VIEWS = 'FETCH_VIEWS';
var FETCH_VIEWS_SUCCESS = exports.FETCH_VIEWS_SUCCESS = 'FETCH_VIEWS_SUCCESS';
var FETCH_VIEWS_FAILURE = exports.FETCH_VIEWS_FAILURE = 'FETCH_VIEWS_FAILURE';
var RESET_VIEWS = exports.RESET_VIEWS = 'RESET_VIEWS';

//View save order
var SAVE_OVIEWS = exports.SAVE_OVIEWS = 'SAVE_OVIEWS';
var SAVE_OVIEWS_SUCCESS = exports.SAVE_OVIEWS_SUCCESS = 'SAVE_OVIEWS_SUCCESS';
var SAVE_OVIEWS_FAILURE = exports.SAVE_OVIEWS_FAILURE = 'SAVE_OVIEWS_FAILURE';
var RESET_SAVE_OVIEWS = exports.RESET_SAVE_OVIEWS = 'RESET_SAVE_OVIEWS';

//Create new view
var CREATE_VIEW = exports.CREATE_VIEW = 'CREATE_VIEW';
var CREATE_VIEW_SUCCESS = exports.CREATE_VIEW_SUCCESS = 'CREATE_VIEW_SUCCESS';
var CREATE_VIEW_FAILURE = exports.CREATE_VIEW_FAILURE = 'CREATE_VIEW_FAILURE';
var RESET_NEW_VIEW = exports.RESET_NEW_VIEW = 'RESET_NEW_VIEW';

//Create new view
var UPDATE_VIEW = exports.UPDATE_VIEW = 'UPDATE_VIEW';
var UPDATE_VIEW_SUCCESS = exports.UPDATE_VIEW_SUCCESS = 'UPDATE_VIEW_SUCCESS';
var UPDATE_VIEW_FAILURE = exports.UPDATE_VIEW_FAILURE = 'UPDATE_VIEW_FAILURE';

//Validate view fields like Title, Categries on the server
var VALIDATE_VIEW_FIELDS = exports.VALIDATE_VIEW_FIELDS = 'VALIDATE_VIEW_FIELDS';
var VALIDATE_VIEW_FIELDS_SUCCESS = exports.VALIDATE_VIEW_FIELDS_SUCCESS = 'VALIDATE_VIEW_FIELDS_SUCCESS';
var VALIDATE_VIEW_FIELDS_FAILURE = exports.VALIDATE_VIEW_FIELDS_FAILURE = 'VALIDATE_VIEW_FIELDS_FAILURE';
var RESET_VIEW_FIELDS = exports.RESET_VIEW_FIELDS = 'RESET_VIEW_FIELDS';

//Fetch view
var FETCH_VIEW = exports.FETCH_VIEW = 'FETCH_VIEW';
var FETCH_VIEW_SUCCESS = exports.FETCH_VIEW_SUCCESS = 'FETCH_VIEW_SUCCESS';
var FETCH_VIEW_FAILURE = exports.FETCH_VIEW_FAILURE = 'FETCH_VIEW_FAILURE';
var RESET_ACTIVE_VIEW = exports.RESET_ACTIVE_VIEW = 'RESET_ACTIVE_VIEW';

//Delete view
var DELETE_VIEW = exports.DELETE_VIEW = 'DELETE_VIEW';
var DELETE_VIEW_SUCCESS = exports.DELETE_VIEW_SUCCESS = 'DELETE_VIEW_SUCCESS';
var DELETE_VIEW_FAILURE = exports.DELETE_VIEW_FAILURE = 'DELETE_VIEW_FAILURE';
var RESET_DELETED_VIEW = exports.RESET_DELETED_VIEW = 'RESET_DELETED_VIEW';

//Update CameraCoords
var UPDATE_VIEWCAM = exports.UPDATE_VIEWCAM = 'UPDATE_VIEWCAM';
var UPDATE_VIEWCAM_SUCCESS = exports.UPDATE_VIEWCAM_SUCCESS = 'UPDATE_VIEWCAM_SUCCESS';
var UPDATE_VIEWCAM_FAILURE = exports.UPDATE_VIEWCAM_FAILURE = 'UPDATE_VIEWCAM_FAILURE';

function fetchViews(parentType, parentId) {
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/views',
    params: { parentType: parentType, parentId: parentId },
    headers: []
  });

  return {
    type: FETCH_VIEWS,
    payload: request
  };
}

function fetchViewsSuccess(views) {
  return {
    type: FETCH_VIEWS_SUCCESS,
    payload: views
  };
}

function fetchViewsFailure(error) {
  return {
    type: FETCH_VIEWS_FAILURE,
    payload: error
  };
}

/* Save order */

function saveOViews(viewsSetId, newOrderObject) {
  var request = (0, _axios2.default)({
    method: 'post',
    url: _config.ROOT_URL + '/viewsOrder',
    data: { viewsSetId: viewsSetId, nOrder: newOrderObject || null },
    headers: []
  });

  return {
    type: SAVE_OVIEWS,
    payload: request
  };
}

function saveOViewsSuccess(views) {
  return {
    type: SAVE_OVIEWS_SUCCESS,
    payload: views
  };
}

function saveOViewsFailure(error) {
  return {
    type: SAVE_OVIEWS_FAILURE,
    payload: error
  };
}

/* Validate */

function validateViewFields(props) {
  //note: we cant have /views/validateFields because it'll match /views/:id path!
  var request = _axios2.default.view(_config.ROOT_URL + '/views/validate/fields', props);

  return {
    type: VALIDATE_VIEW_FIELDS,
    payload: request
  };
}

function validateViewFieldsSuccess() {
  return {
    type: VALIDATE_VIEW_FIELDS_SUCCESS
  };
}

function validateViewFieldsFailure(error) {
  return {
    type: VALIDATE_VIEW_FIELDS_FAILURE,
    payload: error
  };
}

/* New */

function resetViewFields() {
  return {
    type: RESET_VIEW_FIELDS
  };
}

function createView(props, viewsSetId) {
  var request = (0, _axios2.default)({
    method: 'post',
    data: { view: props, viewsSetId: viewsSetId },
    url: _config.ROOT_URL + '/views'
  });

  return {
    type: CREATE_VIEW,
    payload: request
  };
}

function createViewSuccess(newView) {
  return {
    type: CREATE_VIEW_SUCCESS,
    payload: newView
  };
}

function createViewFailure(error) {
  return {
    type: CREATE_VIEW_FAILURE,
    payload: error
  };
}

function resetNewView() {
  return {
    type: RESET_NEW_VIEW
  };
};

function resetDeletedView() {
  return {
    type: RESET_DELETED_VIEW
  };
};

/* UPDATE_VIEWCAM */

function updateViewCam(view) {

  var request = new Promise(function (resolve, reject) {
    var ct = window.app3dViewer.viewPosition();
    //setTimeout(function() {
    var newView = _.clone(view || {});
    if (!newView.cameraPosition) {
      newView.cameraPosition = { x: 0, y: 0, z: 0 };
    }
    if (!newView.targetPosition) {
      newView.targetPosition = { x: 0, y: 0, z: 0 };
    }
    newView.cameraPosition.x = Math.round(ct[0].x * 1000) / 1000;
    newView.cameraPosition.y = Math.round(ct[0].y * 1000) / 1000;
    newView.cameraPosition.z = Math.round(ct[0].z * 1000) / 1000;
    newView.targetPosition.x = Math.round(ct[1].x * 1000) / 1000;
    newView.targetPosition.y = Math.round(ct[1].y * 1000) / 1000;
    newView.targetPosition.z = Math.round(ct[1].z * 1000) / 1000;
    resolve({ data: { data: newView } });
    //}, 200);
  });

  return {
    type: UPDATE_VIEWCAM,
    payload: request
  };
}

function updateViewCamSuccess(newView) {
  return {
    type: UPDATE_VIEWCAM_SUCCESS,
    payload: newView
  };
}

function updateViewCamFailure(error) {
  return {
    type: UPDATE_VIEWCAM_FAILURE,
    payload: error
  };
}

/* Fetch View (single) */

function fetchView(id) {
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/views/' + id
  });

  return {
    type: FETCH_VIEW,
    payload: request
  };
}

function fetchViewSuccess(activeView) {
  return {
    type: FETCH_VIEW_SUCCESS,
    payload: activeView
  };
}

function fetchViewFailure(error) {
  return {
    type: FETCH_VIEW_FAILURE,
    payload: error
  };
}

function resetActiveView() {
  return {
    type: RESET_ACTIVE_VIEW
  };
};

/* MODIFY */
function updateView(view) {
  var request = (0, _axios2.default)({
    method: 'put',
    data: { view: view },
    url: _config.ROOT_URL + '/views'
  });

  return {
    type: UPDATE_VIEW,
    payload: request
  };
}

function updateViewSuccess(activeView) {
  return {
    type: UPDATE_VIEW_SUCCESS,
    payload: activeView
  };
}

function updateViewFailure(error) {
  return {
    type: UPDATE_VIEW_FAILURE,
    payload: error
  };
}

/* DELETE */

function deleteView(id, viewsSetId) {
  var request = (0, _axios2.default)({
    method: 'delete',
    url: _config.ROOT_URL + '/views',
    data: { viewId: id, viewsSetId: viewsSetId }
  });
  return {
    type: DELETE_VIEW,
    payload: request
  };
}

function deleteViewSuccess(deletedView) {
  return {
    type: DELETE_VIEW_SUCCESS,
    payload: deletedView
  };
}

function deleteViewFailure(response) {
  return {
    type: DELETE_VIEW_FAILURE,
    payload: response
  };
}

},{"../config.const":386,"axios":"axios"}],366:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPDATE_VIEWSSETCAM_FAILURE = exports.UPDATE_VIEWSSETCAM_SUCCESS = exports.UPDATE_VIEWSSETCAM = exports.RESET_DELETED_VIEWSSET = exports.DELETE_VIEWSSET_FAILURE = exports.DELETE_VIEWSSET_SUCCESS = exports.DELETE_VIEWSSET = exports.RESET_ACTIVE_VIEWSSET = exports.FETCH_VIEWSSET_FAILURE = exports.FETCH_VIEWSSET_SUCCESS = exports.FETCH_VIEWSSET = exports.RESET_VIEWSSET_FIELDS = exports.VALIDATE_VIEWSSET_FIELDS_FAILURE = exports.VALIDATE_VIEWSSET_FIELDS_SUCCESS = exports.VALIDATE_VIEWSSET_FIELDS = exports.UPDATE_VIEWSSET_FAILURE = exports.UPDATE_VIEWSSET_SUCCESS = exports.UPDATE_VIEWSSET = exports.RESET_NEW_VIEWSSET = exports.CREATE_VIEWSSET_FAILURE = exports.CREATE_VIEWSSET_SUCCESS = exports.CREATE_VIEWSSET = exports.RESET_SAVE_OVIEWSSETS = exports.SAVE_OVIEWSSETS_FAILURE = exports.SAVE_OVIEWSSETS_SUCCESS = exports.SAVE_OVIEWSSETS = exports.RESET_VIEWSSETS = exports.FETCH_VIEWSSETS_FAILURE = exports.FETCH_VIEWSSETS_SUCCESS = exports.FETCH_VIEWSSETS = undefined;
exports.fetchViewsSets = fetchViewsSets;
exports.fetchViewsSetsSuccess = fetchViewsSetsSuccess;
exports.fetchViewsSetsFailure = fetchViewsSetsFailure;
exports.saveOViewsSets = saveOViewsSets;
exports.saveOViewsSetsSuccess = saveOViewsSetsSuccess;
exports.saveOViewsSetsFailure = saveOViewsSetsFailure;
exports.validateViewsSetFields = validateViewsSetFields;
exports.validateViewsSetFieldsSuccess = validateViewsSetFieldsSuccess;
exports.validateViewsSetFieldsFailure = validateViewsSetFieldsFailure;
exports.resetViewsSetFields = resetViewsSetFields;
exports.createViewsSet = createViewsSet;
exports.createViewsSetSuccess = createViewsSetSuccess;
exports.createViewsSetFailure = createViewsSetFailure;
exports.resetNewViewsSet = resetNewViewsSet;
exports.resetDeletedViewsSet = resetDeletedViewsSet;
exports.fetchViewsSet = fetchViewsSet;
exports.fetchViewsSetSuccess = fetchViewsSetSuccess;
exports.fetchViewsSetFailure = fetchViewsSetFailure;
exports.resetActiveViewsSet = resetActiveViewsSet;
exports.updateViewsSet = updateViewsSet;
exports.updateViewsSetSuccess = updateViewsSetSuccess;
exports.updateViewsSetFailure = updateViewsSetFailure;
exports.deleteViewsSet = deleteViewsSet;
exports.deleteViewsSetSuccess = deleteViewsSetSuccess;
exports.deleteViewsSetFailure = deleteViewsSetFailure;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('../config.const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//ViewsSet list
var FETCH_VIEWSSETS = exports.FETCH_VIEWSSETS = 'FETCH_VIEWSSETS';
var FETCH_VIEWSSETS_SUCCESS = exports.FETCH_VIEWSSETS_SUCCESS = 'FETCH_VIEWSSETS_SUCCESS';
var FETCH_VIEWSSETS_FAILURE = exports.FETCH_VIEWSSETS_FAILURE = 'FETCH_VIEWSSETS_FAILURE';
var RESET_VIEWSSETS = exports.RESET_VIEWSSETS = 'RESET_VIEWSSETS';

//ViewsSet save order
var SAVE_OVIEWSSETS = exports.SAVE_OVIEWSSETS = 'SAVE_OVIEWSSETS';
var SAVE_OVIEWSSETS_SUCCESS = exports.SAVE_OVIEWSSETS_SUCCESS = 'SAVE_OVIEWSSETS_SUCCESS';
var SAVE_OVIEWSSETS_FAILURE = exports.SAVE_OVIEWSSETS_FAILURE = 'SAVE_OVIEWSSETS_FAILURE';
var RESET_SAVE_OVIEWSSETS = exports.RESET_SAVE_OVIEWSSETS = 'RESET_SAVE_OVIEWSSETS';

//Create new viewsSet
var CREATE_VIEWSSET = exports.CREATE_VIEWSSET = 'CREATE_VIEWSSET';
var CREATE_VIEWSSET_SUCCESS = exports.CREATE_VIEWSSET_SUCCESS = 'CREATE_VIEWSSET_SUCCESS';
var CREATE_VIEWSSET_FAILURE = exports.CREATE_VIEWSSET_FAILURE = 'CREATE_VIEWSSET_FAILURE';
var RESET_NEW_VIEWSSET = exports.RESET_NEW_VIEWSSET = 'RESET_NEW_VIEWSSET';

//Create new viewsSet
var UPDATE_VIEWSSET = exports.UPDATE_VIEWSSET = 'UPDATE_VIEWSSET';
var UPDATE_VIEWSSET_SUCCESS = exports.UPDATE_VIEWSSET_SUCCESS = 'UPDATE_VIEWSSET_SUCCESS';
var UPDATE_VIEWSSET_FAILURE = exports.UPDATE_VIEWSSET_FAILURE = 'UPDATE_VIEWSSET_FAILURE';

//Validate viewsSet fields like Title, Categries on the server
var VALIDATE_VIEWSSET_FIELDS = exports.VALIDATE_VIEWSSET_FIELDS = 'VALIDATE_VIEWSSET_FIELDS';
var VALIDATE_VIEWSSET_FIELDS_SUCCESS = exports.VALIDATE_VIEWSSET_FIELDS_SUCCESS = 'VALIDATE_VIEWSSET_FIELDS_SUCCESS';
var VALIDATE_VIEWSSET_FIELDS_FAILURE = exports.VALIDATE_VIEWSSET_FIELDS_FAILURE = 'VALIDATE_VIEWSSET_FIELDS_FAILURE';
var RESET_VIEWSSET_FIELDS = exports.RESET_VIEWSSET_FIELDS = 'RESET_VIEWSSET_FIELDS';

//Fetch viewsSet
var FETCH_VIEWSSET = exports.FETCH_VIEWSSET = 'FETCH_VIEWSSET';
var FETCH_VIEWSSET_SUCCESS = exports.FETCH_VIEWSSET_SUCCESS = 'FETCH_VIEWSSET_SUCCESS';
var FETCH_VIEWSSET_FAILURE = exports.FETCH_VIEWSSET_FAILURE = 'FETCH_VIEWSSET_FAILURE';
var RESET_ACTIVE_VIEWSSET = exports.RESET_ACTIVE_VIEWSSET = 'RESET_ACTIVE_VIEWSSET';

//Delete viewsSet
var DELETE_VIEWSSET = exports.DELETE_VIEWSSET = 'DELETE_VIEWSSET';
var DELETE_VIEWSSET_SUCCESS = exports.DELETE_VIEWSSET_SUCCESS = 'DELETE_VIEWSSET_SUCCESS';
var DELETE_VIEWSSET_FAILURE = exports.DELETE_VIEWSSET_FAILURE = 'DELETE_VIEWSSET_FAILURE';
var RESET_DELETED_VIEWSSET = exports.RESET_DELETED_VIEWSSET = 'RESET_DELETED_VIEWSSET';

//Update CameraCoords
var UPDATE_VIEWSSETCAM = exports.UPDATE_VIEWSSETCAM = 'UPDATE_VIEWSSETCAM';
var UPDATE_VIEWSSETCAM_SUCCESS = exports.UPDATE_VIEWSSETCAM_SUCCESS = 'UPDATE_VIEWSSETCAM_SUCCESS';
var UPDATE_VIEWSSETCAM_FAILURE = exports.UPDATE_VIEWSSETCAM_FAILURE = 'UPDATE_VIEWSSETCAM_FAILURE';

function fetchViewsSets(worldId) {
  var upd = Number(new Date());
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/viewsSets',
    params: { worldId: worldId, upd: upd }
  });

  return {
    type: FETCH_VIEWSSETS,
    payload: request
  };
}

function fetchViewsSetsSuccess(viewsSets) {
  return {
    type: FETCH_VIEWSSETS_SUCCESS,
    payload: viewsSets
  };
}

function fetchViewsSetsFailure(error) {
  return {
    type: FETCH_VIEWSSETS_FAILURE,
    payload: error
  };
}

/* Save order */

function saveOViewsSets(worldId, newOrderObject) {
  var request = (0, _axios2.default)({
    method: 'post',
    url: _config.ROOT_URL + '/viewsSetsOrder',
    data: { worldId: worldId, nOrder: newOrderObject || null },
    headers: []
  });

  return {
    type: SAVE_OVIEWSSETS,
    payload: request
  };
}

function saveOViewsSetsSuccess(viewsSets) {
  return {
    type: SAVE_OVIEWSSETS_SUCCESS,
    payload: viewsSets
  };
}

function saveOViewsSetsFailure(error) {
  return {
    type: SAVE_OVIEWSSETS_FAILURE,
    payload: error
  };
}

/* Validate */

function validateViewsSetFields(props) {
  //note: we cant have /viewsSets/validateFields because it'll match /viewsSets/:id path!
  var request = _axios2.default.viewsSet(_config.ROOT_URL + '/viewsSets/validate/fields', props);

  return {
    type: VALIDATE_VIEWSSET_FIELDS,
    payload: request
  };
}

function validateViewsSetFieldsSuccess() {
  return {
    type: VALIDATE_VIEWSSET_FIELDS_SUCCESS
  };
}

function validateViewsSetFieldsFailure(error) {
  return {
    type: VALIDATE_VIEWSSET_FIELDS_FAILURE,
    payload: error
  };
}

/* New */

function resetViewsSetFields() {
  return {
    type: RESET_VIEWSSET_FIELDS
  };
};

function createViewsSet(props, worldId) {
  var request = (0, _axios2.default)({
    method: 'post',
    data: { viewsSet: props, worldId: worldId },
    url: _config.ROOT_URL + '/viewsSets'
  });

  return {
    type: CREATE_VIEWSSET,
    payload: request
  };
}

function createViewsSetSuccess(newViewsSet) {
  return {
    type: CREATE_VIEWSSET_SUCCESS,
    payload: newViewsSet
  };
}

function createViewsSetFailure(error) {
  return {
    type: CREATE_VIEWSSET_FAILURE,
    payload: error
  };
}

function resetNewViewsSet() {
  return {
    type: RESET_NEW_VIEWSSET
  };
};

function resetDeletedViewsSet() {
  return {
    type: RESET_DELETED_VIEWSSET
  };
};

/* Fetch ViewsSet (single) */

function fetchViewsSet(id) {
  var request = (0, _axios2.default)({
    method: 'get',
    url: _config.ROOT_URL + '/viewsSets/' + id
  });

  return {
    type: FETCH_VIEWSSET,
    payload: request
  };
}

function fetchViewsSetSuccess(activeViewsSet) {
  return {
    type: FETCH_VIEWSSET_SUCCESS,
    payload: activeViewsSet
  };
}

function fetchViewsSetFailure(error) {
  return {
    type: FETCH_VIEWSSET_FAILURE,
    payload: error
  };
}

function resetActiveViewsSet() {
  return {
    type: RESET_ACTIVE_VIEWSSET
  };
};

/* MODIFY */
function updateViewsSet(viewsSet) {
  var request = (0, _axios2.default)({
    method: 'put',
    data: { viewsSet: viewsSet },
    url: _config.ROOT_URL + '/viewsSets'
  });

  return {
    type: UPDATE_VIEWSSET,
    payload: request
  };
}

function updateViewsSetSuccess(activeViewsSet) {
  return {
    type: UPDATE_VIEWSSET_SUCCESS,
    payload: activeViewsSet
  };
}

function updateViewsSetFailure(error) {
  return {
    type: UPDATE_VIEWSSET_FAILURE,
    payload: error
  };
}

/* DELETE */

function deleteViewsSet(id, worldId) {
  var request = (0, _axios2.default)({
    method: 'delete',
    url: _config.ROOT_URL + '/viewsSets',
    data: { viewsSetId: id, worldId: worldId }
  });
  return {
    type: DELETE_VIEWSSET,
    payload: request
  };
}

function deleteViewsSetSuccess(deletedViewsSet) {
  return {
    type: DELETE_VIEWSSET_SUCCESS,
    payload: deletedViewsSet
  };
}

function deleteViewsSetFailure(response) {
  return {
    type: DELETE_VIEWSSET_FAILURE,
    payload: response
  };
}

},{"../config.const":386,"axios":"axios"}],367:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchCamPos = fetchCamPos;
exports.fetchCamPosSuccess = fetchCamPosSuccess;
exports.fetchCamPosFailure = fetchCamPosFailure;
//Camera coords
var FETCH_CAMPOS = exports.FETCH_CAMPOS = 'FETCH_CAMPOS';
var FETCH_CAMPOS_SUCCESS = exports.FETCH_CAMPOS_SUCCESS = 'FETCH_CAMPOS_SUCCESS';
var FETCH_CAMPOS_FAILURE = exports.FETCH_CAMPOS_FAILURE = 'FETCH_CAMPOS_FAILURE';

function fetchCamPos() {
  var request = new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(window.app3dViewer.viewPosition());
    }, 200);
  });

  return {
    type: FETCH_CAMPOS,
    payload: request
  };
}

function fetchCamPosSuccess(data) {
  return {
    type: FETCH_CAMPOS_SUCCESS,
    payload: data
  };
}

function fetchCamPosFailure(error) {
  return {
    type: FETCH_CAMPOS_FAILURE,
    payload: error
  };
}

},{}],368:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
    _inherits(App, _Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'scrollable' },
                this.props.children
            );
        }
    }]);

    return App;
}(_react.Component);

exports.default = App;

},{"react":"react"}],369:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _config = require('../config.const');

var _reactBootstrapTable = require('react-bootstrap-table');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var customConfirm = function customConfirm(next, dropRowKeys) {
    if (confirm('Are you sure you want to delete them?')) {
        next();
    }
};

function onAddRow(row) {
    //console.log("onAddRow", row);
}

var options = {
    handleConfirmDeleteRow: customConfirm,
    onAddRow: onAddRow
};

var selectRowProp = {
    mode: 'checkbox'
};

var cellEditProp = {
    mode: 'click',
    blurToSave: true
};

var GearmapList = function (_Component) {
    _inherits(GearmapList, _Component);

    function GearmapList() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, GearmapList);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GearmapList.__proto__ || Object.getPrototypeOf(GearmapList)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            objectsList: []
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(GearmapList, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var objs = (window.app3dViewer.renderer3d._modelsMapNames || []).sort();
            this.setState({ objectsList: objs });
            this.props.fetchGearmap();
        }
    }, {
        key: 'save',
        value: function save() {
            var gmArray = this.props.gearmapList.gearmap,
                gmu,
                newGearmap = {};

            for (var j = 0, lenJ = gmArray.length; j < lenJ; j += 1) {
                gmu = gmArray[j];
                if (!gmu.dkey) {
                    continue;
                }
                newGearmap[gmu.dkey] = gmu.dval;
            }

            var saver = this.props.saveGearmap(newGearmap, window.config.mainScene.worldId),
                router = this.props.router,
                me = this;

            saver.then(function () {
                window.alert("You have to re-load this World to see the changes (Ctrl-R or F5)");
                router.push("/");
            }, function (error) {
                console.log(error);
            });
        }
    }, {
        key: 'renderGearmap',
        value: function renderGearmap(gearmap) {
            var objectsList = this.state.objectsList;
            return _react2.default.createElement(
                _reactBootstrapTable.BootstrapTable,
                { data: gearmap,
                    cellEdit: cellEditProp,
                    insertRow: true, deleteRow: true, selectRow: selectRowProp,
                    keyField: 'didd',
                    options: options, striped: true, hover: true },
                _react2.default.createElement(
                    _reactBootstrapTable.TableHeaderColumn,
                    { dataField: 'didd', hiddenOnInsert: true, autoValue: true },
                    'Order'
                ),
                _react2.default.createElement(
                    _reactBootstrapTable.TableHeaderColumn,
                    { dataField: 'dkey', editable: { type: 'select', options: { values: objectsList } } },
                    'Object'
                ),
                _react2.default.createElement(
                    _reactBootstrapTable.TableHeaderColumn,
                    { dataField: 'dval', editable: { type: 'text' } },
                    'Mapped to'
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _props$gearmapList = this.props.gearmapList;
            var gearmap = _props$gearmapList.gearmap;
            var loading = _props$gearmapList.loading;
            var error = _props$gearmapList.error;


            if (loading) {
                return _react2.default.createElement(
                    'div',
                    { className: 'container' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        'Gear Map'
                    ),
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Loading...'
                    )
                );
            } else if (error) {
                return _react2.default.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    'Error: ',
                    error.message || _config.ERROR_RESOURCE
                );
            }

            return _react2.default.createElement(
                'div',
                { className: 'container pos-rel' },
                _react2.default.createElement(
                    'div',
                    { className: 'view-title' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        'Gear Map'
                    )
                ),
                _react2.default.createElement(
                    'button',
                    { type: 'submit', className: 'top-right btn btn-primary', onClick: this.save.bind(this) },
                    _react2.default.createElement('span', { className: 'fa fa-save' }),
                    ' Save'
                ),
                this.renderGearmap(gearmap),
                _react2.default.createElement(
                    'button',
                    { className: 'btn btn-primary', onClick: this.save.bind(this) },
                    _react2.default.createElement('span', { className: 'fa fa-save' }),
                    ' Save'
                )
            );
        }
    }]);

    return GearmapList;
}(_react.Component);

exports.default = GearmapList;

},{"../config.const":386,"react":"react","react-bootstrap-table":53,"react-router":"react-router"}],370:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _views = require('../actions/views');

var _infowins = require('../actions/infowins');

var _infowinValidator = require('../validators/infowinValidator');

var _inputs = require('./inputs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var worldId = window.config.mainScene.worldId;

//For any field errors upon submission (i.e. not instant check)
var validateAndUpdateInfowin = function validateAndUpdateInfowin(values, dispatch) {

  return new Promise(function (resolve, reject) {
    dispatch((0, _infowins.updateInfowin)(_extends({}, values, { world: worldId }))).then(function (response) {
      var data = response.payload.data;
      //if any one of these exist, then there is a field error
      if (response.payload.status != 200) {
        dispatch((0, _infowins.updateInfowinFailure)(response.payload));
        reject(data);
      } else {
        dispatch((0, _infowins.updateInfowinSuccess)(response.payload));
        resolve(values);
      }
    });
  });
};

/* CLASS */

var InfowinsForm = function (_Component) {
  _inherits(InfowinsForm, _Component);

  function InfowinsForm() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, InfowinsForm);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InfowinsForm.__proto__ || Object.getPrototypeOf(InfowinsForm)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      lastModified: null
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InfowinsForm, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.infowinId !== this.props.infowinId) {
        this.props.fetchInfowin(nextProps.infowinId);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.fetchInfowin(this.props.infowinId);
      this.props.fetchViews();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      _reactDom2.default.findDOMNode(this).scrollIntoView();
    }
  }, {
    key: 'renderError',
    value: function renderError(activeInfowin) {
      if (activeInfowin && activeInfowin.error && activeInfowin.error.message) {
        return _react2.default.createElement(
          'div',
          { className: 'alert alert-danger' },
          activeInfowin ? activeInfowin.error.message : ''
        );
      } else {
        return _react2.default.createElement('span', null);
      }
    }
  }, {
    key: 'saveInfowin',
    value: function saveInfowin(values, dispatch) {
      var saver = validateAndUpdateInfowin(values, dispatch),
          router = this.context.router;
      saver.then(function () {
        router.goBack();
      });
    }
  }, {
    key: 'deletethisInfowin',
    value: function deletethisInfowin() {
      var _this2 = this;

      if (window.confirm('Are you sure to delete this?')) {
        (function () {
          var deleter = _this2.props.deleteInfowin(_this2.props.parentType, _this2.props.parentId, _this2.props.infowinId),
              router = _this2.context.router;
          deleter.then(function () {
            router.push("/infowins");
          });
        })();
      }
    }
  }, {
    key: 'cloneThisInfowin',
    value: function cloneThisInfowin() {
      alert("This functionality has been disabled: It generates an inconsistency in the DB.");
      return;
      /*
      let cloner = this.props.cloneInfowin(this.props.parentType, this.props.parentId, this.props.selectedRelativePosition, this.props.infowinId),
        router = this.context.router;
      cloner.then(function(){
        router.goBack();
      });*/
    }
  }, {
    key: 'renderChildInfowins',
    value: function renderChildInfowins(activeInfowin) {
      if (activeInfowin && activeInfowin.infowin && activeInfowin.infowin.infowins && activeInfowin.infowin.infowins.length > 0) {
        return activeInfowin.infowin.infowins.map(function (childInfowin) {
          if (childInfowin.qtype && childInfowin.qtype != '') {
            return _react2.default.createElement(
              'li',
              { className: 'list-group-item', key: childInfowin._id },
              _react2.default.createElement(
                _reactRouter.Link,
                { to: "/questions/infowin/" + activeInfowin.infowin._id + "/" + childInfowin._id },
                _react2.default.createElement(
                  'h3',
                  { className: 'list-group-item-heading' },
                  childInfowin.title
                )
              )
            );
          } else {
            return _react2.default.createElement(
              'li',
              { className: 'list-group-item', key: childInfowin._id },
              _react2.default.createElement(
                _reactRouter.Link,
                { to: "/infowins/infowin/" + activeInfowin.infowin._id + "/" + childInfowin._id },
                _react2.default.createElement(
                  'h3',
                  { className: 'list-group-item-heading' },
                  childInfowin.title
                )
              )
            );
          }
        });
      }
      return null;
    }
  }, {
    key: 'renderMarkers',
    value: function renderMarkers(activeInfowin) {
      if (activeInfowin && activeInfowin.infowin && activeInfowin.infowin.markers && activeInfowin.infowin.markers.length) {
        return activeInfowin.infowin.markers.map(function (marker) {
          return _react2.default.createElement(
            'li',
            { className: 'list-group-item', key: marker._id },
            _react2.default.createElement(
              _reactRouter.Link,
              { to: "/markers/" + activeInfowin.infowin._id + "/" + marker._id },
              _react2.default.createElement(
                'h3',
                { className: 'list-group-item-heading' },
                marker.title
              )
            )
          );
        });
      }
      return null;
    }
  }, {
    key: 'populateViewSelections',
    value: function populateViewSelections() {
      var viewsList = this.props.viewsList;

      if (!viewsList.views || viewsList.views.length === 0) {
        return null;
      }

      var viewsListSelections = viewsList.views.map(function (viewIterator) {
        return {
          label: viewIterator.title,
          value: viewIterator._id
        };
      });

      return viewsListSelections;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var asyncValidating = _props.asyncValidating;
      var handleSubmit = _props.handleSubmit;
      var submitting = _props.submitting;
      var cloning = _props.cloning;
      var activeInfowin = _props.activeInfowin;

      var viewsListSelections = this.populateViewSelections();
      var clonedRelativePositionSelections = [{
        label: 'Before',
        value: 'before'
      }, {
        label: 'After',
        value: 'after'
      }];

      return _react2.default.createElement(
        'div',
        { className: 'container' },
        _react2.default.createElement(
          'div',
          { className: 'view-title' },
          _react2.default.createElement(
            'h1',
            null,
            'Edit Infowin'
          ),
          activeInfowin.infowin && _react2.default.createElement(
            _reactRouter.Link,
            { to: "/infowins/new/infowin/" + activeInfowin.infowin._id },
            '+ Add New Child Info Window'
          ),
          activeInfowin.infowin && _react2.default.createElement(
            _reactRouter.Link,
            { to: "/questions/new/infowin/" + activeInfowin.infowin._id },
            '+ Add New Child Question'
          ),
          activeInfowin.infowin && _react2.default.createElement(
            _reactRouter.Link,
            { to: "/markers/new/" + activeInfowin.infowin._id },
            '+ Add New Marker'
          )
        ),
        activeInfowin.infowin ? _react2.default.createElement(
          'h2',
          null,
          activeInfowin.infowin.title
        ) : null,
        this.renderError(activeInfowin),
        _react2.default.createElement(
          'form',
          { onSubmit: handleSubmit(this.saveInfowin.bind(this)) },
          _react2.default.createElement(_reduxForm.Field, { name: 'title', component: _inputs.renderInput, type: 'text', placeholder: 'Title', label: 'Title' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'name', component: _inputs.renderInput, type: 'text', placeholder: 'Name', label: 'Name' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'type', component: _inputs.renderInput, type: 'text', placeholder: 'Type', label: 'Type' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'thumbnail_src', component: _inputs.renderInput, type: 'text', placeholder: 'Url of image', label: 'Thumbnail src (http://...)' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'description', component: _inputs.renderTextarea, placeholder: 'Description', label: 'Description', rows: '3' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'html', component: _inputs.renderTextarea, placeholder: '<p>...</p>', label: 'Html', rows: '6' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'view', component: _inputs.renderObjectSelect, label: 'View', dataArray: viewsListSelections }),
          _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
              'div',
              { className: 'col-sm-8' },
              _react2.default.createElement(_reduxForm.Field, { name: 'clonedRelativePosition', component: _inputs.renderObjectSelect, label: 'Clone', dataArray: clonedRelativePositionSelections })
            ),
            _react2.default.createElement(
              'div',
              { className: 'col-sm-4' },
              _react2.default.createElement(
                'button',
                { type: 'button', className: 'btn btn-info btn-clone',
                  onClick: this.cloneThisInfowin.bind(this),
                  disabled: cloning || !this.props.selectedRelativePosition },
                'Clone'
              )
            )
          ),
          activeInfowin && activeInfowin.infowin && activeInfowin.infowin.infowins && activeInfowin.infowin.infowins.length > 0 && _react2.default.createElement(
            'div',
            { className: 'child-infowins children-list form-group' },
            _react2.default.createElement(
              'h3',
              null,
              'Child Infowins'
            ),
            this.renderChildInfowins(activeInfowin)
          ),
          activeInfowin && activeInfowin.infowin && activeInfowin.infowin.markers && activeInfowin.infowin.markers.length > 0 && _react2.default.createElement(
            'div',
            { className: 'child-markers children-list form-group' },
            _react2.default.createElement(
              'h3',
              null,
              'Markers'
            ),
            this.renderMarkers(activeInfowin)
          ),
          _react2.default.createElement(
            'div',
            { className: 'form-group' },
            _react2.default.createElement(
              'button',
              { type: 'submit', className: 'btn btn-primary', disabled: submitting },
              _react2.default.createElement('span', { className: 'fa fa-save' }),
              ' Save'
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: '/infowins', className: 'btn btn-error' },
              'Cancel'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'form-group pull-right' },
            _react2.default.createElement(
              'button',
              { type: 'button', className: 'btn btn-danger',
                onClick: this.deletethisInfowin.bind(this),
                disabled: submitting },
              'Delete this infowin ',
              _react2.default.createElement('span', { className: 'fa fa-times' })
            )
          )
        )
      );
    }
  }]);

  return InfowinsForm;
}(_react.Component);

InfowinsForm.contextTypes = {
  router: _react.PropTypes.object
};


InfowinsForm = (0, _reduxForm.reduxForm)({
  form: 'infowinsNewForm',
  enableReinitialize: true,
  validate: _infowinValidator.validateInfowin
})(InfowinsForm);

var selector = (0, _reduxForm.formValueSelector)('infowinsNewForm');

InfowinsForm = (0, _reactRedux.connect)(function (state, ownProps) {
  return {
    parentType: ownProps.parentType,
    parentId: ownProps.parentId,
    infowinId: ownProps.id,
    viewsList: state.views.viewsList,
    initialValues: state.infowins.activeInfowin.infowin,
    activeInfowin: state.infowins.activeInfowin, // pull initial values from infowins reducer
    selectedRelativePosition: selector(state, 'clonedRelativePosition'),
    cloning: state.infowins.clonedInfowin.loading
  };
}, function (dispatch) {
  return {
    fetchViews: function fetchViews() {
      dispatch((0, _views.fetchViews)('world', worldId)).then(function (response) {
        !response.error ? dispatch((0, _views.fetchViewsSuccess)(response.payload.data)) : dispatch((0, _views.fetchViewsFailure)(response.payload));
      });
    },
    fetchInfowin: function fetchInfowin(id) {
      dispatch((0, _infowins.fetchInfowin)(id)).then(function (response) {
        !response.error ? dispatch((0, _infowins.fetchInfowinSuccess)(response.payload.data)) : dispatch(fetchInfowinFailure(response.payload));
      });
    },
    deleteInfowin: function deleteInfowin(parentType, parentId, id) {
      return new Promise(function (resolve, reject) {
        dispatch((0, _infowins.deleteInfowin)(parentType, parentId, id)).then(function (response) {
          var data = response.payload.data;
          if (!response.error) {
            dispatch((0, _infowins.deleteInfowinSuccess)(response.payload.data));
            resolve();
          } else {
            dispatch((0, _infowins.deleteInfowinFailure)(response.payload));
            reject(data);
          }
        });
      });
    },
    cloneInfowin: function cloneInfowin(parentType, parentId, relativePosition, id) {
      return new Promise(function (resolve, reject) {
        dispatch((0, _infowins.cloneInfowin)(parentType, parentId, relativePosition, id)).then(function (response) {
          var data = response.payload.data;
          if (!response.error) {
            dispatch((0, _infowins.cloneInfowinSuccess)(response.payload.data));
            resolve();
          } else {
            dispatch((0, _infowins.cloneInfowinFailure)(response.payload));
            reject(data);
          }
        });
      });
    },
    resetMe: function resetMe() {
      dispatch((0, _infowins.resetActiveInfowin)());
    }
  };
})(InfowinsForm);

exports.default = InfowinsForm;

},{"../actions/infowins":361,"../actions/views":365,"../validators/infowinValidator":424,"./inputs":385,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router","redux-form":"redux-form"}],371:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _config = require('../config.const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var worldId = window.config.mainScene.worldId;

var InfowinsList = function (_Component) {
    _inherits(InfowinsList, _Component);

    function InfowinsList() {
        _classCallCheck(this, InfowinsList);

        return _possibleConstructorReturn(this, (InfowinsList.__proto__ || Object.getPrototypeOf(InfowinsList)).apply(this, arguments));
    }

    _createClass(InfowinsList, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.fetchInfowins();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.infowinsList.loading) {
                _reactDom2.default.findDOMNode(this).scrollIntoView();
            }
        }
    }, {
        key: 'renderInfowins',
        value: function renderInfowins(infowins) {
            return infowins.map(function (infowin) {
                return _react2.default.createElement(
                    'li',
                    { className: 'list-group-item', key: infowin._id },
                    _react2.default.createElement(
                        _reactRouter.Link,
                        { to: "/infowins/world/" + worldId + "/" + infowin._id },
                        _react2.default.createElement(
                            'h3',
                            { className: 'list-group-item-heading' },
                            infowin.title
                        )
                    )
                );
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props$infowinsList = this.props.infowinsList;
            var infowins = _props$infowinsList.infowins;
            var loading = _props$infowinsList.loading;
            var error = _props$infowinsList.error;


            if (loading) {
                return _react2.default.createElement(
                    'div',
                    { className: 'container' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        'Info Windows'
                    ),
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Loading...'
                    )
                );
            } else if (error) {
                return _react2.default.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    'Error: ',
                    error.message || _config.ERROR_RESOURCE
                );
            }

            return _react2.default.createElement(
                'div',
                { className: 'container pos-rel' },
                _react2.default.createElement(
                    'div',
                    { className: 'view-title' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        'Info Windows'
                    ),
                    _react2.default.createElement(
                        _reactRouter.Link,
                        { to: "/infowins/new/world/" + worldId },
                        '+ Add new Info Window'
                    )
                ),
                this.renderInfowins(infowins)
            );
        }
    }]);

    return InfowinsList;
}(_react.Component);

exports.default = InfowinsList;

},{"../config.const":386,"react":"react","react-dom":"react-dom","react-router":"react-router"}],372:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _views = require('../actions/views');

var _infowins = require('../actions/infowins');

var _infowinValidator = require('../validators/infowinValidator');

var _inputs = require('./inputs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var worldId = window.config.mainScene.worldId;

//For any field errors upon submission (i.e. not instant check)
var validateAndCreateInfowin = function validateAndCreateInfowin(values, dispatch, parentType, parentId) {

  return new Promise(function (resolve, reject) {
    dispatch((0, _infowins.createInfowin)(_extends({}, values, { world: worldId }), parentType, parentId)).then(function (response) {
      var data = response.payload.data;
      //if any one of these exist, then there is a field error
      if (response.payload.status != 200) {
        dispatch((0, _infowins.createInfowinFailure)(response.payload));
        reject(data);
      } else {
        dispatch((0, _infowins.createInfowinSuccess)(response.payload));
        resolve(values);
      }
    });
  });
};

/* CLASS */

var InfowinForm = function (_Component) {
  _inherits(InfowinForm, _Component);

  function InfowinForm() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, InfowinForm);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InfowinForm.__proto__ || Object.getPrototypeOf(InfowinForm)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      lastModified: null
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InfowinForm, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.resetMe();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.fetchViews();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      _reactDom2.default.findDOMNode(this).scrollIntoView();
    }
  }, {
    key: 'renderError',
    value: function renderError(newInfowin) {
      if (newInfowin && newInfowin.error && newInfowin.error.message) {
        return _react2.default.createElement(
          'div',
          { className: 'alert alert-danger' },
          newInfowin ? newInfowin.error.message : ''
        );
      } else {
        return _react2.default.createElement('span', null);
      }
    }
  }, {
    key: 'saveInfowin',
    value: function saveInfowin(values, dispatch) {
      var saver = validateAndCreateInfowin(values, dispatch, this.props.parentType, this.props.parentId),
          router = this.context.router;
      saver.then(function () {
        router.goBack();
      });
    }
  }, {
    key: 'populateViewSelections',
    value: function populateViewSelections() {
      var viewsList = this.props.viewsList;

      if (!viewsList.views || viewsList.views.length === 0) {
        return null;
      }

      var viewsListSelections = viewsList.views.map(function (viewIterator) {
        return {
          label: viewIterator.title,
          value: viewIterator._id
        };
      });

      return viewsListSelections;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var asyncValidating = _props.asyncValidating;
      var handleSubmit = _props.handleSubmit;
      var pristine = _props.pristine;
      var submitting = _props.submitting;
      var newInfowin = _props.newInfowin;

      var viewsListSelections = this.populateViewSelections();

      return _react2.default.createElement(
        'div',
        { className: 'container' },
        _react2.default.createElement(
          'h1',
          null,
          'New Info Window'
        ),
        this.renderError(newInfowin),
        _react2.default.createElement(
          'form',
          { onSubmit: handleSubmit(this.saveInfowin.bind(this)) },
          _react2.default.createElement(_reduxForm.Field, { name: 'title', component: _inputs.renderInput, type: 'text', placeholder: 'Title', label: 'Title' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'name', component: _inputs.renderInput, type: 'text', placeholder: 'Name', label: 'Name' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'type', component: _inputs.renderInput, type: 'text', placeholder: 'Type', label: 'Type' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'thumbnail_src', component: _inputs.renderInput, type: 'text', placeholder: 'Url of image', label: 'Thumbnail src (http://...)' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'description', component: _inputs.renderTextarea, placeholder: 'Description', label: 'Description', rows: '3' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'html', component: _inputs.renderTextarea, placeholder: '<p>...</p>', label: 'Html', rows: '6' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'view', component: _inputs.renderObjectSelect, label: 'View', dataArray: viewsListSelections }),
          _react2.default.createElement(
            'div',
            { className: 'form-group' },
            _react2.default.createElement(
              'button',
              { type: 'submit', className: 'btn btn-primary', disabled: submitting },
              _react2.default.createElement('span', { className: 'fa fa-save' }),
              ' Save'
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: '/infowins', className: 'btn btn-error' },
              'Cancel'
            )
          )
        )
      );
    }
  }]);

  return InfowinForm;
}(_react.Component);

InfowinForm.contextTypes = {
  router: _react.PropTypes.object
};


InfowinForm = (0, _reduxForm.reduxForm)({
  form: 'infowinsNewForm',
  enableReinitialize: true,
  validate: _infowinValidator.validateInfowin
})(InfowinForm);

InfowinForm = (0, _reactRedux.connect)(function (state, ownProps) {
  return {
    parentType: ownProps.parentType,
    parentId: ownProps.parentId,
    viewsList: state.views.viewsList,
    initialValues: state.infowins.newInfowin.infowin,
    newInfowin: state.infowins.newInfowin // pull initial values from infowins reducer
  };
}, function (dispatch) {
  return {
    fetchViews: function fetchViews() {
      dispatch((0, _views.fetchViews)('world', worldId)).then(function (response) {
        !response.error ? dispatch((0, _views.fetchViewsSuccess)(response.payload.data)) : dispatch((0, _views.fetchViewsFailure)(response.payload));
      });
    },
    resetMe: function resetMe() {
      dispatch((0, _infowins.resetNewInfowin)());
    }
  };
})(InfowinForm);

exports.default = InfowinForm;

},{"../actions/infowins":361,"../actions/views":365,"../validators/infowinValidator":424,"./inputs":385,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router","redux-form":"redux-form"}],373:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _views = require('../actions/views');

var _markers = require('../actions/markers');

var _markerValidator = require('../validators/markerValidator');

var _inputs = require('./inputs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//For any field errors upon submission (i.e. not instant check)
var validateAndUpdateMarker = function validateAndUpdateMarker(values, dispatch, parentId) {

  return new Promise(function (resolve, reject) {
    dispatch((0, _markers.updateMarker)(values, parentId)).then(function (response) {
      var data = response.payload.data;
      //if any one of these exist, then there is a field error
      if (response.payload.status != 200) {
        dispatch((0, _markers.updateMarkerFailure)(response.payload));
        reject(data);
      } else {
        dispatch((0, _markers.updateMarkerSuccess)(response.payload));
        resolve(values);
      }
    });
  });
};

/* CLASS */

var MarkerForm = function (_Component) {
  _inherits(MarkerForm, _Component);

  function MarkerForm() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MarkerForm);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MarkerForm.__proto__ || Object.getPrototypeOf(MarkerForm)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      lastModified: null
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MarkerForm, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.resetMe();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.fetchMarker(this.props.markerId);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.props.pristine && !this.props.submitting) {
        _reactDom2.default.findDOMNode(this).scrollIntoView();
      }
    }
  }, {
    key: 'renderError',
    value: function renderError(newMarker) {
      if (newMarker && newMarker.error && newMarker.error.message) {
        return _react2.default.createElement(
          'div',
          { className: 'alert alert-danger' },
          newMarker ? newMarker.error.message : ''
        );
      } else {
        return _react2.default.createElement('span', null);
      }
    }
  }, {
    key: 'saveMarker',
    value: function saveMarker(values, dispatch) {
      var saver = validateAndUpdateMarker(values, dispatch, this.props.parentId),
          router = this.context.router;
      saver.then(function () {
        router.goBack();
      });
    }
  }, {
    key: 'deletethisMarker',
    value: function deletethisMarker() {
      var _this2 = this;

      var me = this;
      if (window.confirm('Are you sure to delete this?')) {
        (function () {
          var deleter = _this2.props.deleteMarker(_this2.props.markerId),
              router = _this2.context.router;
          deleter.then(function () {
            router.goBack();
          });
        })();
      }
    }
  }, {
    key: 'gotoBack',
    value: function gotoBack() {
      this.context.router.goBack();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var asyncValidating = _props.asyncValidating;
      var handleSubmit = _props.handleSubmit;
      var pristine = _props.pristine;
      var submitting = _props.submitting;
      var newMarker = _props.newMarker;

      var noYesSelect = [{
        label: 'No',
        value: false
      }, {
        label: 'Yes',
        value: true
      }];
      var arrowDirection = [{ label: 'Bottom', value: 0 }, { label: 'Up', value: 1 }, { label: 'Left', value: 2 }, { label: 'Right', value: 3 }];

      return _react2.default.createElement(
        'div',
        { className: 'container' },
        _react2.default.createElement(
          'h1',
          null,
          'Edit Marker'
        ),
        this.renderError(newMarker),
        _react2.default.createElement(
          'form',
          { onSubmit: handleSubmit(this.saveMarker.bind(this)) },
          _react2.default.createElement(_reduxForm.Field, { name: 'title', component: _inputs.renderInput, isBig: 'true', type: 'text', placeholder: 'Title', label: 'Title' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'letter', component: _inputs.renderInput, type: 'text', placeholder: 'A or B or 1 or i or iii...', label: 'Letter on marker (only 1)' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'direction', component: _inputs.renderObjectSelect, withoutNone: 'true', dataArray: arrowDirection, label: 'Arrow direction' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'faIcon', component: _inputs.renderInput, placeholder: 'fa-info-circle or fa-check-circle or fa-times-circle ...', label: 'Font-Awesome Icon (http://fontawesome.io/icons/) on Feedback' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'feedbackHtml', component: _inputs.renderTextarea, placeholder: '<p>...</p>', label: 'Feedback Html', rows: '6' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'dismissText', component: _inputs.renderInput, placeholder: 'Close or Got it! or Next or Dismiss ...', label: 'Dismiss Button text' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'optionsOnShowFeedback', component: _inputs.renderInput, placeholder: '{}', label: 'optionsOnShowFeedback' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'optionsOnDismissFeedback', component: _inputs.renderInput, placeholder: '{}', label: 'optionsOnDismissFeedback' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'toNext', component: _inputs.renderObjectSelect, withoutNone: 'true', dataArray: noYesSelect, label: '→ To Next?' }),
          _react2.default.createElement(
            'div',
            { className: 'vector3group' },
            _react2.default.createElement(
              'h4',
              null,
              'Marker position'
            ),
            _react2.default.createElement(_reduxForm.Field, { name: 'position.x', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'x' }),
            _react2.default.createElement(_reduxForm.Field, { name: 'position.y', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'y' }),
            _react2.default.createElement(_reduxForm.Field, { name: 'position.z', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'z' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'form-group' },
            _react2.default.createElement(
              'button',
              { type: 'submit', className: 'btn btn-primary', disabled: submitting },
              _react2.default.createElement('span', { className: 'fa fa-save' }),
              ' Save'
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: '/infowins', className: 'btn btn-error' },
              'Cancel'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'form-group pull-right' },
            _react2.default.createElement(
              'button',
              { type: 'button', className: 'btn btn-danger',
                onClick: this.deletethisMarker.bind(this),
                disabled: submitting },
              'Delete this marker ',
              _react2.default.createElement('span', { className: 'fa fa-times' })
            )
          )
        )
      );
    }
  }]);

  return MarkerForm;
}(_react.Component);

MarkerForm.contextTypes = {
  router: _react.PropTypes.object
};


MarkerForm = (0, _reduxForm.reduxForm)({
  form: 'markersEditForm',
  enableReinitialize: true,
  validate: _markerValidator.validateMarker
})(MarkerForm);

MarkerForm = (0, _reactRedux.connect)(function (state, ownProps) {
  return {
    parentId: ownProps.parentId,
    markerId: ownProps.id,
    initialValues: state.markers.activeMarker.marker,
    activeMarker: state.markers.activeMarker // pull initial values from markers reducer
  };
}, function (dispatch, ownProps) {
  return {
    fetchMarker: function fetchMarker(id) {
      dispatch((0, _markers.fetchMarker)(id)).then(function (response) {
        !response.error ? dispatch((0, _markers.fetchMarkerSuccess)(response.payload.data)) : dispatch(fetchMarkerFailure(response.payload));
      });
    },
    deleteMarker: function deleteMarker(id) {
      return new Promise(function (resolve, reject) {
        dispatch((0, _markers.deleteMarker)(ownProps.parentId, id)).then(function (response) {
          var data = response.payload.data;
          if (!response.error) {
            dispatch((0, _markers.deleteMarkerSuccess)(response.payload.data));
            resolve();
          } else {
            dispatch((0, _markers.deleteMarkerFailure)(response.payload));
            reject(data);
          }
        });
      });
    },
    resetMe: function resetMe() {
      dispatch((0, _markers.resetActiveMarker)());
    }
  };
})(MarkerForm);

exports.default = MarkerForm;

},{"../actions/markers":362,"../actions/views":365,"../validators/markerValidator":425,"./inputs":385,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router","redux-form":"redux-form"}],374:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _views = require('../actions/views');

var _markers = require('../actions/markers');

var _markerValidator = require('../validators/markerValidator');

var _inputs = require('./inputs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//For any field errors upon submission (i.e. not instant check)
var validateAndCreateMarker = function validateAndCreateMarker(values, dispatch, parentId) {

  return new Promise(function (resolve, reject) {
    dispatch((0, _markers.createMarker)(values, parentId)).then(function (response) {
      var data = response.payload.data;
      //if any one of these exist, then there is a field error
      if (response.payload.status != 200) {
        dispatch((0, _markers.createMarkerFailure)(response.payload));
        reject(data);
      } else {
        dispatch((0, _markers.createMarkerSuccess)(response.payload));
        resolve(values);
      }
    });
  });
};

/* CLASS */

var MarkerForm = function (_Component) {
  _inherits(MarkerForm, _Component);

  function MarkerForm() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MarkerForm);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MarkerForm.__proto__ || Object.getPrototypeOf(MarkerForm)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      lastModified: null
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MarkerForm, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      //this.props.resetMe();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      _reactDom2.default.findDOMNode(this).scrollIntoView();
    }
  }, {
    key: 'renderError',
    value: function renderError(newMarker) {
      if (newMarker && newMarker.error && newMarker.error.message) {
        return _react2.default.createElement(
          'div',
          { className: 'alert alert-danger' },
          newMarker ? newMarker.error.message : ''
        );
      } else {
        return _react2.default.createElement('span', null);
      }
    }
  }, {
    key: 'saveMarker',
    value: function saveMarker(values, dispatch) {
      var saver = validateAndCreateMarker(values, dispatch, this.props.parentId),
          router = this.context.router;
      saver.then(function () {
        router.goBack();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var asyncValidating = _props.asyncValidating;
      var handleSubmit = _props.handleSubmit;
      var pristine = _props.pristine;
      var submitting = _props.submitting;
      var newMarker = _props.newMarker;

      var noYesSelect = [{
        label: 'No',
        value: false
      }, {
        label: 'Yes',
        value: true
      }];
      var arrowDirection = [{ label: 'Bottom', value: 0 }, { label: 'Up', value: 1 }, { label: 'Left', value: 2 }, { label: 'Right', value: 3 }];

      return _react2.default.createElement(
        'div',
        { className: 'container' },
        _react2.default.createElement(
          'h1',
          null,
          'New Marker'
        ),
        this.renderError(newMarker),
        _react2.default.createElement(
          'form',
          { onSubmit: handleSubmit(this.saveMarker.bind(this)) },
          _react2.default.createElement(_reduxForm.Field, { name: 'title', component: _inputs.renderInput, isBig: 'true', type: 'text', placeholder: 'Title', label: 'Title' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'letter', component: _inputs.renderInput, type: 'text', placeholder: 'A or B or 1 or i or iii...', label: 'Letter on marker (only 1)' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'direction', component: _inputs.renderObjectSelect, withoutNone: 'true', dataArray: arrowDirection, label: 'Arrow direction' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'faIcon', component: _inputs.renderInput, placeholder: 'fa-info-circle or fa-check-circle or fa-times-circle ...', label: 'Font-Awesome Icon (http://fontawesome.io/icons/) on Feedback' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'feedbackHtml', component: _inputs.renderTextarea, placeholder: '<p>...</p>', label: 'Feedback Html', rows: '6' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'dismissText', component: _inputs.renderInput, placeholder: 'Close or Got it! or Next or Dismiss ...', label: 'Dismiss Button text' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'optionsOnShowFeedback', component: _inputs.renderInput, placeholder: '{}', label: 'optionsOnShowFeedback' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'optionsOnDismissFeedback', component: _inputs.renderInput, placeholder: '{}', label: 'optionsOnDismissFeedback' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'toNext', component: _inputs.renderObjectSelect, withoutNone: 'true', dataArray: noYesSelect, label: '→ To Next?' }),
          _react2.default.createElement(
            'div',
            { className: 'vector3group' },
            _react2.default.createElement(
              'h4',
              null,
              'Marker position'
            ),
            _react2.default.createElement(_reduxForm.Field, { name: 'position.x', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'x' }),
            _react2.default.createElement(_reduxForm.Field, { name: 'position.y', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'y' }),
            _react2.default.createElement(_reduxForm.Field, { name: 'position.z', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'z' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'form-group' },
            _react2.default.createElement(
              'button',
              { type: 'submit', className: 'btn btn-primary', disabled: submitting },
              _react2.default.createElement('span', { className: 'fa fa-save' }),
              ' Save'
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: '/infowins', className: 'btn btn-error' },
              'Cancel'
            )
          )
        )
      );
    }
  }]);

  return MarkerForm;
}(_react.Component);

MarkerForm.contextTypes = {
  router: _react.PropTypes.object
};


MarkerForm = (0, _reduxForm.reduxForm)({
  form: 'markersNewForm',
  enableReinitialize: true,
  validate: _markerValidator.validateMarker
})(MarkerForm);

MarkerForm = (0, _reactRedux.connect)(function (state, ownProps) {
  return {
    parentId: ownProps.parentId,
    viewsList: state.views.viewsList,
    initialValues: state.markers.newMarker.marker,
    newMarker: state.markers.newMarker // pull initial values from markers reducer
  };
}, function (dispatch) {
  return {
    fetchViews: function fetchViews() {
      dispatch((0, _views.fetchViews)()).then(function (response) {
        !response.error ? dispatch((0, _views.fetchViewsSuccess)(response.payload.data)) : dispatch((0, _views.fetchViewsFailure)(response.payload));
      });
    },
    resetMe: function resetMe() {
      dispatch((0, _markers.resetNewMarker)());
    }
  };
})(MarkerForm);

exports.default = MarkerForm;

},{"../actions/markers":362,"../actions/views":365,"../validators/markerValidator":425,"./inputs":385,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router","redux-form":"redux-form"}],375:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _questions = require('../actions/questions');

var _questionValidator = require('../validators/questionValidator');

var _inputs = require('./inputs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//For any field errors upon submission (i.e. not instant check)
var validateAndUpdateQuestion = function validateAndUpdateQuestion(values, dispatch) {

  return new Promise(function (resolve, reject) {
    dispatch((0, _questions.updateQuestion)(values)).then(function (response) {
      var data = response.payload.data;
      //if any one of these exist, then there is a field error
      if (response.payload.status != 200) {
        dispatch((0, _questions.updateQuestionFailure)(response.payload));
        reject(data);
      } else {
        dispatch((0, _questions.updateQuestionSuccess)(response.payload));
        resolve(values);
      }
    });
  });
};

/* CLASS */

var QuestionForm = function (_Component) {
  _inherits(QuestionForm, _Component);

  function QuestionForm(props) {
    _classCallCheck(this, QuestionForm);

    var _this = _possibleConstructorReturn(this, (QuestionForm.__proto__ || Object.getPrototypeOf(QuestionForm)).call(this, props));

    _this.state = {
      lastModified: null
    };

    _this.state = {
      value: '',
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      lastModified: null,
      questionTypes: [{ label: "Multi Choice", value: "multi" }, { label: "Single Choice", value: "single" }]
    };

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleChange1 = _this.handleChange1.bind(_this);
    _this.handleChange2 = _this.handleChange2.bind(_this);
    _this.handleChange3 = _this.handleChange3.bind(_this);
    _this.handleChange4 = _this.handleChange4.bind(_this);
    _this.handleChange5 = _this.handleChange5.bind(_this);

    return _this;
  }

  _createClass(QuestionForm, [{
    key: 'setInitialValues',
    value: function setInitialValues(activeQuestion) {

      if (activeQuestion.question) {
        this.state.value1 = activeQuestion.question.fraction1;
        this.state.value2 = activeQuestion.question.fraction2;
        this.state.value3 = activeQuestion.question.fraction3;
        this.state.value4 = activeQuestion.question.fraction4;
        this.state.value5 = activeQuestion.question.fraction5;
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.questionId !== this.props.questionId) {
        this.props.fetchQuestion(nextProps.questionId);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.fetchQuestion(this.props.questionId);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      _reactDom2.default.findDOMNode(this).scrollIntoView();
    }
  }, {
    key: 'renderError',
    value: function renderError(activeQuestion) {
      if (activeQuestion && activeQuestion.error && activeQuestion.error.message) {
        return _react2.default.createElement(
          'div',
          { className: 'alert alert-danger' },
          activeQuestion ? activeQuestion.error.message : ''
        );
      } else {
        return _react2.default.createElement('span', null);
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      event.preventDefault();
      this.setState({ value: event.target.value });
    }
  }, {
    key: 'handleChange1',
    value: function handleChange1(event) {
      event.preventDefault();
      this.setState({ value1: event.target.value });
    }
  }, {
    key: 'handleChange2',
    value: function handleChange2(event) {
      event.preventDefault();
      this.setState({ value2: event.target.value });
    }
  }, {
    key: 'handleChange3',
    value: function handleChange3(event) {
      event.preventDefault();
      this.setState({ value3: event.target.value });
    }
  }, {
    key: 'handleChange4',
    value: function handleChange4(event) {
      event.preventDefault();
      this.setState({ value4: event.target.value });
    }
  }, {
    key: 'handleChange5',
    value: function handleChange5(event) {
      event.preventDefault();
      this.setState({ value5: event.target.value });
    }
  }, {
    key: 'saveQuestion',
    value: function saveQuestion(values, dispatch) {
      var saver = validateAndUpdateInfowin(values, dispatch),
          router = this.context.router;
      saver.then(function () {
        router.goBack();
      });
    }
  }, {
    key: 'deletethisQuestion',
    value: function deletethisQuestion() {
      var _this2 = this;

      if (window.confirm('Are you sure to delete this?')) {
        (function () {
          var deleter = _this2.props.deleteQuestion(_this2.props.parentType, _this2.props.parentId, _this2.props.questionId),
              router = _this2.context.router;
          deleter.then(function () {
            router.push("/infowins");
          });
        })();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var asyncValidating = _props.asyncValidating;
      var handleSubmit = _props.handleSubmit;
      var submitting = _props.submitting;
      var activeQuestion = _props.activeQuestion;

      var questionTypes = this.state.questionTypes;
      var grades = [{ label: "None", value: "0.0" }, { label: "100%", value: "1" }, { label: "50%", value: "0.5" }, { label: "25%", value: "0.25" }, { label: "5%", value: "0.05" }, { label: "-5%", value: "-0.05" }, { label: "-25%", value: "-0.25" }, { label: "-50%", value: "-0.5" }, { label: "-100%", value: "-0.1" }];

      return _react2.default.createElement(
        'div',
        { className: 'container' },
        _react2.default.createElement(
          'div',
          { className: 'view-title' },
          _react2.default.createElement(
            'h1',
            null,
            'Edit Question Info Windows'
          )
        ),
        activeQuestion.question ? _react2.default.createElement(
          'h2',
          null,
          activeQuestion.question.title
        ) : null,
        this.setInitialValues(activeQuestion),
        this.renderError(activeQuestion),
        _react2.default.createElement(
          'form',
          { onSubmit: handleSubmit(this.saveQuestion.bind(this)) },
          _react2.default.createElement(_reduxForm.Field, { name: 'title', component: _inputs.renderInput, type: 'text', placeholder: 'Title', label: 'Title' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'description', component: _inputs.renderTextarea, placeholder: 'Description', label: 'Description', rows: '3' }),
          _react2.default.createElement(_reduxForm.Field, { name: 'qtype', component: _inputs.renderQSelect, label: 'Question Type', dataArray: questionTypes, selectedValue: this.state.value, onChange: this.handleChange }),
          _react2.default.createElement(
            'div',
            { className: 'answers' },
            _react2.default.createElement(
              'div',
              { className: 'answer' },
              _react2.default.createElement(_reduxForm.Field, { name: 'answer1', component: _inputs.renderTextarea, placeholder: '', label: 'Choice 1', rows: '2' }),
              _react2.default.createElement(_reduxForm.Field, { name: 'fraction1', component: _inputs.renderQSelect, label: 'Grade', dataArray: grades, selectedValue: this.state.value1, onChange: this.handleChange1 }),
              _react2.default.createElement(_reduxForm.Field, { name: 'feedback1', component: _inputs.renderTextarea, placeholder: '', label: 'Feedback', rows: '2' })
            ),
            _react2.default.createElement(
              'div',
              { className: 'answer' },
              _react2.default.createElement(_reduxForm.Field, { name: 'answer2', component: _inputs.renderTextarea, placeholder: '', label: 'Choice 2', rows: '2' }),
              _react2.default.createElement(_reduxForm.Field, { name: 'fraction2', component: _inputs.renderQSelect, label: 'Grade', dataArray: grades, selectedValue: this.state.value2, onChange: this.handleChange2 }),
              _react2.default.createElement(_reduxForm.Field, { name: 'feedback2', component: _inputs.renderTextarea, placeholder: '', label: 'Feedback', rows: '2' })
            ),
            _react2.default.createElement(
              'div',
              { className: 'answer' },
              _react2.default.createElement(_reduxForm.Field, { name: 'answer3', component: _inputs.renderTextarea, placeholder: '', label: 'Choice 3', rows: '2' }),
              _react2.default.createElement(_reduxForm.Field, { name: 'fraction3', component: _inputs.renderQSelect, label: 'Grade', dataArray: grades, selectedValue: this.state.value3, onChange: this.handleChange3 }),
              _react2.default.createElement(_reduxForm.Field, { name: 'feedback3', component: _inputs.renderTextarea, placeholder: '', label: 'Feedback', rows: '2' })
            ),
            _react2.default.createElement(
              'div',
              { className: 'answer' },
              _react2.default.createElement(_reduxForm.Field, { name: 'answer4', component: _inputs.renderTextarea, placeholder: '', label: 'Choice 4', rows: '2' }),
              _react2.default.createElement(_reduxForm.Field, { name: 'fraction4', component: _inputs.renderQSelect, label: 'Grade', dataArray: grades, selectedValue: this.state.value4, onChange: this.handleChange4 }),
              _react2.default.createElement(_reduxForm.Field, { name: 'feedback4', component: _inputs.renderTextarea, placeholder: '', label: 'Feedback', rows: '2' })
            ),
            _react2.default.createElement(
              'div',
              { className: 'answer' },
              _react2.default.createElement(_reduxForm.Field, { name: 'answer5', component: _inputs.renderTextarea, placeholder: '', label: 'Choice 5', rows: '2' }),
              _react2.default.createElement(_reduxForm.Field, { name: 'fraction5', component: _inputs.renderQSelect, label: 'Grade', dataArray: grades, selectedValue: this.state.value5, onChange: this.handleChange5 }),
              _react2.default.createElement(_reduxForm.Field, { name: 'feedback5', component: _inputs.renderTextarea, placeholder: '', label: 'Feedback', rows: '2' })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'form-group' },
            _react2.default.createElement(
              'button',
              { type: 'submit', className: 'btn btn-primary', disabled: submitting },
              _react2.default.createElement('span', { className: 'fa fa-save' }),
              ' Save'
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: '/infowins', className: 'btn btn-error' },
              'Cancel'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'form-group pull-right' },
            _react2.default.createElement(
              'button',
              { type: 'button', className: 'btn btn-danger',
                onClick: this.deletethisQuestion.bind(this),
                disabled: submitting },
              'Delete this question ',
              _react2.default.createElement('span', { className: 'fa fa-times' })
            )
          )
        )
      );
    }
  }]);

  return QuestionForm;
}(_react.Component);

QuestionForm.contextTypes = {
  router: _react.PropTypes.object
};


QuestionForm = (0, _reduxForm.reduxForm)({
  form: 'questionsNewForm',
  enableReinitialize: true,
  validate: _questionValidator.validateQuestion
})(QuestionForm);

QuestionForm = (0, _reactRedux.connect)(function (state, ownProps) {
  return {
    parentType: ownProps.parentType,
    parentId: ownProps.parentId,
    questionId: ownProps.id,
    initialValues: state.questions.activeQuestion.question,
    activeQuestion: state.questions.activeQuestion // pull initial values from questions reducer
  };
}, function (dispatch) {
  return {
    fetchQuestion: function fetchQuestion(id) {
      console.log(id);
      dispatch((0, _questions.fetchQuestion)(id)).then(function (response) {
        console.log("response:", response);
        !response.error ? dispatch((0, _questions.fetchQuestionSuccess)(response.payload.data)) : dispatch((0, _questions.fetchQuestionFailure)(response.payload));
      });
    },
    deleteQuestion: function deleteQuestion(parentType, parentId, id) {
      return new Promise(function (resolve, reject) {
        dispatch((0, _questions.deleteQuestion)(parentType, parentId, id)).then(function (response) {
          var data = response.payload.data;
          if (!response.error) {
            dispatch((0, _questions.deleteQuestionSuccess)(response.payload.data));
            resolve();
          } else {
            dispatch((0, _questions.deleteQuestionFailure)(response.payload));
            reject(data);
          }
        });
      });
    },
    resetMe: function resetMe() {
      dispatch((0, _questions.resetActiveQuestion)());
    }
  };
})(QuestionForm);

exports.default = QuestionForm;

},{"../actions/questions":363,"../validators/questionValidator":426,"./inputs":385,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router","redux-form":"redux-form"}],376:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _questions = require('../actions/questions');

var _questionValidator = require('../validators/questionValidator');

var _inputs = require('./inputs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//For any field errors upon submission (i.e. not instant check)
var validateAndCreateQuestion = function validateAndCreateQuestion(values, dispatch, parentType, parentId) {
    return new Promise(function (resolve, reject) {
        dispatch((0, _questions.createQuestion)(values, parentType, parentId)).then(function (response) {
            var data = response.payload.data;
            //if any one of these exist, then there is a field error 
            if (response.payload.status != 200) {
                dispatch((0, _questions.createQuestionFailure)(response.payload));
                reject(data);
            } else {
                dispatch((0, _questions.createQuestionSuccess)(response.payload));
                resolve(values);
            }
        });
    });
};

/* CLASS */

var QuestionForm = function (_Component) {
    _inherits(QuestionForm, _Component);

    function QuestionForm(props) {
        _classCallCheck(this, QuestionForm);

        var _this = _possibleConstructorReturn(this, (QuestionForm.__proto__ || Object.getPrototypeOf(QuestionForm)).call(this, props));

        _this.state = {
            value: 'Multi Choice',
            value1: '',
            value2: '',
            value3: '',
            value4: '',
            value5: '',
            lastModified: null,
            questionTypes: [{ label: "Multi Choice", value: "multi" }, { label: "Single Choice", value: "single" }]
        };

        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleChange1 = _this.handleChange1.bind(_this);
        _this.handleChange2 = _this.handleChange2.bind(_this);
        _this.handleChange3 = _this.handleChange3.bind(_this);
        _this.handleChange4 = _this.handleChange4.bind(_this);
        _this.handleChange5 = _this.handleChange5.bind(_this);
        return _this;
    }

    _createClass(QuestionForm, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.resetMe();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            _reactDom2.default.findDOMNode(this).scrollIntoView();
        }
    }, {
        key: 'renderError',
        value: function renderError(newQuestion) {
            if (newQuestion && newQuestion.error && newQuestion.error.message) {
                return _react2.default.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    newQuestion ? newQuestion.error.message : ''
                );
            } else {
                return _react2.default.createElement('span', null);
            }
        }
    }, {
        key: 'handleChange',
        value: function handleChange(event) {
            event.preventDefault();
            this.setState({ value: event.target.value });
        }
    }, {
        key: 'handleChange1',
        value: function handleChange1(event) {
            event.preventDefault();
            this.setState({ value1: event.target.value });
        }
    }, {
        key: 'handleChange2',
        value: function handleChange2(event) {
            event.preventDefault();
            this.setState({ value2: event.target.value });
        }
    }, {
        key: 'handleChange3',
        value: function handleChange3(event) {
            event.preventDefault();
            this.setState({ value3: event.target.value });
        }
    }, {
        key: 'handleChange4',
        value: function handleChange4(event) {
            event.preventDefault();
            this.setState({ value4: event.target.value });
        }
    }, {
        key: 'handleChange5',
        value: function handleChange5(event) {
            event.preventDefault();
            this.setState({ value5: event.target.value });
        }
    }, {
        key: 'saveQuestion',
        value: function saveQuestion(values, dispatch) {
            var saver = validateAndCreateQuestion(values, dispatch, this.props.parentType, this.props.parentId),
                router = this.context.router;
            saver.then(function () {
                router.goBack();
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props;
            var asyncValidating = _props.asyncValidating;
            var handleSubmit = _props.handleSubmit;
            var pristine = _props.pristine;
            var submitting = _props.submitting;
            var newQuestion = _props.newQuestion;

            var questionTypes = this.state.questionTypes;
            var showReplyForm = function showReplyForm() {
                _this2.setState({ showForm: true });
            };
            var grades = [{ label: "None", value: "0.0" }, { label: "100%", value: "1" }, { label: "50%", value: "0.5" }, { label: "25%", value: "0.25" }, { label: "5%", value: "0.05" }, { label: "-5%", value: "-0.05" }, { label: "-25%", value: "-0.25" }, { label: "-50%", value: "-0.5" }, { label: "-100%", value: "-0.1" }];
            return _react2.default.createElement(
                'div',
                { className: 'container' },
                _react2.default.createElement(
                    'h1',
                    null,
                    'New Info Window for Question'
                ),
                this.renderError(newQuestion),
                _react2.default.createElement(
                    'form',
                    { onSubmit: handleSubmit(this.saveQuestion.bind(this)), id: 'page-changer' },
                    _react2.default.createElement(_reduxForm.Field, { name: 'title', component: _inputs.renderInput, type: 'text', placeholder: 'Title', label: 'Title' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'description', component: _inputs.renderTextarea, placeholder: 'Description', label: 'Description', rows: '3' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'qtype', component: _inputs.renderQSelect, label: 'Question Type', dataArray: questionTypes, value: this.state.value, onChange: this.handleChange }),
                    _react2.default.createElement(
                        'div',
                        { className: 'answers' },
                        _react2.default.createElement(
                            'div',
                            { className: 'answer' },
                            _react2.default.createElement(_reduxForm.Field, { name: 'answer1', component: _inputs.renderTextarea, placeholder: '', label: 'Choice 1', rows: '2' }),
                            _react2.default.createElement(_reduxForm.Field, { name: 'fraction1', component: _inputs.renderQSelect, label: 'Grade', dataArray: grades, value: this.state.value1, onChange: this.handleChange1 }),
                            _react2.default.createElement(_reduxForm.Field, { name: 'feedback1', component: _inputs.renderTextarea, placeholder: '', label: 'Feedback', rows: '2' })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'answer' },
                            _react2.default.createElement(_reduxForm.Field, { name: 'answer2', component: _inputs.renderTextarea, placeholder: '', label: 'Choice 2', rows: '2' }),
                            _react2.default.createElement(_reduxForm.Field, { name: 'fraction2', component: _inputs.renderQSelect, label: 'Grade', dataArray: grades, value: this.state.value2, onChange: this.handleChange2 }),
                            _react2.default.createElement(_reduxForm.Field, { name: 'feedback2', component: _inputs.renderTextarea, placeholder: '', label: 'Feedback', rows: '2' })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'answer' },
                            _react2.default.createElement(_reduxForm.Field, { name: 'answer3', component: _inputs.renderTextarea, placeholder: '', label: 'Choice 3', rows: '2' }),
                            _react2.default.createElement(_reduxForm.Field, { name: 'fraction3', component: _inputs.renderQSelect, label: 'Grade', dataArray: grades, value: this.state.value3, onChange: this.handleChange3 }),
                            _react2.default.createElement(_reduxForm.Field, { name: 'feedback3', component: _inputs.renderTextarea, placeholder: '', label: 'Feedback', rows: '2' })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'answer' },
                            _react2.default.createElement(_reduxForm.Field, { name: 'answer4', component: _inputs.renderTextarea, placeholder: '', label: 'Choice 4', rows: '2' }),
                            _react2.default.createElement(_reduxForm.Field, { name: 'fraction4', component: _inputs.renderQSelect, label: 'Grade', dataArray: grades, value: this.state.value4, onChange: this.handleChange4 }),
                            _react2.default.createElement(_reduxForm.Field, { name: 'feedback4', component: _inputs.renderTextarea, placeholder: '', label: 'Feedback', rows: '2' })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'answer' },
                            _react2.default.createElement(_reduxForm.Field, { name: 'answer5', component: _inputs.renderTextarea, placeholder: '', label: 'Choice 5', rows: '2' }),
                            _react2.default.createElement(_reduxForm.Field, { name: 'fraction5', component: _inputs.renderQSelect, label: 'Grade', dataArray: grades, value: this.state.value5, onChange: this.handleChange5 }),
                            _react2.default.createElement(_reduxForm.Field, { name: 'feedback5', component: _inputs.renderTextarea, placeholder: '', label: 'Feedback', rows: '2' })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group' },
                        _react2.default.createElement(
                            'button',
                            { type: 'submit', className: 'btn btn-primary', disabled: submitting },
                            _react2.default.createElement('span', { className: 'fa fa-save' }),
                            ' Save'
                        ),
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/questions', className: 'btn btn-error' },
                            'Cancel'
                        )
                    )
                )
            );
        }
    }]);

    return QuestionForm;
}(_react.Component);

QuestionForm.contextTypes = {
    router: _react.PropTypes.object
};


QuestionForm = (0, _reduxForm.reduxForm)({
    form: 'questionsNewForm',
    enableReinitialize: true,
    validate: _questionValidator.validateQuestion
})(QuestionForm);

QuestionForm = (0, _reactRedux.connect)(function (state, ownProps) {
    return {
        parentType: ownProps.parentType,
        parentId: ownProps.parentId,
        initialValues: state.questions.newQuestion.question,
        newQuestion: state.questions.newQuestion // pull initial values from questions reducer
    };
}, function (dispatch) {
    return {
        resetMe: function resetMe() {
            dispatch((0, _questions.resetNewQuestion)());
        }
    };
})(QuestionForm);

exports.default = QuestionForm;

},{"../actions/questions":363,"../validators/questionValidator":426,"./inputs":385,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router","redux-form":"redux-form"}],377:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _views = require('../actions/views');

var _viewValidator = require('../validators/viewValidator');

var _inputs = require('./inputs');

var _config = require('../config.const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var worldId = window.config.mainScene.worldId;

//For any field errors upon submission (i.e. not instant check)
var validateAndUpdateView = function validateAndUpdateView(values, dispatch) {

    return new Promise(function (resolve, reject) {
        dispatch((0, _views.updateView)(_extends({}, values, { world: worldId }))).then(function (response) {
            var data = response.payload.data;
            //if any one of these exist, then there is a field error
            if (response.payload.status != 200) {
                dispatch((0, _views.updateViewFailure)(response.payload));
                reject(data);
            } else {
                dispatch((0, _views.updateViewSuccess)(response.payload));
                resolve(values);
            }
        });
    });
};

/* CLASS */

var ViewsForm = function (_Component) {
    _inherits(ViewsForm, _Component);

    function ViewsForm() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ViewsForm);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ViewsForm.__proto__ || Object.getPrototypeOf(ViewsForm)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            lastModified: null,
            gearListMapped: []
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ViewsForm, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var gearListMapped = (0, _viewValidator.populateObjectsLeft)(window.config.gearMap);
            var gearListMappedRight = (0, _viewValidator.populateObjectsRight)(window.config.gearMap);
            this.setState({ gearListMapped: gearListMapped, gearListMappedRight: gearListMappedRight });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.fetchView(this.props.viewId);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.pristine && !this.props.submitting) {
                _reactDom2.default.findDOMNode(this).scrollIntoView();
            }
        }
    }, {
        key: 'updateWithCurrCamCoords',
        value: function updateWithCurrCamCoords() {
            this.props.updateWithCurrCamCoords(this.props.activeView.view);
            this.props.change("cameraPosition.x", this.props.activeView.view.cameraPosition.x);
            this.props.change("cameraPosition.y", this.props.activeView.view.cameraPosition.y);
            this.props.change("cameraPosition.z", this.props.activeView.view.cameraPosition.z);
            this.props.change("targetPosition.x", this.props.activeView.view.targetPosition.x);
            this.props.change("targetPosition.y", this.props.activeView.view.targetPosition.y);
            this.props.change("targetPosition.z", this.props.activeView.view.targetPosition.z);
        }
    }, {
        key: 'renderError',
        value: function renderError(activeView) {
            if (activeView && activeView.error && activeView.error.message) {
                return _react2.default.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    activeView ? activeView.error.message : ''
                );
            } else {
                return _react2.default.createElement('span', null);
            }
        }
    }, {
        key: 'saveView',
        value: function saveView(values, dispatch) {
            var me = this,
                camPos = values.cameraPosition,
                tarPos = values.targetPosition;

            window.app3dViewer.viewPosition([camPos.x, camPos.y, camPos.z], [tarPos.x, tarPos.y, tarPos.z]);

            window.app3dViewer.generateScreenshot(240, 180, "image/png", false, "", false).then(function (screenshot) {
                values.screenshot = screenshot;
                var saver = validateAndUpdateView(values, dispatch),
                    router = me.context.router;
                saver.then(function () {
                    router.push("/vSviews/" + me.props.vsid);
                });
            });
        }
    }, {
        key: 'deletethisView',
        value: function deletethisView() {
            var _this2 = this;

            var me = this;
            if (window.confirm('Are you sure to delete this?')) {
                (function () {
                    var deleter = _this2.props.deleteView(_this2.props.viewId),
                        router = _this2.context.router;
                    deleter.then(function () {
                        router.push("/vSviews/" + me.props.vsid);
                    });
                })();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props = this.props;
            var asyncValidating = _props.asyncValidating;
            var handleSubmit = _props.handleSubmit;
            var submitting = _props.submitting;
            var activeView = _props.activeView;

            var gearMappedObjects = this.state.gearListMapped;
            var gearMappedObjectsRight = this.state.gearListMappedRight;

            return _react2.default.createElement(
                'div',
                { className: 'container' },
                _react2.default.createElement(
                    'h1',
                    null,
                    'Edit View'
                ),
                activeView.view ? _react2.default.createElement(
                    'h2',
                    null,
                    activeView.view.title
                ) : null,
                this.renderError(activeView),
                _react2.default.createElement(
                    'form',
                    { onSubmit: handleSubmit(this.saveView.bind(this)) },
                    _react2.default.createElement(_reduxForm.Field, { name: 'title', component: _inputs.renderInput, type: 'text', placeholder: 'Title', label: 'Title' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'name', component: _inputs.renderInput, type: 'text', placeholder: 'Name', label: 'Name' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'keyCode', component: _inputs.renderInput, type: 'text', placeholder: 'Numeric key code', label: 'Key Code' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'highlighted', component: _inputs.renderSelect, label: 'Highlighted mapped object', dataArray: gearMappedObjectsRight }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'selected', component: _inputs.renderSelect, label: 'Selected gear', dataArray: gearMappedObjects }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'description', component: _inputs.renderTextarea, placeholder: 'Description', label: 'Description', rows: '3' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'html', component: _inputs.renderTextarea, placeholder: '<p>...</p>', label: 'Html', rows: '6' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group' },
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: function onClick() {
                                    return _this3.updateWithCurrCamCoords();
                                },
                                disabled: submitting,
                                className: 'btn btn-info' },
                            'Update fields w/ current camera/target'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'vector3group' },
                        _react2.default.createElement(
                            'h4',
                            null,
                            'Camera position'
                        ),
                        _react2.default.createElement(_reduxForm.Field, { name: 'cameraPosition.x', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'x' }),
                        _react2.default.createElement(_reduxForm.Field, { name: 'cameraPosition.y', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'y' }),
                        _react2.default.createElement(_reduxForm.Field, { name: 'cameraPosition.z', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'z' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'vector3group' },
                        _react2.default.createElement(
                            'h4',
                            null,
                            'Target position'
                        ),
                        _react2.default.createElement(_reduxForm.Field, { name: 'targetPosition.x', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'x' }),
                        _react2.default.createElement(_reduxForm.Field, { name: 'targetPosition.y', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'y' }),
                        _react2.default.createElement(_reduxForm.Field, { name: 'targetPosition.z', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'z' })
                    ),
                    activeView.view && activeView.view.screenshot ? _react2.default.createElement(
                        'div',
                        { className: 'form-group' },
                        _react2.default.createElement(
                            'label',
                            null,
                            'Current screenshot'
                        ),
                        _react2.default.createElement('br', null),
                        _react2.default.createElement('img', { src: activeView.view.screenshot.indexOf("data:image") === 0 ? activeView.view.screenshot : '' + _config.ROOT_IMG_URL + activeView.view.screenshot,
                            alt: activeView.view.title })
                    ) : null,
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group' },
                        _react2.default.createElement(
                            'button',
                            { type: 'submit', className: 'btn btn-primary', disabled: submitting },
                            _react2.default.createElement('span', { className: 'fa fa-save' }),
                            ' Save'
                        ),
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: "/vSviews/" + this.props.vsid, className: 'btn btn-error' },
                            'Cancel'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group pull-right' },
                        _react2.default.createElement(
                            'button',
                            { type: 'button', className: 'btn btn-danger',
                                onClick: this.deletethisView.bind(this),
                                disabled: submitting },
                            'Delete this view ',
                            _react2.default.createElement('span', { className: 'fa fa-times' })
                        )
                    )
                )
            );
        }
    }]);

    return ViewsForm;
}(_react.Component);

ViewsForm.contextTypes = {
    router: _react.PropTypes.object
};


ViewsForm = (0, _reduxForm.reduxForm)({
    form: 'viewsNewForm',
    enableReinitialize: true,
    validate: _viewValidator.validateView
})(ViewsForm);

ViewsForm = (0, _reactRedux.connect)(function (state, ownProps) {
    return {
        viewId: ownProps.id,
        vsid: ownProps.vsid,
        initialValues: state.views.activeView.view,
        activeView: state.views.activeView, // pull initial values from views reducer
        threeDObjects: state.threeDObjects.threeDObjectsList
    };
}, function (dispatch, ownProps) {
    return {
        updateWithCurrCamCoords: function updateWithCurrCamCoords(values) {
            dispatch((0, _views.updateViewCam)(_extends({}, values, { world: worldId }))).then(function (response) {
                !response.error ? dispatch((0, _views.updateViewCamSuccess)(response.payload.data)) : dispatch((0, _views.updateViewCamFailure)(response.payload));
            });
        },
        fetchView: function fetchView(id) {
            dispatch((0, _views.fetchView)(id)).then(function (response) {
                !response.error ? dispatch((0, _views.fetchViewSuccess)(response.payload.data)) : dispatch(fetchViewFailure(response.payload));
            });
        },
        deleteView: function deleteView(id) {
            return new Promise(function (resolve, reject) {
                dispatch((0, _views.deleteView)(id, ownProps.vsid)).then(function (response) {
                    var data = response.payload.data;
                    if (!response.error) {
                        dispatch((0, _views.deleteViewSuccess)(response.payload.data));
                        resolve();
                    } else {
                        dispatch((0, _views.deleteViewFailure)(response.payload));
                        reject(data);
                    }
                });
            });
        },
        resetMe: function resetMe() {
            dispatch((0, _views.resetActiveView)());
        }
    };
})(ViewsForm);

exports.default = ViewsForm;

},{"../actions/views":365,"../config.const":386,"../validators/viewValidator":427,"./inputs":385,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router","redux-form":"redux-form"}],378:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _config = require('../config.const');

var _reactSortableHoc = require('react-sortable-hoc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DragHandle = (0, _reactSortableHoc.SortableHandle)(function () {
    return _react2.default.createElement('span', { className: 'handle fa fa-ellipsis-v' });
});
var SortableItem = (0, _reactSortableHoc.SortableElement)(function (_ref) {
    var value = _ref.value;
    var vsid = _ref.vsid;

    return _react2.default.createElement(
        'li',
        { className: 'list-group-item' },
        _react2.default.createElement(
            _reactRouter.Link,
            { to: "/vSviews/" + vsid + "/" + value._id },
            _react2.default.createElement('img', { className: 'list-group-item-img', src: '' + _config.ROOT_IMG_URL + value.screenshot, alt: value.title }),
            _react2.default.createElement(
                'h3',
                { className: 'list-group-item-heading' },
                value.title,
                value.keyCode ? _react2.default.createElement(
                    'small',
                    null,
                    String.fromCharCode(value.keyCode)
                ) : null
            )
        ),
        _react2.default.createElement(DragHandle, null)
    );
});

var SortableList = (0, _reactSortableHoc.SortableContainer)(function (_ref2) {
    var items = _ref2.items;
    var vsid = _ref2.vsid;

    return _react2.default.createElement(
        'ul',
        { className: 'list-group' },
        items.map(function (view, idx) {
            return _react2.default.createElement(SortableItem, { key: view._id, index: idx, value: view, vsid: vsid });
        })
    );
});

var ViewsList = function (_Component) {
    _inherits(ViewsList, _Component);

    function ViewsList() {
        var _ref3;

        var _temp, _this, _ret;

        _classCallCheck(this, ViewsList);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref3 = ViewsList.__proto__ || Object.getPrototypeOf(ViewsList)).call.apply(_ref3, [this].concat(args))), _this), _this.state = {
            isSorted: false
        }, _this.onSortEnd = function (_ref4) {
            var oldIndex = _ref4.oldIndex;
            var newIndex = _ref4.newIndex;
            var views = _this.props.viewsList.views;

            _this.props.updateViews((0, _reactSortableHoc.arrayMove)(views, oldIndex, newIndex), _this.props.vsid);
            _this.setState({ isSorted: true });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ViewsList, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState({ isSorted: false });
            this.props.fetchViews();
            this.props.fetchViewsSets();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.viewsList.loading) {
                _reactDom2.default.findDOMNode(this).scrollIntoView();
            }
        }
    }, {
        key: 'saveOrder',
        value: function saveOrder() {
            var views = this.props.viewsList.views;

            var viewsByOrder = {},
                j = void 0,
                lenJ = void 0;
            for (j = 0, lenJ = views.length; j < lenJ; j += 1) {
                viewsByOrder[views[j]._id] = j;
            }
            this.props.updateOrder(viewsByOrder);
            this.setState({ isSorted: false });
        }
    }, {
        key: 'renderViews',
        value: function renderViews(views, vsid) {
            return _react2.default.createElement(SortableList, { items: views, vsid: vsid,
                onSortEnd: this.onSortEnd,
                useDragHandle: true,
                hideSortableGhost: false,
                helperClass: 'onSortingClass' });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props$viewsList = this.props.viewsList;
            var views = _props$viewsList.views;
            var loading = _props$viewsList.loading;
            var error = _props$viewsList.error;


            if (loading) {
                return _react2.default.createElement(
                    'div',
                    { className: 'container' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        'Views'
                    ),
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Loading...'
                    )
                );
            } else if (error) {
                return _react2.default.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    'Error: ',
                    error.message || _config.ERROR_RESOURCE
                );
            }

            return _react2.default.createElement(
                'div',
                { className: 'container pos-rel' },
                _react2.default.createElement(
                    'div',
                    { className: 'view-title' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        'Views'
                    ),
                    _react2.default.createElement(
                        _reactRouter.Link,
                        { to: "/vSviews/" + this.props.vsid + "/new" },
                        '+ Add new View'
                    )
                ),
                this.state.isSorted ? _react2.default.createElement(
                    'button',
                    { className: 'top-right btn btn-success',
                        onClick: this.saveOrder.bind(this) },
                    'Save current order'
                ) : null,
                this.renderViews(views, this.props.vsid)
            );
        }
    }]);

    return ViewsList;
}(_react.Component);

exports.default = ViewsList;

},{"../config.const":386,"react":"react","react-dom":"react-dom","react-router":"react-router","react-sortable-hoc":63}],379:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _views = require('../actions/views');

var _viewValidator = require('../validators/viewValidator');

var _inputs = require('./inputs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var worldId = window.config.mainScene.worldId;

//For any field errors upon submission (i.e. not instant check)
var validateAndCreateView = function validateAndCreateView(values, dispatch, vsid) {

    return new Promise(function (resolve, reject) {
        dispatch((0, _views.createView)(_extends({}, values, { world: worldId }), vsid)).then(function (response) {
            var data = response.payload.data;
            //if any one of these exist, then there is a field error
            if (response.payload.status != 200) {
                dispatch((0, _views.createViewFailure)(response.payload));
                reject(data);
            } else {
                dispatch((0, _views.createViewSuccess)(response.payload));
                resolve(values);
            }
        });
    });
};

/* CLASS */

var ViewsForm = function (_Component) {
    _inherits(ViewsForm, _Component);

    function ViewsForm() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ViewsForm);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ViewsForm.__proto__ || Object.getPrototypeOf(ViewsForm)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            lastModified: null,
            gearListMapped: []
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ViewsForm, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var gearListMapped = (0, _viewValidator.populateObjectsLeft)(window.config.gearMap);
            var gearListMappedRight = (0, _viewValidator.populateObjectsRight)(window.config.gearMap);
            this.setState({ gearListMapped: gearListMapped, gearListMappedRight: gearListMappedRight });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.updateWithCurrCamCoords(this.props.newView.view);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.pristine && !this.props.submitting) {
                _reactDom2.default.findDOMNode(this).scrollIntoView();
            }
        }
    }, {
        key: 'updateWithCurrCamCoords',
        value: function updateWithCurrCamCoords() {
            this.props.updateWithCurrCamCoords(this.props.newView.view);
            this.props.change("cameraPosition.x", this.props.newView.view.cameraPosition.x);
            this.props.change("cameraPosition.y", this.props.newView.view.cameraPosition.y);
            this.props.change("cameraPosition.z", this.props.newView.view.cameraPosition.z);
            this.props.change("targetPosition.x", this.props.newView.view.targetPosition.x);
            this.props.change("targetPosition.y", this.props.newView.view.targetPosition.y);
            this.props.change("targetPosition.z", this.props.newView.view.targetPosition.z);
        }
    }, {
        key: 'renderError',
        value: function renderError(newView) {
            if (newView && newView.error && newView.error.message) {
                return _react2.default.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    newView ? newView.error.message : ''
                );
            } else {
                return _react2.default.createElement('span', null);
            }
        }
    }, {
        key: 'saveView',
        value: function saveView(values, dispatch) {
            var me = this,
                camPos = values.cameraPosition,
                tarPos = values.targetPosition;

            window.app3dViewer.viewPosition([camPos.x, camPos.y, camPos.z], [tarPos.x, tarPos.y, tarPos.z]);

            window.app3dViewer.generateScreenshot(240, 180, "image/png", false, "", false).then(function (screenshot) {
                values.screenshot = screenshot;
                var saver = validateAndCreateView(values, dispatch, me.props.vsid),
                    router = me.context.router;
                saver.then(function () {
                    router.push("/vSviews/" + me.props.vsid);
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props;
            var asyncValidating = _props.asyncValidating;
            var handleSubmit = _props.handleSubmit;
            var pristine = _props.pristine;
            var submitting = _props.submitting;
            var newView = _props.newView;

            var gearMappedObjects = this.state.gearListMapped;
            var gearMappedObjectsRight = this.state.gearListMappedRight;

            return _react2.default.createElement(
                'div',
                { className: 'container' },
                _react2.default.createElement(
                    'h1',
                    null,
                    'New View'
                ),
                this.renderError(newView),
                _react2.default.createElement(
                    'form',
                    { onSubmit: handleSubmit(this.saveView.bind(this)) },
                    _react2.default.createElement(_reduxForm.Field, { name: 'title', component: _inputs.renderInput, type: 'text', placeholder: 'Title', label: 'Title' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'name', component: _inputs.renderInput, type: 'text', placeholder: 'Name', label: 'Name' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'keyCode', component: _inputs.renderInput, type: 'text', placeholder: 'Numeric key code', label: 'Key Code' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'highlighted', component: _inputs.renderSelect, label: 'Highlighted mapped object', dataArray: gearMappedObjectsRight }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'selected', component: _inputs.renderSelect, label: 'Selected gear', dataArray: gearMappedObjects }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'description', component: _inputs.renderTextarea, placeholder: 'Description', label: 'Description', rows: '3' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'html', component: _inputs.renderTextarea, placeholder: '<p>...</p>', label: 'Html', rows: '6' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group' },
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: function onClick() {
                                    return _this2.updateWithCurrCamCoords();
                                },
                                disabled: submitting,
                                className: 'btn btn-info' },
                            'Update fields w/ current camera/target'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'vector3group' },
                        _react2.default.createElement(
                            'h4',
                            null,
                            'Camera position'
                        ),
                        _react2.default.createElement(_reduxForm.Field, { name: 'cameraPosition.x', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'x' }),
                        _react2.default.createElement(_reduxForm.Field, { name: 'cameraPosition.y', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'y' }),
                        _react2.default.createElement(_reduxForm.Field, { name: 'cameraPosition.z', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'z' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'vector3group' },
                        _react2.default.createElement(
                            'h4',
                            null,
                            'Target position'
                        ),
                        _react2.default.createElement(_reduxForm.Field, { name: 'targetPosition.x', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'x' }),
                        _react2.default.createElement(_reduxForm.Field, { name: 'targetPosition.y', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'y' }),
                        _react2.default.createElement(_reduxForm.Field, { name: 'targetPosition.z', component: _inputs.renderInput, type: 'number', placeholder: '0.0', label: 'z' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group' },
                        _react2.default.createElement(
                            'button',
                            { type: 'submit', className: 'btn btn-primary', disabled: submitting },
                            _react2.default.createElement('span', { className: 'fa fa-save' }),
                            ' Save'
                        ),
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: "/vSviews/" + this.props.vsid, className: 'btn btn-error' },
                            'Cancel'
                        )
                    )
                )
            );
        }
    }]);

    return ViewsForm;
}(_react.Component);

ViewsForm.contextTypes = {
    router: _react.PropTypes.object
};


ViewsForm = (0, _reduxForm.reduxForm)({
    form: 'viewsNewForm',
    enableReinitialize: true,
    validate: _viewValidator.validateView
})(ViewsForm);

ViewsForm = (0, _reactRedux.connect)(function (state, ownProps) {
    return {
        vsid: ownProps.vsid,
        initialValues: state.views.newView.view,
        newView: state.views.newView // pull initial values from views reducer
    };
}, function (dispatch, ownProps) {
    return {
        updateWithCurrCamCoords: function updateWithCurrCamCoords(values) {
            dispatch((0, _views.updateViewCam)(_extends({}, values, { world: worldId }), ownProps.vsid)).then(function (response) {
                !response.error ? dispatch((0, _views.updateViewCamSuccess)(response.payload.data)) : dispatch((0, _views.updateViewCamFailure)(response.payload));
            });
        },
        resetMe: function resetMe() {
            dispatch((0, _views.resetNewView)());
        }
    };
})(ViewsForm);

exports.default = ViewsForm;

},{"../actions/views":365,"../validators/viewValidator":427,"./inputs":385,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router","redux-form":"redux-form"}],380:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _viewsSets = require('../actions/viewsSets');

var _viewsSetValidator = require('../validators/viewsSetValidator');

var _inputs = require('./inputs');

var _config = require('../config.const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//For any field errors upon submission (i.e. not instant check)
var validateAndUpdateViewsSet = function validateAndUpdateViewsSet(values, dispatch) {

    return new Promise(function (resolve, reject) {
        dispatch((0, _viewsSets.updateViewsSet)(values)).then(function (response) {
            var data = response.payload.data;
            //if any one of these exist, then there is a field error 
            if (response.payload.status != 200) {
                dispatch((0, _viewsSets.updateViewsSetFailure)(response.payload));
                reject(data);
            } else {
                dispatch((0, _viewsSets.updateViewsSetSuccess)(response.payload));
                resolve(values);
            }
        });
    });
};

/* CLASS */

var ViewsSetsForm = function (_Component) {
    _inherits(ViewsSetsForm, _Component);

    function ViewsSetsForm() {
        _classCallCheck(this, ViewsSetsForm);

        return _possibleConstructorReturn(this, (ViewsSetsForm.__proto__ || Object.getPrototypeOf(ViewsSetsForm)).apply(this, arguments));
    }

    _createClass(ViewsSetsForm, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.fetchViewsSet(this.props.viewsSetId);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            _reactDom2.default.findDOMNode(this).scrollIntoView();
        }
    }, {
        key: 'renderError',
        value: function renderError(activeViewsSet) {
            if (activeViewsSet && activeViewsSet.error && activeViewsSet.error.message) {
                return _react2.default.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    activeViewsSet ? activeViewsSet.error.message : ''
                );
            } else {
                return _react2.default.createElement('span', null);
            }
        }
    }, {
        key: 'saveViewsSet',
        value: function saveViewsSet(values, dispatch) {
            var saver = validateAndUpdateViewsSet(values, dispatch),
                router = this.context.router;
            saver.then(function () {
                router.push("/viewsSets");
            });
        }
    }, {
        key: 'deletethisViewsSet',
        value: function deletethisViewsSet() {
            var _this2 = this;

            if (window.confirm('Are you sure to delete this?')) {
                (function () {
                    var deleter = _this2.props.deleteViewsSet(_this2.props.viewsSetId, window.config.mainScene.worldId),
                        router = _this2.context.router;
                    deleter.then(function () {
                        router.push("/viewsSets");
                    });
                })();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var asyncValidating = _props.asyncValidating;
            var handleSubmit = _props.handleSubmit;
            var submitting = _props.submitting;
            var activeViewsSet = _props.activeViewsSet;


            return _react2.default.createElement(
                'div',
                { className: 'container' },
                _react2.default.createElement(
                    'h1',
                    null,
                    'Edit Views-Set'
                ),
                activeViewsSet.viewsSet ? _react2.default.createElement(
                    'h2',
                    null,
                    activeViewsSet.viewsSet.title
                ) : null,
                this.renderError(activeViewsSet),
                _react2.default.createElement(
                    'form',
                    { onSubmit: handleSubmit(this.saveViewsSet.bind(this)) },
                    _react2.default.createElement(_reduxForm.Field, { name: 'title', component: _inputs.renderInput, type: 'text', placeholder: 'Title', label: 'Title' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'name', component: _inputs.renderInput, type: 'text', placeholder: 'Name', label: 'Name' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'description', component: _inputs.renderTextarea, placeholder: 'Description', label: 'Description', rows: '3' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group' },
                        _react2.default.createElement(
                            'button',
                            { type: 'submit', className: 'btn btn-primary', disabled: submitting },
                            _react2.default.createElement('span', { className: 'fa fa-save' }),
                            ' Save'
                        ),
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/viewsSets', className: 'btn btn-error' },
                            'Cancel'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group pull-right' },
                        _react2.default.createElement(
                            'button',
                            { type: 'button', className: 'btn btn-danger',
                                onClick: this.deletethisViewsSet.bind(this),
                                disabled: submitting },
                            'Delete this Views-Set ',
                            _react2.default.createElement('span', { className: 'fa fa-times' })
                        )
                    )
                )
            );
        }
    }]);

    return ViewsSetsForm;
}(_react.Component);

ViewsSetsForm.contextTypes = {
    router: _react.PropTypes.object
};


ViewsSetsForm = (0, _reduxForm.reduxForm)({
    form: 'viewsSetsNewForm',
    enableReinitialize: true,
    validate: _viewsSetValidator.validateViewsSet
})(ViewsSetsForm);

ViewsSetsForm = (0, _reactRedux.connect)(function (state, ownProps) {
    return {
        viewsSetId: ownProps.vsid,
        initialValues: state.viewsSets.activeViewsSet.viewsSet,
        activeViewsSet: state.viewsSets.activeViewsSet // pull initial values from viewsSets reducer
    };
}, function (dispatch) {
    return {
        updateWithCurrCamCoords: function updateWithCurrCamCoords(values) {
            dispatch(updateViewsSetCam(values)).then(function (response) {
                !response.error ? dispatch(updateViewsSetCamSuccess(response.payload.data)) : dispatch(updateViewsSetCamFailure(response.payload));
            });
        },
        fetchViewsSet: function fetchViewsSet(id) {
            dispatch((0, _viewsSets.fetchViewsSet)(id)).then(function (response) {
                !response.error ? dispatch((0, _viewsSets.fetchViewsSetSuccess)(response.payload.data)) : dispatch(fetchViewsSetFailure(response.payload));
            });
        },
        deleteViewsSet: function deleteViewsSet(id, worldId) {
            return new Promise(function (resolve, reject) {
                dispatch((0, _viewsSets.deleteViewsSet)(id, worldId)).then(function (response) {
                    var data = response.payload.data;
                    if (!response.error) {
                        dispatch((0, _viewsSets.deleteViewsSetSuccess)(response.payload.data));
                        resolve();
                    } else {
                        dispatch((0, _viewsSets.deleteViewsSetFailure)(response.payload));
                        reject(data);
                    }
                });
            });
        },
        resetMe: function resetMe() {
            dispatch((0, _viewsSets.resetActiveViewsSet)());
        }
    };
})(ViewsSetsForm);

exports.default = ViewsSetsForm;

},{"../actions/viewsSets":366,"../config.const":386,"../validators/viewsSetValidator":428,"./inputs":385,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router","redux-form":"redux-form"}],381:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _config = require('../config.const');

var _reactSortableHoc = require('react-sortable-hoc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DragHandle = (0, _reactSortableHoc.SortableHandle)(function () {
    return _react2.default.createElement('span', { className: 'handle fa fa-ellipsis-v' });
});
var SortableItem = (0, _reactSortableHoc.SortableElement)(function (_ref) {
    var value = _ref.value;

    return _react2.default.createElement(
        'li',
        { className: 'list-group-item' },
        _react2.default.createElement(
            _reactRouter.Link,
            { to: "viewsSets/" + value._id },
            _react2.default.createElement(
                'h3',
                { className: 'list-group-item-heading inlined' },
                value.title,
                value.name ? _react2.default.createElement(
                    'small',
                    null,
                    value.name
                ) : null
            )
        ),
        _react2.default.createElement(
            _reactRouter.Link,
            { className: 'list-group-extra-link', to: "vSviews/" + value._id },
            '→ edit Views [',
            value.views ? value.views.length : 0,
            ']'
        ),
        _react2.default.createElement(DragHandle, null)
    );
});

var SortableList = (0, _reactSortableHoc.SortableContainer)(function (_ref2) {
    var items = _ref2.items;

    return _react2.default.createElement(
        'ul',
        { className: 'list-group' },
        items.map(function (viewsSet, idx) {
            return _react2.default.createElement(SortableItem, { key: viewsSet._id, index: idx, value: viewsSet });
        })
    );
});

var ViewsSetsList = function (_Component) {
    _inherits(ViewsSetsList, _Component);

    function ViewsSetsList() {
        var _ref3;

        var _temp, _this, _ret;

        _classCallCheck(this, ViewsSetsList);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref3 = ViewsSetsList.__proto__ || Object.getPrototypeOf(ViewsSetsList)).call.apply(_ref3, [this].concat(args))), _this), _this.state = {
            isSorted: false
        }, _this.onSortEnd = function (_ref4) {
            var oldIndex = _ref4.oldIndex;
            var newIndex = _ref4.newIndex;
            var viewsSets = _this.props.viewsSetsList.viewsSets;

            _this.props.updateViewsSets((0, _reactSortableHoc.arrayMove)(viewsSets, oldIndex, newIndex));
            _this.setState({ isSorted: true });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ViewsSetsList, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState({ isSorted: false });
            this.props.fetchViewsSets();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.viewsSetsList.loading) {
                _reactDom2.default.findDOMNode(this).scrollIntoView();
            }
        }
    }, {
        key: 'saveOrder',
        value: function saveOrder() {
            var viewsSets = this.props.viewsSetsList.viewsSets;

            var viewsSetsByOrder = {},
                j = void 0,
                lenJ = void 0;
            for (j = 0, lenJ = viewsSets.length; j < lenJ; j += 1) {
                viewsSetsByOrder[viewsSets[j]._id] = j;
            }
            this.props.updateOrder(viewsSetsByOrder);
            this.setState({ isSorted: false });
        }
    }, {
        key: 'renderViewsSets',
        value: function renderViewsSets(viewsSets) {
            return _react2.default.createElement(SortableList, { items: viewsSets,
                onSortEnd: this.onSortEnd,
                useDragHandle: true,
                hideSortableGhost: false,
                helperClass: 'onSortingClass' });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props$viewsSetsList = this.props.viewsSetsList;
            var viewsSets = _props$viewsSetsList.viewsSets;
            var loading = _props$viewsSetsList.loading;
            var error = _props$viewsSetsList.error;


            if (loading) {
                return _react2.default.createElement(
                    'div',
                    { className: 'container' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        'Views-Sets'
                    ),
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Loading...'
                    )
                );
            } else if (error) {
                return _react2.default.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    'Error: ',
                    error.message || _config.ERROR_RESOURCE
                );
            }

            return _react2.default.createElement(
                'div',
                { className: 'container pos-rel' },
                _react2.default.createElement(
                    'div',
                    { className: 'view-title' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        'Views-Sets'
                    ),
                    _react2.default.createElement(
                        _reactRouter.Link,
                        { to: '/viewsSets/new' },
                        '+ Add new Views-Set'
                    )
                ),
                this.state.isSorted ? _react2.default.createElement(
                    'button',
                    { className: 'top-right btn btn-success', onClick: this.saveOrder.bind(this) },
                    'Save current order'
                ) : null,
                this.renderViewsSets(viewsSets)
            );
        }
    }]);

    return ViewsSetsList;
}(_react.Component);

exports.default = ViewsSetsList;

},{"../config.const":386,"react":"react","react-dom":"react-dom","react-router":"react-router","react-sortable-hoc":63}],382:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _viewsSets = require('../actions/viewsSets');

var _viewsSetValidator = require('../validators/viewsSetValidator');

var _inputs = require('./inputs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//For any field errors upon submission (i.e. not instant check)
var validateAndCreateViewsSet = function validateAndCreateViewsSet(values, dispatch, worldId) {

    return new Promise(function (resolve, reject) {
        dispatch((0, _viewsSets.createViewsSet)(values, worldId)).then(function (response) {
            var data = response.payload.data;
            //if any one of these exist, then there is a field error 
            if (response.payload.status != 200) {
                dispatch((0, _viewsSets.createViewsSetFailure)(response.payload));
                reject(data);
            } else {
                dispatch((0, _viewsSets.createViewsSetSuccess)(response.payload));
                resolve(values);
            }
        });
    });
};

/* CLASS */

var ViewsSetsForm = function (_Component) {
    _inherits(ViewsSetsForm, _Component);

    function ViewsSetsForm() {
        _classCallCheck(this, ViewsSetsForm);

        return _possibleConstructorReturn(this, (ViewsSetsForm.__proto__ || Object.getPrototypeOf(ViewsSetsForm)).apply(this, arguments));
    }

    _createClass(ViewsSetsForm, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            console.log("willmount", this);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            //ReactDom.findDOMNode(this).scrollIntoView();
        }
    }, {
        key: 'renderError',
        value: function renderError(newViewsSet) {
            if (newViewsSet && newViewsSet.error && newViewsSet.error.message) {
                return _react2.default.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    newViewsSet ? newViewsSet.error.message : ''
                );
            } else {
                return _react2.default.createElement('span', null);
            }
        }
    }, {
        key: 'saveViewsSet',
        value: function saveViewsSet(values, dispatch) {
            var saver = validateAndCreateViewsSet(values, dispatch, window.config.mainScene.worldId),
                router = this.context.router;
            saver.then(function () {
                router.push("/viewsSets");
            });
        }
    }, {
        key: 'render',
        value: function render() {
            console.log(this);
            var _props = this.props;
            var asyncValidating = _props.asyncValidating;
            var handleSubmit = _props.handleSubmit;
            var submitting = _props.submitting;
            var newViewsSet = _props.newViewsSet;


            return _react2.default.createElement(
                'div',
                { className: 'container' },
                _react2.default.createElement(
                    'h1',
                    null,
                    'New Views-Set'
                ),
                this.renderError(newViewsSet),
                _react2.default.createElement(
                    'form',
                    { onSubmit: handleSubmit(this.saveViewsSet.bind(this)) },
                    _react2.default.createElement(_reduxForm.Field, { name: 'title', component: _inputs.renderInput, type: 'text', placeholder: 'Title', label: 'Title' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'name', component: _inputs.renderInput, type: 'text', placeholder: 'Name', label: 'Name' }),
                    _react2.default.createElement(_reduxForm.Field, { name: 'description', component: _inputs.renderTextarea, placeholder: 'Description', label: 'Description', rows: '3' }),
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group' },
                        _react2.default.createElement(
                            'button',
                            { type: 'submit', className: 'btn btn-primary', disabled: submitting },
                            _react2.default.createElement('span', { className: 'fa fa-save' }),
                            ' Save'
                        ),
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/viewsSets', className: 'btn btn-error' },
                            'Cancel'
                        )
                    )
                )
            );
        }
    }]);

    return ViewsSetsForm;
}(_react.Component);

ViewsSetsForm.contextTypes = {
    router: _react.PropTypes.object
};


ViewsSetsForm = (0, _reduxForm.reduxForm)({
    form: 'viewsSetsNewForm',
    enableReinitialize: true,
    validate: _viewsSetValidator.validateViewsSet
})(ViewsSetsForm);

ViewsSetsForm = (0, _reactRedux.connect)(function (state) {
    return {
        initialValues: state.viewsSets.newViewsSet.viewsSet,
        newViewsSet: state.viewsSets.newViewsSet // pull initial values from viewsSets reducer
    };
}, function (dispatch) {
    return {
        resetMe: function resetMe() {
            dispatch((0, _viewsSets.resetNewViewsSet)());
        }
    };
})(ViewsSetsForm);

exports.default = ViewsSetsForm;

},{"../actions/viewsSets":366,"../validators/viewsSetValidator":428,"./inputs":385,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router","redux-form":"redux-form"}],383:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Welcome = function (_Component) {
    _inherits(Welcome, _Component);

    function Welcome() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Welcome);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Welcome.__proto__ || Object.getPrototypeOf(Welcome)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            lastModified: ""
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Welcome, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            this.props.fetchCamPos();

            window.__reactApp.WelcomeCallback = function (data) {
                _this2.props.fetchCamPos();
                _this2.setState({ lastModified: data });
                return _this2;
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _props$data = this.props.data;
            var data = _props$data.data;
            var loading = _props$data.loading;
            var error = _props$data.error;

            var myTitle = "Welcome to the XPert-World 3D Administration UI";

            if (loading || data.length === 0) {
                return _react2.default.createElement(
                    'div',
                    { className: 'container' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        myTitle
                    ),
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Loading...'
                    )
                );
            } else if (error) {
                return _react2.default.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    'Error: ',
                    error.message || ERROR_RESOURCE
                );
            }

            return _react2.default.createElement(
                'div',
                { className: 'container pos-rel' },
                _react2.default.createElement(
                    'div',
                    { className: 'view-title' },
                    _react2.default.createElement(
                        'h1',
                        null,
                        myTitle
                    )
                ),
                _react2.default.createElement(
                    'h3',
                    null,
                    'Current camera position'
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'liVector3' },
                    _react2.default.createElement(
                        'li',
                        null,
                        'x: ',
                        Math.round(data[0].x * 1000) / 1000
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        'y: ',
                        Math.round(data[0].y * 1000) / 1000
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        'z: ',
                        Math.round(data[0].z * 1000) / 1000
                    )
                ),
                _react2.default.createElement(
                    'h3',
                    null,
                    'Current Target position'
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'liVector3' },
                    _react2.default.createElement(
                        'li',
                        null,
                        'x: ',
                        Math.round(data[1].x * 1000) / 1000
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        'y: ',
                        Math.round(data[1].y * 1000) / 1000
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        'z: ',
                        Math.round(data[1].z * 1000) / 1000
                    )
                ),
                _react2.default.createElement(
                    'p',
                    null,
                    '(this data will be available at the Edit/New \'View\' page)'
                ),
                _react2.default.createElement(
                    'p',
                    { className: 'hidden' },
                    this.state.lastModified
                )
            );
        }
    }]);

    return Welcome;
}(_react.Component);

exports.default = Welcome;

},{"react":"react","react-router":"react-router"}],384:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_Component) {
    _inherits(Header, _Component);

    function Header() {
        _classCallCheck(this, Header);

        return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
    }

    _createClass(Header, [{
        key: 'renderLinks',

        /*static contextTypes = {
            router: PropTypes.object
        };*/

        value: function renderLinks() {
            var _props = this.props;
            var type = _props.type;
            var authenticatedUser = _props.authenticatedUser;


            return _react2.default.createElement(
                'div',
                { className: 'container' },
                _react2.default.createElement(
                    'ul',
                    { className: 'nav nav-pills navbar-left' },
                    _react2.default.createElement(
                        'li',
                        { className: 'ui-title' },
                        'XPert-World Admin'
                    ),
                    _react2.default.createElement(
                        'li',
                        { role: 'presentation' },
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/' },
                            _react2.default.createElement('span', { className: 'fa fa-home' })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        { role: 'presentation' },
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/viewsSets', activeClassName: 'active' },
                            _react2.default.createElement('span', { className: 'fa fa-eye' }),
                            ' Views-Sets'
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        { role: 'presentation' },
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/infowins', activeClassName: 'active' },
                            _react2.default.createElement('span', { className: 'fa fa-info-circle' }),
                            ' Info Windows'
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        { role: 'presentation' },
                        _react2.default.createElement(
                            _reactRouter.Link,
                            { to: '/gearmap', activeClassName: 'active' },
                            _react2.default.createElement('span', { className: 'fa fa-cogs' }),
                            ' Gear-Map'
                        )
                    )
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'nav',
                { className: 'navbar navbar-default navbar-static-top' },
                _react2.default.createElement(
                    'div',
                    { id: 'navbar', className: 'navbar-collapse collapse' },
                    this.renderLinks()
                )
            );
        }
    }]);

    return Header;
}(_react.Component);

exports.default = Header;

},{"react":"react","react-router":"react-router"}],385:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderQSelect = exports.renderObjectSelect = exports.renderSelect = exports.renderTextarea = exports.renderInput = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderInput = exports.renderInput = function renderInput(_ref) {
  var input = _ref.input;
  var label = _ref.label;
  var placeholder = _ref.placeholder;
  var isBig = _ref.isBig;
  var type = _ref.type;
  var _ref$meta = _ref.meta;
  var touched = _ref$meta.touched;
  var error = _ref$meta.error;
  var invalid = _ref$meta.invalid;
  return _react2.default.createElement(
    'div',
    { className: 'form-group ' + (touched && invalid ? 'has-error' : '') },
    _react2.default.createElement(
      'label',
      { className: 'control-label' },
      label
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('input', _extends({}, input, { placeholder: placeholder, onChange: input.onChange, className: 'form-control ' + (isBig ? 'input-lg' : '') })),
      _react2.default.createElement(
        'div',
        { className: 'help-block' },
        touched && error && _react2.default.createElement(
          'span',
          null,
          error
        )
      )
    )
  );
};

var renderTextarea = exports.renderTextarea = function renderTextarea(_ref2) {
  var input = _ref2.input;
  var label = _ref2.label;
  var placeholder = _ref2.placeholder;
  var type = _ref2.type;
  var _ref2$meta = _ref2.meta;
  var touched = _ref2$meta.touched;
  var error = _ref2$meta.error;
  var invalid = _ref2$meta.invalid;
  return _react2.default.createElement(
    'div',
    { className: 'form-group ' + (touched && invalid ? 'has-error' : '') },
    _react2.default.createElement(
      'label',
      { className: 'control-label' },
      label
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('textarea', _extends({}, input, { placeholder: placeholder, className: 'form-control' })),
      _react2.default.createElement(
        'div',
        { className: 'help-block' },
        touched && error && _react2.default.createElement(
          'span',
          null,
          error
        )
      )
    )
  );
};

var renderSelect = exports.renderSelect = function renderSelect(_ref3) {
  var input = _ref3.input;
  var label = _ref3.label;
  var dataArray = _ref3.dataArray;
  var withoutNone = _ref3.withoutNone;
  var type = _ref3.type;
  var _ref3$meta = _ref3.meta;
  var touched = _ref3$meta.touched;
  var error = _ref3$meta.error;
  var invalid = _ref3$meta.invalid;
  return _react2.default.createElement(
    'div',
    { className: 'form-group ' + (touched && invalid ? 'has-error' : '') },
    _react2.default.createElement(
      'label',
      { className: 'control-label' },
      label
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'select',
        _extends({}, input, { className: 'form-control' }),
        !withoutNone && _react2.default.createElement(
          'option',
          { value: '' },
          '(None)'
        ),
        _.map(dataArray, function (dOption, idx) {
          return _react2.default.createElement(
            'option',
            { value: dOption, key: idx },
            dOption
          );
        })
      ),
      _react2.default.createElement(
        'div',
        { className: 'help-block' },
        touched && error && _react2.default.createElement(
          'span',
          null,
          error
        )
      )
    )
  );
};

var renderObjectSelect = exports.renderObjectSelect = function renderObjectSelect(_ref4) {
  var input = _ref4.input;
  var label = _ref4.label;
  var dataArray = _ref4.dataArray;
  var withoutNone = _ref4.withoutNone;
  var type = _ref4.type;
  var _ref4$meta = _ref4.meta;
  var touched = _ref4$meta.touched;
  var error = _ref4$meta.error;
  var invalid = _ref4$meta.invalid;
  return _react2.default.createElement(
    'div',
    { className: 'form-group ' + (touched && invalid ? 'has-error' : '') },
    _react2.default.createElement(
      'label',
      { className: 'control-label' },
      label
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'select',
        _extends({}, input, { className: 'form-control' }),
        !withoutNone && _react2.default.createElement(
          'option',
          { value: '' },
          '(None)'
        ),
        _.map(dataArray, function (dOption, idx) {
          return _react2.default.createElement(
            'option',
            { value: dOption.value, key: idx },
            dOption.label
          );
        })
      ),
      _react2.default.createElement(
        'div',
        { className: 'help-block' },
        touched && error && _react2.default.createElement(
          'span',
          null,
          error
        )
      )
    )
  );
};

var renderQSelect = exports.renderQSelect = function renderQSelect(_ref5) {
  var input = _ref5.input;
  var label = _ref5.label;
  var dataArray = _ref5.dataArray;
  var selectedValue = _ref5.selectedValue;
  var onChange = _ref5.onChange;
  var type = _ref5.type;
  var _ref5$meta = _ref5.meta;
  var touched = _ref5$meta.touched;
  var error = _ref5$meta.error;
  var invalid = _ref5$meta.invalid;
  return _react2.default.createElement(
    'div',
    { className: 'form-group ' + (touched && invalid ? 'has-error' : '') },
    _react2.default.createElement(
      'label',
      { className: 'control-label' },
      label
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'select',
        _extends({}, input, { value: selectedValue, className: 'form-control', onChange: onChange }),
        _.map(dataArray, function (grade) {
          return _react2.default.createElement(
            'option',
            { value: grade.value, key: grade.value },
            grade.label
          );
        })
      ),
      _react2.default.createElement(
        'div',
        { className: 'help-block' },
        touched && error && _react2.default.createElement(
          'span',
          null,
          error
        )
      )
    )
  );
};

},{"react":"react"}],386:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ROOT_URL = exports.ROOT_URL = location.href.indexOf('localhost') > 0 ? 'http://localhost:3000/api' : '/api';
var ROOT_IMG_URL = exports.ROOT_IMG_URL = '/system/images/screenshots/';
var ERROR_RESOURCE = exports.ERROR_RESOURCE = "Couldn't load resource.";

},{}],387:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _App = require('../components/App.js');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {};
};

exports.default = (0, _reactRedux.connect)(null, mapDispatchToProps)(_App2.default);

},{"../components/App.js":368,"react":"react","react-redux":"react-redux"}],388:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _gearmap = require('../actions/gearmap');

var _GearmapList = require('../components/GearmapList');

var _GearmapList2 = _interopRequireDefault(_GearmapList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var worldId = window.config.mainScene.worldId;

var mapStateToProps = function mapStateToProps(state) {
  return {
    gearmapList: state.gearmap.gearmapList
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    fetchGearmap: function fetchGearmap() {
      dispatch((0, _gearmap.fetchGearmap)(worldId)).then(function (response) {
        !response.error ? dispatch((0, _gearmap.fetchGearmapSuccess)(response.payload.data)) : dispatch((0, _gearmap.fetchGearmapFailure)(response.payload));
      });
    },
    saveGearmap: function saveGearmap(gearmap, worldId) {
      return new Promise(function (resolve, reject) {
        dispatch((0, _gearmap.saveGearmap)(worldId, gearmap)).then(function (response) {
          if (!response.error) {
            dispatch((0, _gearmap.saveGearmapSuccess)(response.payload.data));
            resolve();
          } else {
            dispatch((0, _gearmap.saveGearmapFailure)(response.payload));
            reject(response.payload);
          }
        });
      });
    }
  };
};

var GearmapListContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_GearmapList2.default);

exports.default = GearmapListContainer;

},{"../actions/gearmap":360,"../components/GearmapList":369,"react-redux":"react-redux"}],389:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _views = require('../actions/views');

var _header = require('../components/header.js');

var _header2 = _interopRequireDefault(_header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapStateToProps(state) {
  return {
    deletedView: state.views.deletedView
  };
}

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    onDeleteClick: function onDeleteClick() {
      dispatch((0, _views.deleteView)(ownProps.viewId, token)).then(function (response) {
        !response.error ? dispatch((0, _views.deleteViewSuccess)(response.payload)) : dispatch((0, _views.deleteViewFailure)(response.payload));
      });
    },
    resetMe: function resetMe() {
      dispatch((0, _views.resetDeletedView)());
    }

  };
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_header2.default);

},{"../actions/views":365,"../components/header.js":384,"react":"react","react-redux":"react-redux"}],390:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _infowins = require('../actions/infowins');

var _InfowinsList = require('../components/InfowinsList');

var _InfowinsList2 = _interopRequireDefault(_InfowinsList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var worldId = window.config.mainScene.worldId;

var mapStateToProps = function mapStateToProps(state) {
  return {
    infowinsList: state.infowins.infowinsList
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    fetchInfowins: function fetchInfowins() {
      dispatch((0, _infowins.fetchInfowins)(worldId)).then(function (response) {
        !response.error ? dispatch((0, _infowins.fetchInfowinsSuccess)(response.payload.data)) : dispatch((0, _infowins.fetchInfowinsFailure)(response.payload));
      });
    },
    updateInfowins: function updateInfowins(infowins) {
      dispatch((0, _infowins.fetchInfowinsSuccess)({ data: infowins }));
    }
  };
};

var InfowinsListContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_InfowinsList2.default);

exports.default = InfowinsListContainer;

},{"../actions/infowins":361,"../components/InfowinsList":371,"react-redux":"react-redux"}],391:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _views = require('../actions/views');

var _viewsSets = require('../actions/viewsSets');

var _ViewsList = require('../components/ViewsList');

var _ViewsList2 = _interopRequireDefault(_ViewsList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var worldId = window.config.mainScene.worldId;

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    viewsList: state.views.viewsList,
    viewsSetsList: state.viewsSets.viewsSetsList,
    vsid: ownProps.vsid
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchViews: function fetchViews() {
      dispatch((0, _views.fetchViews)('viewsSet', ownProps.vsid)).then(function (response) {
        !response.error ? dispatch((0, _views.fetchViewsSuccess)(response.payload.data)) : dispatch((0, _views.fetchViewsFailure)(response.payload));
      });
    },
    updateViews: function updateViews(views) {
      dispatch((0, _views.fetchViewsSuccess)({ data: views }));
    },
    updateOrder: function updateOrder(nOrder) {
      dispatch((0, _views.saveOViews)(ownProps.vsid, nOrder)).then(function (response) {
        !response.error ? dispatch((0, _views.saveOViewsSuccess)(response.payload.data)) : dispatch((0, _views.saveOViewsFailure)(response.payload));
      });
    },
    fetchViewsSets: function fetchViewsSets() {
      dispatch((0, _viewsSets.fetchViewsSets)(worldId)).then(function (response) {
        !response.error ? dispatch((0, _viewsSets.fetchViewsSetsSuccess)(response.payload.data)) : dispatch((0, _viewsSets.fetchViewsSetsFailure)(response.payload));
      });
    }
  };
};

var ViewsListContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_ViewsList2.default);

exports.default = ViewsListContainer;

},{"../actions/views":365,"../actions/viewsSets":366,"../components/ViewsList":378,"react-redux":"react-redux"}],392:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _viewsSets = require('../actions/viewsSets');

var _ViewsSetsList = require('../components/ViewsSetsList');

var _ViewsSetsList2 = _interopRequireDefault(_ViewsSetsList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var worldId = window.config.mainScene.worldId;

var mapStateToProps = function mapStateToProps(state) {
  return {
    viewsSetsList: state.viewsSets.viewsSetsList
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    fetchViewsSets: function fetchViewsSets() {
      dispatch((0, _viewsSets.fetchViewsSets)(worldId)).then(function (response) {
        !response.error ? dispatch((0, _viewsSets.fetchViewsSetsSuccess)(response.payload.data)) : dispatch((0, _viewsSets.fetchViewsSetsFailure)(response.payload));
      });
    },
    updateViewsSets: function updateViewsSets(viewsSets) {
      dispatch((0, _viewsSets.fetchViewsSetsSuccess)({ data: viewsSets }));
    },
    updateOrder: function updateOrder(nOrder) {
      dispatch((0, _viewsSets.saveOViewsSets)(worldId, nOrder)).then(function (response) {
        !response.error ? dispatch((0, _viewsSets.saveOViewsSetsSuccess)(response.payload.data)) : dispatch((0, _viewsSets.saveOViewsSetsFailure)(response.payload));
      });
    }
  };
};

var ViewsSetsListContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_ViewsSetsList2.default);

exports.default = ViewsSetsListContainer;

},{"../actions/viewsSets":366,"../components/ViewsSetsList":381,"react-redux":"react-redux"}],393:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _welcome = require('../actions/welcome');

var _Welcome = require('../components/Welcome');

var _Welcome2 = _interopRequireDefault(_Welcome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
  return {
    data: state.welcome.camPos
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    fetchCamPos: function fetchCamPos() {
      dispatch((0, _welcome.fetchCamPos)()).then(function (response) {
        !response.error ? dispatch((0, _welcome.fetchCamPosSuccess)(response.payload)) : dispatch((0, _welcome.fetchCamPosFailure)(response.payload));
      });
    }
  };
};

var WelcomeContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_Welcome2.default);

exports.default = WelcomeContainer;

},{"../actions/welcome":367,"../components/Welcome":383,"react-redux":"react-redux"}],394:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _reactRouter = require('react-router');

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _configureStore = require('./store/configureStore.js');

var _configureStore2 = _interopRequireDefault(_configureStore);

var _history = require('history');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appHistory = (0, _reactRouter.useRouterHistory)(_history.createHashHistory)({});

var store = (0, _configureStore2.default)();
window.app3dMgmtStore = store;
window.app3dMgmtHistory = appHistory;

var appM = _react2.default.createElement(
  _reactRedux.Provider,
  { store: store },
  _react2.default.createElement(_reactRouter.Router, { history: appHistory, routes: _routes2.default })
);

_reactDom2.default.render(appM, document.getElementById("mgmt"));

},{"./routes":420,"./store/configureStore.js":422,"history":22,"react":"react","react-dom":"react-dom","react-redux":"react-redux","react-router":"react-router"}],395:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AppContainer = require('../containers/AppContainer');

var _AppContainer2 = _interopRequireDefault(_AppContainer);

var _HeaderContainer = require('../containers/HeaderContainer.js');

var _HeaderContainer2 = _interopRequireDefault(_HeaderContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'react-mgmt-app-header' },
          _react2.default.createElement(_HeaderContainer2.default, null)
        ),
        _react2.default.createElement(
          _AppContainer2.default,
          null,
          _react2.default.createElement(
            'div',
            { className: 'react-mgmt-app-body' },
            this.props.children
          )
        )
      );
    }
  }]);

  return App;
}(_react.Component);

exports.default = App;

},{"../containers/AppContainer":387,"../containers/HeaderContainer.js":389,"react":"react"}],396:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _GearmapListContainer = require('../containers/GearmapListContainer.js');

var _GearmapListContainer2 = _interopRequireDefault(_GearmapListContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewsIndex = function (_Component) {
  _inherits(ViewsIndex, _Component);

  function ViewsIndex() {
    _classCallCheck(this, ViewsIndex);

    return _possibleConstructorReturn(this, (ViewsIndex.__proto__ || Object.getPrototypeOf(ViewsIndex)).apply(this, arguments));
  }

  _createClass(ViewsIndex, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_GearmapListContainer2.default, null)
      );
    }
  }]);

  return ViewsIndex;
}(_react.Component);

exports.default = _GearmapListContainer2.default;

},{"../containers/GearmapListContainer.js":388,"react":"react"}],397:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InfowinsEditForm = require('../components/InfowinsEditForm.js');

var _InfowinsEditForm2 = _interopRequireDefault(_InfowinsEditForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfowinsEdit = function (_Component) {
  _inherits(InfowinsEdit, _Component);

  function InfowinsEdit() {
    _classCallCheck(this, InfowinsEdit);

    return _possibleConstructorReturn(this, (InfowinsEdit.__proto__ || Object.getPrototypeOf(InfowinsEdit)).apply(this, arguments));
  }

  _createClass(InfowinsEdit, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_InfowinsEditForm2.default, {
          parentType: this.props.params.parentType,
          parentId: this.props.params.parentId,
          id: this.props.params.id })
      );
    }
  }]);

  return InfowinsEdit;
}(_react.Component);

exports.default = InfowinsEdit;

},{"../components/InfowinsEditForm.js":370,"react":"react"}],398:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InfowinsListContainer = require('../containers/InfowinsListContainer.js');

var _InfowinsListContainer2 = _interopRequireDefault(_InfowinsListContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfowinsIndex = function (_Component) {
  _inherits(InfowinsIndex, _Component);

  function InfowinsIndex() {
    _classCallCheck(this, InfowinsIndex);

    return _possibleConstructorReturn(this, (InfowinsIndex.__proto__ || Object.getPrototypeOf(InfowinsIndex)).apply(this, arguments));
  }

  _createClass(InfowinsIndex, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_InfowinsListContainer2.default, null)
      );
    }
  }]);

  return InfowinsIndex;
}(_react.Component);

exports.default = InfowinsIndex;

},{"../containers/InfowinsListContainer.js":390,"react":"react"}],399:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InfowinsNewForm = require('../components/InfowinsNewForm.js');

var _InfowinsNewForm2 = _interopRequireDefault(_InfowinsNewForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfowinsNew = function (_Component) {
  _inherits(InfowinsNew, _Component);

  function InfowinsNew() {
    _classCallCheck(this, InfowinsNew);

    return _possibleConstructorReturn(this, (InfowinsNew.__proto__ || Object.getPrototypeOf(InfowinsNew)).apply(this, arguments));
  }

  _createClass(InfowinsNew, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_InfowinsNewForm2.default, { parentType: this.props.params.parentType, parentId: this.props.params.parentId })
      );
    }
  }]);

  return InfowinsNew;
}(_react.Component);

exports.default = InfowinsNew;

},{"../components/InfowinsNewForm.js":372,"react":"react"}],400:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MarkersEditForm = require('../components/MarkersEditForm.js');

var _MarkersEditForm2 = _interopRequireDefault(_MarkersEditForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MarkersEdit = function (_Component) {
  _inherits(MarkersEdit, _Component);

  function MarkersEdit() {
    _classCallCheck(this, MarkersEdit);

    return _possibleConstructorReturn(this, (MarkersEdit.__proto__ || Object.getPrototypeOf(MarkersEdit)).apply(this, arguments));
  }

  _createClass(MarkersEdit, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_MarkersEditForm2.default, {
          parentId: this.props.params.parentId,
          id: this.props.params.id })
      );
    }
  }]);

  return MarkersEdit;
}(_react.Component);

exports.default = MarkersEdit;

},{"../components/MarkersEditForm.js":373,"react":"react"}],401:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MarkersNewForm = require('../components/MarkersNewForm.js');

var _MarkersNewForm2 = _interopRequireDefault(_MarkersNewForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MarkersNew = function (_Component) {
  _inherits(MarkersNew, _Component);

  function MarkersNew() {
    _classCallCheck(this, MarkersNew);

    return _possibleConstructorReturn(this, (MarkersNew.__proto__ || Object.getPrototypeOf(MarkersNew)).apply(this, arguments));
  }

  _createClass(MarkersNew, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_MarkersNewForm2.default, {
          parentId: this.props.params.parentId
        })
      );
    }
  }]);

  return MarkersNew;
}(_react.Component);

exports.default = MarkersNew;

},{"../components/MarkersNewForm.js":374,"react":"react"}],402:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _QuestionsEditForm = require('../components/QuestionsEditForm.js');

var _QuestionsEditForm2 = _interopRequireDefault(_QuestionsEditForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QuestionEdit = function (_Component) {
  _inherits(QuestionEdit, _Component);

  function QuestionEdit() {
    _classCallCheck(this, QuestionEdit);

    return _possibleConstructorReturn(this, (QuestionEdit.__proto__ || Object.getPrototypeOf(QuestionEdit)).apply(this, arguments));
  }

  _createClass(QuestionEdit, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_QuestionsEditForm2.default, {
          parentType: this.props.params.parentType,
          parentId: this.props.params.parentId,
          id: this.props.params.id })
      );
    }
  }]);

  return QuestionEdit;
}(_react.Component);

exports.default = QuestionEdit;

},{"../components/QuestionsEditForm.js":375,"react":"react"}],403:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _QuestionsNewForm = require('../components/QuestionsNewForm.js');

var _QuestionsNewForm2 = _interopRequireDefault(_QuestionsNewForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QuestionNew = function (_Component) {
  _inherits(QuestionNew, _Component);

  function QuestionNew() {
    _classCallCheck(this, QuestionNew);

    return _possibleConstructorReturn(this, (QuestionNew.__proto__ || Object.getPrototypeOf(QuestionNew)).apply(this, arguments));
  }

  _createClass(QuestionNew, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_QuestionsNewForm2.default, { parentType: this.props.params.parentType, parentId: this.props.params.parentId })
      );
    }
  }]);

  return QuestionNew;
}(_react.Component);

exports.default = QuestionNew;

},{"../components/QuestionsNewForm.js":376,"react":"react"}],404:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ViewsEditForm = require('../components/ViewsEditForm.js');

var _ViewsEditForm2 = _interopRequireDefault(_ViewsEditForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewsNew = function (_Component) {
  _inherits(ViewsNew, _Component);

  function ViewsNew() {
    _classCallCheck(this, ViewsNew);

    return _possibleConstructorReturn(this, (ViewsNew.__proto__ || Object.getPrototypeOf(ViewsNew)).apply(this, arguments));
  }

  _createClass(ViewsNew, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_ViewsEditForm2.default, { vsid: this.props.params.vsid, id: this.props.params.id })
      );
    }
  }]);

  return ViewsNew;
}(_react.Component);

exports.default = ViewsNew;

},{"../components/ViewsEditForm.js":377,"react":"react"}],405:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ViewsListContainer = require('../containers/ViewsListContainer.js');

var _ViewsListContainer2 = _interopRequireDefault(_ViewsListContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewsIndex = function (_Component) {
  _inherits(ViewsIndex, _Component);

  function ViewsIndex() {
    _classCallCheck(this, ViewsIndex);

    return _possibleConstructorReturn(this, (ViewsIndex.__proto__ || Object.getPrototypeOf(ViewsIndex)).apply(this, arguments));
  }

  _createClass(ViewsIndex, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_ViewsListContainer2.default, { vsid: this.props.params.vsid })
      );
    }
  }]);

  return ViewsIndex;
}(_react.Component);

exports.default = ViewsIndex;

},{"../containers/ViewsListContainer.js":391,"react":"react"}],406:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ViewsNewForm = require('../components/ViewsNewForm.js');

var _ViewsNewForm2 = _interopRequireDefault(_ViewsNewForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewsNew = function (_Component) {
  _inherits(ViewsNew, _Component);

  function ViewsNew() {
    _classCallCheck(this, ViewsNew);

    return _possibleConstructorReturn(this, (ViewsNew.__proto__ || Object.getPrototypeOf(ViewsNew)).apply(this, arguments));
  }

  _createClass(ViewsNew, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_ViewsNewForm2.default, { vsid: this.props.params.vsid })
      );
    }
  }]);

  return ViewsNew;
}(_react.Component);

exports.default = ViewsNew;

},{"../components/ViewsNewForm.js":379,"react":"react"}],407:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ViewsSetsEditForm = require('../components/ViewsSetsEditForm.js');

var _ViewsSetsEditForm2 = _interopRequireDefault(_ViewsSetsEditForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewsSetsNew = function (_Component) {
  _inherits(ViewsSetsNew, _Component);

  function ViewsSetsNew() {
    _classCallCheck(this, ViewsSetsNew);

    return _possibleConstructorReturn(this, (ViewsSetsNew.__proto__ || Object.getPrototypeOf(ViewsSetsNew)).apply(this, arguments));
  }

  _createClass(ViewsSetsNew, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_ViewsSetsEditForm2.default, { vsid: this.props.params.vsid })
      );
    }
  }]);

  return ViewsSetsNew;
}(_react.Component);

exports.default = ViewsSetsNew;

},{"../components/ViewsSetsEditForm.js":380,"react":"react"}],408:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ViewsSetsListContainer = require('../containers/ViewsSetsListContainer.js');

var _ViewsSetsListContainer2 = _interopRequireDefault(_ViewsSetsListContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewsSetsIndex = function (_Component) {
  _inherits(ViewsSetsIndex, _Component);

  function ViewsSetsIndex() {
    _classCallCheck(this, ViewsSetsIndex);

    return _possibleConstructorReturn(this, (ViewsSetsIndex.__proto__ || Object.getPrototypeOf(ViewsSetsIndex)).apply(this, arguments));
  }

  _createClass(ViewsSetsIndex, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_ViewsSetsListContainer2.default, null)
      );
    }
  }]);

  return ViewsSetsIndex;
}(_react.Component);

exports.default = ViewsSetsIndex;

},{"../containers/ViewsSetsListContainer.js":392,"react":"react"}],409:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ViewsSetsNewForm = require('../components/ViewsSetsNewForm.js');

var _ViewsSetsNewForm2 = _interopRequireDefault(_ViewsSetsNewForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewsSetsNew = function (_Component) {
  _inherits(ViewsSetsNew, _Component);

  function ViewsSetsNew() {
    _classCallCheck(this, ViewsSetsNew);

    return _possibleConstructorReturn(this, (ViewsSetsNew.__proto__ || Object.getPrototypeOf(ViewsSetsNew)).apply(this, arguments));
  }

  _createClass(ViewsSetsNew, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_ViewsSetsNewForm2.default, null)
      );
    }
  }]);

  return ViewsSetsNew;
}(_react.Component);

exports.default = ViewsSetsNew;

},{"../components/ViewsSetsNewForm.js":382,"react":"react"}],410:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _WelcomeContainer = require('../containers/WelcomeContainer.js');

var _WelcomeContainer2 = _interopRequireDefault(_WelcomeContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WelcomeIndex = function (_Component) {
  _inherits(WelcomeIndex, _Component);

  function WelcomeIndex() {
    _classCallCheck(this, WelcomeIndex);

    return _possibleConstructorReturn(this, (WelcomeIndex.__proto__ || Object.getPrototypeOf(WelcomeIndex)).apply(this, arguments));
  }

  _createClass(WelcomeIndex, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_WelcomeContainer2.default, null)
      );
    }
  }]);

  return WelcomeIndex;
}(_react.Component);

exports.default = WelcomeIndex;

},{"../containers/WelcomeContainer.js":393,"react":"react"}],411:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _reducer_views = require('./reducer_views');

var _reducer_views2 = _interopRequireDefault(_reducer_views);

var _reducer_viewsSets = require('./reducer_viewsSets');

var _reducer_viewsSets2 = _interopRequireDefault(_reducer_viewsSets);

var _reducer_threeDObjects = require('./reducer_threeDObjects');

var _reducer_threeDObjects2 = _interopRequireDefault(_reducer_threeDObjects);

var _reducer_infowins = require('./reducer_infowins');

var _reducer_infowins2 = _interopRequireDefault(_reducer_infowins);

var _reducer_questions = require('./reducer_questions');

var _reducer_questions2 = _interopRequireDefault(_reducer_questions);

var _reducer_welcome = require('./reducer_welcome');

var _reducer_welcome2 = _interopRequireDefault(_reducer_welcome);

var _reducer_markers = require('./reducer_markers');

var _reducer_markers2 = _interopRequireDefault(_reducer_markers);

var _reducer_gearmap = require('./reducer_gearmap');

var _reducer_gearmap2 = _interopRequireDefault(_reducer_gearmap);

var _reduxForm = require('redux-form');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootReducer = (0, _redux.combineReducers)({
    welcome: _reducer_welcome2.default, //<-- Welcome
    views: _reducer_views2.default, //<-- Views
    viewsSets: _reducer_viewsSets2.default, //<-- ViewsSets
    threeDObjects: _reducer_threeDObjects2.default, //<-- ThreeDObjects
    infowins: _reducer_infowins2.default, //<-- Infowins
    questions: _reducer_questions2.default, //<-- Questions
    markers: _reducer_markers2.default, //<-- Markers
    gearmap: _reducer_gearmap2.default, //<-- Gearmap
    form: _reduxForm.reducer
});

exports.default = rootReducer;

},{"./reducer_gearmap":412,"./reducer_infowins":413,"./reducer_markers":414,"./reducer_questions":415,"./reducer_threeDObjects":416,"./reducer_views":417,"./reducer_viewsSets":418,"./reducer_welcome":419,"redux":"redux","redux-form":"redux-form"}],412:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
  var action = arguments[1];

  var error = void 0;
  switch (action.type) {

    case _gearmap.FETCH_GEARMAP:
      // start fetching gearmap and set loading = true
      return _extends({}, state, { gearmapList: { gearmap: [], error: null, loading: true } });
    case _gearmap.FETCH_GEARMAP_SUCCESS:
      // return list of gearmap and make loading = false
      return _extends({}, state, { gearmapList: { gearmap: action.payload.data, error: null, loading: false } });
    case _gearmap.FETCH_GEARMAP_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { gearmapList: { gearmap: [], error: error, loading: false } });
    case _gearmap.RESET_GEARMAP:
      // reset viewList to initial state
      return _extends({}, state, { gearmapList: { gearmap: [], error: null, loading: false } });

    case _gearmap.SAVE_GEARMAP:
      // start fetching gearmap and set loading = true
      return _extends({}, state, { gearmapList: { gearmap: [], error: null, loading: true } });
    case _gearmap.SAVE_GEARMAP_SUCCESS:
      // return list of gearmap and make loading = false
      return _extends({}, state, { gearmapList: { gearmap: action.payload.data, error: null, loading: false } });
    case _gearmap.SAVE_GEARMAP_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { gearmapList: { gearmap: [], error: error, loading: false } });
    case _gearmap.RESET_SAVE_GEARMAP:
      // reset viewList to initial state
      return _extends({}, state, { gearmapList: { gearmap: [], error: null, loading: false } });

    default:
      return state;
  }
};

var _gearmap = require('../actions/gearmap');

var INITIAL_STATE = { gearmapList: { gearmap: [], error: null, loading: false } };

},{"../actions/gearmap":360}],413:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
  var action = arguments[1];

  var error = void 0;
  switch (action.type) {

    case _infowins.FETCH_INFOWINS:
      // start fetching infowins and set loading = true
      return _extends({}, state, { infowinsList: { infowins: [], error: null, loading: true } });
    case _infowins.FETCH_INFOWINS_SUCCESS:
      // return list of infowins and make loading = false
      return _extends({}, state, { infowinsList: { infowins: action.payload.data, error: null, loading: false } });
    case _infowins.FETCH_INFOWINS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { infowinsList: { infowins: [], error: error, loading: false } });
    case _infowins.RESET_INFOWINS:
      // reset infowinList to initial state
      return _extends({}, state, { infowinsList: { infowins: [], error: null, loading: false } });

    case _infowins.SAVE_OINFOWINS:
      // start fetching infowins and set loading = true
      return _extends({}, state, { infowinsList: { infowins: [], error: null, loading: true } });
    case _infowins.SAVE_OINFOWINS_SUCCESS:
      // return list of infowins and make loading = false
      return _extends({}, state, { infowinsList: { infowins: action.payload.data, error: null, loading: false } });
    case _infowins.SAVE_OINFOWINS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { infowinsList: { infowins: [], error: error, loading: false } });
    case _infowins.RESET_SAVE_OINFOWINS:
      // reset infowinList to initial state
      return _extends({}, state, { infowinsList: { infowins: [], error: null, loading: false } });

    case _infowins.FETCH_INFOWIN:
      return _extends({}, state, { activeInfowin: _extends({}, state.activeInfowin, { loading: true }) });
    case _infowins.FETCH_INFOWIN_SUCCESS:
      return _extends({}, state, { activeInfowin: { infowin: action.payload.data, error: null, loading: false } });
    case _infowins.FETCH_INFOWIN_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { activeInfowin: { infowin: null, error: error, loading: false } });
    case _infowins.RESET_ACTIVE_INFOWIN:
      return _extends({}, state, { activeInfowin: { infowin: null, error: null, loading: false } });

    case _infowins.CREATE_INFOWIN:
      return _extends({}, state, { newInfowin: _extends({}, state.newInfowin, { loading: true }) });
    case _infowins.CREATE_INFOWIN_SUCCESS:
      return _extends({}, state, { newInfowin: { infowin: action.payload.data, error: null, loading: false } });
    case _infowins.CREATE_INFOWIN_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { newInfowin: { infowin: null, error: error, loading: false } });
    case _infowins.RESET_NEW_INFOWIN:
      return _extends({}, state, { newInfowin: { infowin: null, error: null, loading: false } });

    case _infowins.UPDATE_INFOWINCAM:
      return _extends({}, state, { newInfowin: _extends({}, state.newInfowin, { error: null, loading: true }) });
    case _infowins.UPDATE_INFOWINCAM_SUCCESS:
      return _extends({}, state, { newInfowin: { infowin: action.payload.data, error: null, loading: false } });
    case _infowins.UPDATE_INFOWINCAM_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { newInfowin: { infowin: null, error: error, loading: false } });

    case _infowins.DELETE_INFOWIN:
      return _extends({}, state, { deletedInfowin: _extends({}, state.deletedInfowin, { loading: true }) });
    case _infowins.DELETE_INFOWIN_SUCCESS:
      return _extends({}, state, { deletedInfowin: { infowin: action.payload.data, error: null, loading: false } });
    case _infowins.DELETE_INFOWIN_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { deletedInfowin: { infowin: null, error: error, loading: false } });
    case _infowins.RESET_DELETED_INFOWIN:
      return _extends({}, state, { deletedInfowin: { infowin: null, error: null, loading: false } });

    case _infowins.CLONE_INFOWIN:
      return _extends({}, state, { clonedInfowin: _extends({}, state.clonedInfowin, { loading: true }) });
    case _infowins.CLONE_INFOWIN_SUCCESS:
      return _extends({}, state, { clonedInfowin: { infowin: action.payload.data, error: null, loading: false } });
    case _infowins.CLONE_INFOWIN_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { clonedInfowin: { infowin: null, error: error, loading: false } });

    case _infowins.VALIDATE_INFOWIN_FIELDS:
      return _extends({}, state, { newInfowin: _extends({}, state.newInfowin, { error: null, loading: true }) });
    case _infowins.VALIDATE_INFOWIN_FIELDS_SUCCESS:
      return _extends({}, state, { newInfowin: _extends({}, state.newInfowin, { error: null, loading: false }) });
    case _infowins.VALIDATE_INFOWIN_FIELDS_FAILURE:
      var result = action.payload.data;
      if (!result) {
        error = { message: action.payload.message };
      } else {
        error = { title: result.title, categories: result.categories, description: result.description };
      }
      return _extends({}, state, { newInfowin: _extends({}, state.newInfowin, { error: error, loading: false }) });
    case _infowins.RESET_INFOWIN_FIELDS:
      return _extends({}, state, { newInfowin: _extends({}, state.newInfowin, { error: null, loading: null }) });
    default:
      return state;
  }
};

var _infowins = require("../actions/infowins");

var baseInfowin = {
  title: "",
  name: ""
};

var INITIAL_STATE = { infowinsList: { infowins: [], error: null, loading: false },
  newInfowin: { infowin: baseInfowin, error: null, loading: false },
  activeInfowin: { infowin: null, error: null, loading: false },
  deletedInfowin: { infowin: null, error: null, loading: false },
  clonedInfowin: { infowin: null, error: null, loading: false }
};

},{"../actions/infowins":361}],414:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
  var action = arguments[1];

  var error = void 0;
  switch (action.type) {

    case _markers.FETCH_MARKERS:
      // start fetching markers and set loading = true
      return _extends({}, state, { markersList: { markers: [], error: null, loading: true } });
    case _markers.FETCH_MARKERS_SUCCESS:
      // return list of markers and make loading = false
      return _extends({}, state, { markersList: { markers: action.payload.data, error: null, loading: false } });
    case _markers.FETCH_MARKERS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { markersList: { markers: [], error: error, loading: false } });
    case _markers.RESET_MARKERS:
      // reset markerList to initial state
      return _extends({}, state, { markersList: { markers: [], error: null, loading: false } });

    case _markers.SAVE_OMARKERS:
      // start fetching markers and set loading = true
      return _extends({}, state, { markersList: { markers: [], error: null, loading: true } });
    case _markers.SAVE_OMARKERS_SUCCESS:
      // return list of markers and make loading = false
      return _extends({}, state, { markersList: { markers: action.payload.data, error: null, loading: false } });
    case _markers.SAVE_OMARKERS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { markersList: { markers: [], error: error, loading: false } });
    case _markers.RESET_SAVE_OMARKERS:
      // reset markerList to initial state
      return _extends({}, state, { markersList: { markers: [], error: null, loading: false } });

    case _markers.FETCH_MARKER:
      return _extends({}, state, { activeMarker: _extends({}, state.activeMarker, { loading: true }) });
    case _markers.FETCH_MARKER_SUCCESS:
      return _extends({}, state, { activeMarker: { marker: action.payload.data, error: null, loading: false } });
    case _markers.FETCH_MARKER_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { activeMarker: { marker: null, error: error, loading: false } });
    case _markers.RESET_ACTIVE_MARKER:
      return _extends({}, state, { activeMarker: { marker: null, error: null, loading: false } });

    case _markers.CREATE_MARKER:
      return _extends({}, state, { newMarker: _extends({}, state.newMarker, { loading: true }) });
    case _markers.CREATE_MARKER_SUCCESS:
      return _extends({}, state, { newMarker: { marker: action.payload.data, error: null, loading: false } });
    case _markers.CREATE_MARKER_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { newMarker: { marker: null, error: error, loading: false } });
    case _markers.RESET_NEW_MARKER:
      return _extends({}, state, { newMarker: { marker: null, error: null, loading: false } });

    case _markers.DELETE_MARKER:
      return _extends({}, state, { deletedMarker: _extends({}, state.deletedMarker, { loading: true }) });
    case _markers.DELETE_MARKER_SUCCESS:
      return _extends({}, state, { deletedMarker: { marker: action.payload.data, error: null, loading: false } });
    case _markers.DELETE_MARKER_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { deletedMarker: { marker: null, error: error, loading: false } });
    case _markers.RESET_DELETED_MARKER:
      return _extends({}, state, { deletedMarker: { marker: null, error: null, loading: false } });

    case _markers.VALIDATE_MARKER_FIELDS:
      return _extends({}, state, { newMarker: _extends({}, state.newMarker, { error: null, loading: true }) });
    case _markers.VALIDATE_MARKER_FIELDS_SUCCESS:
      return _extends({}, state, { newMarker: _extends({}, state.newMarker, { error: null, loading: false }) });
    case _markers.VALIDATE_MARKER_FIELDS_FAILURE:
      var result = action.payload.data;
      if (!result) {
        error = { message: action.payload.message };
      } else {
        error = { title: result.title, categories: result.categories, description: result.description };
      }
      return _extends({}, state, { newMarker: _extends({}, state.newMarker, { error: error, loading: false }) });
    case _markers.RESET_MARKER_FIELDS:
      return _extends({}, state, { newMarker: _extends({}, state.newMarker, { error: null, loading: null }) });
    default:
      return state;
  }
};

var _markers = require("../actions/markers");

var baseMarker = {
  title: "",
  dismissText: "Got it!",
  optionsOnShowFeedback: "{}",
  optionsOnDismissFeedback: "{}"
};

var INITIAL_STATE = { markersList: { markers: [], error: null, loading: false },
  newMarker: { marker: baseMarker, error: null, loading: false },
  activeMarker: { marker: null, error: null, loading: false },
  deletedMarker: { marker: null, error: null, loading: false }
};

},{"../actions/markers":362}],415:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
  var action = arguments[1];

  var error = void 0;
  switch (action.type) {

    case _questions.FETCH_QUESTIONS:
      // start fetching questions and set loading = true
      return _extends({}, state, { questionsList: { questions: [], error: null, loading: true } });
    case _questions.FETCH_QUESTIONS_SUCCESS:
      // return list of questions and make loading = false
      return _extends({}, state, { questionsList: { questions: action.payload.data, error: null, loading: false } });
    case _questions.FETCH_QUESTIONS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { questionsList: { questions: [], error: error, loading: false } });
    case _questions.RESET_QUESTIONS:
      // reset questionList to initial state
      return _extends({}, state, { questionsList: { questions: [], error: null, loading: false } });

    case _questions.SAVE_OQUESTIONS:
      // start fetching questions and set loading = true
      return _extends({}, state, { questionsList: { questions: [], error: null, loading: true } });
    case _questions.SAVE_OQUESTIONS_SUCCESS:
      // return list of questions and make loading = false
      return _extends({}, state, { questionsList: { questions: action.payload.data, error: null, loading: false } });
    case _questions.SAVE_OQUESTIONS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { questionsList: { questions: [], error: error, loading: false } });
    case _questions.RESET_SAVE_OQUESTIONS:
      // reset questionList to initial state
      return _extends({}, state, { questionsList: { questions: [], error: null, loading: false } });

    case _questions.FETCH_QUESTION:
      return _extends({}, state, { activeQuestion: _extends({}, state.activeQuestion, { loading: true }) });
    case _questions.FETCH_QUESTION_SUCCESS:
      return _extends({}, state, { activeQuestion: { question: action.payload.data, error: null, loading: false } });
    case _questions.FETCH_QUESTION_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { activeQuestion: { question: null, error: error, loading: false } });
    case _questions.RESET_ACTIVE_QUESTION:
      return _extends({}, state, { activeQuestion: { question: null, error: null, loading: false } });

    case _questions.CREATE_QUESTION:
      return _extends({}, state, { newQuestion: _extends({}, state.newQuestion, { loading: true }) });
    case _questions.CREATE_QUESTION_SUCCESS:
      return _extends({}, state, { newQuestion: { question: action.payload.data, error: null, loading: false } });
    case _questions.CREATE_QUESTION_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { newQuestion: { question: null, error: error, loading: false } });
    case _questions.RESET_NEW_QUESTION:
      return _extends({}, state, { newQuestion: { question: null, error: null, loading: false } });

    case _questions.UPDATE_QUESTIONCAM:
      return _extends({}, state, { newQuestion: _extends({}, state.newQuestion, { error: null, loading: true }) });
    case _questions.UPDATE_QUESTIONCAM_SUCCESS:
      return _extends({}, state, { newQuestion: { question: action.payload.data, error: null, loading: false } });
    case _questions.UPDATE_QUESTIONCAM_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { newQuestion: { question: null, error: error, loading: false } });

    case _questions.DELETE_QUESTION:
      return _extends({}, state, { deletedQuestion: _extends({}, state.deletedQuestion, { loading: true }) });
    case _questions.DELETE_QUESTION_SUCCESS:
      return _extends({}, state, { deletedQuestion: { question: action.payload.data, error: null, loading: false } });
    case _questions.DELETE_QUESTION_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { deletedQuestion: { question: null, error: error, loading: false } });
    case _questions.RESET_DELETED_QUESTION:
      return _extends({}, state, { deletedQuestion: { question: null, error: null, loading: false } });

    case _questions.VALIDATE_QUESTION_FIELDS:
      return _extends({}, state, { newQuestion: _extends({}, state.newQuestion, { error: null, loading: true }) });
    case _questions.VALIDATE_QUESTION_FIELDS_SUCCESS:
      return _extends({}, state, { newQuestion: _extends({}, state.newQuestion, { error: null, loading: false }) });
    case _questions.VALIDATE_QUESTION_FIELDS_FAILURE:
      var result = action.payload.data;
      if (!result) {
        error = { message: action.payload.message };
      } else {
        error = { title: result.title, categories: result.categories, description: result.description };
      }
      return _extends({}, state, { newQuestion: _extends({}, state.newQuestion, { error: error, loading: false }) });
    case _questions.RESET_QUESTION_FIELDS:
      return _extends({}, state, { newQuestion: _extends({}, state.newQuestion, { error: null, loading: null }) });
    default:
      return state;
  }
};

var _questions = require("../actions/questions");

var baseQuestion = {
  title: "",
  description: "",
  qtype: "multi",
  answer1: "",
  fraction1: "0.0",
  feedback1: "",
  answer2: "",
  fraction2: "0.0",
  feedback2: "",
  answer3: "",
  fraction3: "0.0",
  feedback3: "",
  answer4: "",
  fraction4: "0.0",
  feedback4: "",
  answer5: "",
  fraction5: "0.0",
  feedback5: ""
};

var INITIAL_STATE = { questionsList: { questions: [], error: null, loading: false },
  newQuestion: { question: baseQuestion, error: null, loading: false },
  activeQuestion: { question: null, error: null, loading: false },
  deletedQuestion: { question: null, error: null, loading: false }
};

},{"../actions/questions":363}],416:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
  var action = arguments[1];

  var error = void 0;
  switch (action.type) {

    case _threeDObjects.FETCH_THREEDOBJECTS:
      // start fetching threeDObjects and set loading = true
      return _extends({}, state, { threeDObjectsList: { threeDObjects: [], error: null, loading: true } });
    case _threeDObjects.FETCH_THREEDOBJECTS_SUCCESS:
      // return list of threeDObjects and make loading = false
      return _extends({}, state, { threeDObjectsList: { threeDObjects: action.payload.data, error: null, loading: false } });
    case _threeDObjects.FETCH_THREEDOBJECTS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { threeDObjectsList: { threeDObjects: [], error: error, loading: false } });
    default:
      return state;
  }
};

var _threeDObjects = require('../actions/threeDObjects');

var INITIAL_STATE = { threeDObjectsList: { threeDObjects: [], error: null, loading: false } };

},{"../actions/threeDObjects":364}],417:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
  var action = arguments[1];

  var error = void 0;
  switch (action.type) {

    case _views.FETCH_VIEWS:
      // start fetching views and set loading = true
      return _extends({}, state, { viewsList: { views: [], error: null, loading: true } });
    case _views.FETCH_VIEWS_SUCCESS:
      // return list of views and make loading = false
      return _extends({}, state, { viewsList: { views: action.payload.data, error: null, loading: false } });
    case _views.FETCH_VIEWS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { viewsList: { views: [], error: error, loading: false } });
    case _views.RESET_VIEWS:
      // reset viewList to initial state
      return _extends({}, state, { viewsList: { views: [], error: null, loading: false } });

    case _views.SAVE_OVIEWS:
      // start fetching views and set loading = true
      return _extends({}, state, { viewsList: { views: [], error: null, loading: true } });
    case _views.SAVE_OVIEWS_SUCCESS:
      // return list of views and make loading = false
      return _extends({}, state, { viewsList: { views: action.payload.data, error: null, loading: false } });
    case _views.SAVE_OVIEWS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { viewsList: { views: [], error: error, loading: false } });
    case _views.RESET_SAVE_OVIEWS:
      // reset viewList to initial state
      return _extends({}, state, { viewsList: { views: [], error: null, loading: false } });

    case _views.FETCH_VIEW:
      return _extends({}, state, { activeView: _extends({}, state.activeView, { loading: true }) });
    case _views.FETCH_VIEW_SUCCESS:
      return _extends({}, state, { activeView: { view: action.payload.data, error: null, loading: false } });
    case _views.FETCH_VIEW_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { activeView: { view: null, error: error, loading: false } });
    case _views.RESET_ACTIVE_VIEW:
      return _extends({}, state, { activeView: { view: null, error: null, loading: false } });

    case _views.CREATE_VIEW:
      return _extends({}, state, { newView: _extends({}, state.newView, { loading: true }) });
    case _views.CREATE_VIEW_SUCCESS:
      return _extends({}, state, { newView: { view: action.payload.data, error: null, loading: false } });
    case _views.CREATE_VIEW_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { newView: { view: null, error: error, loading: false } });
    case _views.RESET_NEW_VIEW:
      return _extends({}, state, { newView: { view: null, error: null, loading: false } });

    case _views.UPDATE_VIEWCAM:
      return _extends({}, state, { newView: _extends({}, state.newView, { error: null, loading: true }) });
    case _views.UPDATE_VIEWCAM_SUCCESS:
      return _extends({}, state, { newView: { view: action.payload.data, error: null, loading: false } });
    case _views.UPDATE_VIEWCAM_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { newView: { view: null, error: error, loading: false } });

    case _views.DELETE_VIEW:
      return _extends({}, state, { deletedView: _extends({}, state.deletedView, { loading: true }) });
    case _views.DELETE_VIEW_SUCCESS:
      return _extends({}, state, { deletedView: { view: action.payload.data, error: null, loading: false } });
    case _views.DELETE_VIEW_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { deletedView: { view: null, error: error, loading: false } });
    case _views.RESET_DELETED_VIEW:
      return _extends({}, state, { deletedView: { view: null, error: null, loading: false } });

    case _views.VALIDATE_VIEW_FIELDS:
      return _extends({}, state, { newView: _extends({}, state.newView, { error: null, loading: true }) });
    case _views.VALIDATE_VIEW_FIELDS_SUCCESS:
      return _extends({}, state, { newView: _extends({}, state.newView, { error: null, loading: false }) });
    case _views.VALIDATE_VIEW_FIELDS_FAILURE:
      var result = action.payload.data;
      if (!result) {
        error = { message: action.payload.message };
      } else {
        error = { title: result.title, categories: result.categories, description: result.description };
      }
      return _extends({}, state, { newView: _extends({}, state.newView, { error: error, loading: false }) });
    case _views.RESET_VIEW_FIELDS:
      return _extends({}, state, { newView: _extends({}, state.newView, { error: null, loading: null }) });
    default:
      return state;
  }
};

var _views = require("../actions/views");

var baseView = {
  title: "",
  name: "",
  keyCode: 0,
  cameraPosition: { x: 0, y: 0, z: 0 },
  targetPosition: { x: 0, y: 0, z: 0 }
};

var INITIAL_STATE = { viewsList: { views: [], error: null, loading: false },
  newView: { view: baseView, error: null, loading: false },
  activeView: { view: null, error: null, loading: false },
  deletedView: { view: null, error: null, loading: false }
};

},{"../actions/views":365}],418:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
  var action = arguments[1];

  var error = void 0;
  switch (action.type) {

    case _viewsSets.FETCH_VIEWSSETS:
      // start fetching viewsSets and set loading = true
      return _extends({}, state, { viewsSetsList: { viewsSets: [], error: null, loading: true } });
    case _viewsSets.FETCH_VIEWSSETS_SUCCESS:
      // return list of viewsSets and make loading = false
      return _extends({}, state, { viewsSetsList: { viewsSets: action.payload.data, error: null, loading: false } });
    case _viewsSets.FETCH_VIEWSSETS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { viewsSetsList: { viewsSets: [], error: error, loading: false } });
    case _viewsSets.RESET_VIEWSSETS:
      // reset viewsSetList to initial state
      return _extends({}, state, { viewsSetsList: { viewsSets: [], error: null, loading: false } });

    case _viewsSets.SAVE_OVIEWSSETS:
      // start fetching viewsSets and set loading = true
      return _extends({}, state, { viewsSetsList: { viewsSets: [], error: null, loading: true } });
    case _viewsSets.SAVE_OVIEWSSETS_SUCCESS:
      // return list of viewsSets and make loading = false
      return _extends({}, state, { viewsSetsList: { viewsSets: action.payload.data, error: null, loading: false } });
    case _viewsSets.SAVE_OVIEWSSETS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { viewsSetsList: { viewsSets: [], error: error, loading: false } });
    case _viewsSets.RESET_SAVE_OVIEWSSETS:
      // reset viewsSetList to initial state
      return _extends({}, state, { viewsSetsList: { viewsSets: [], error: null, loading: false } });

    case _viewsSets.FETCH_VIEWSSET:
      return _extends({}, state, { activeViewsSet: _extends({}, state.activeViewsSet, { loading: true }) });
    case _viewsSets.FETCH_VIEWSSET_SUCCESS:
      return _extends({}, state, { activeViewsSet: { viewsSet: action.payload.data, error: null, loading: false } });
    case _viewsSets.FETCH_VIEWSSET_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { activeViewsSet: { viewsSet: null, error: error, loading: false } });
    case _viewsSets.RESET_ACTIVE_VIEWSSET:
      return _extends({}, state, { activeViewsSet: { viewsSet: null, error: null, loading: false } });

    case _viewsSets.CREATE_VIEWSSET:
      return _extends({}, state, { newViewsSet: _extends({}, state.newViewsSet, { loading: true }) });
    case _viewsSets.CREATE_VIEWSSET_SUCCESS:
      return _extends({}, state, { newViewsSet: { viewsSet: action.payload.data, error: null, loading: false } });
    case _viewsSets.CREATE_VIEWSSET_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { newViewsSet: { viewsSet: null, error: error, loading: false } });
    case _viewsSets.RESET_NEW_VIEWSSET:
      return _extends({}, state, { newViewsSet: { viewsSet: null, error: null, loading: false } });

    case _viewsSets.DELETE_VIEWSSET:
      return _extends({}, state, { deletedViewsSet: _extends({}, state.deletedViewsSet, { loading: true }) });
    case _viewsSets.DELETE_VIEWSSET_SUCCESS:
      return _extends({}, state, { deletedViewsSet: { viewsSet: action.payload.data, error: null, loading: false } });
    case _viewsSets.DELETE_VIEWSSET_FAILURE:
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { deletedViewsSet: { viewsSet: null, error: error, loading: false } });
    case _viewsSets.RESET_DELETED_VIEWSSET:
      return _extends({}, state, { deletedViewsSet: { viewsSet: null, error: null, loading: false } });

    case _viewsSets.VALIDATE_VIEWSSET_FIELDS:
      return _extends({}, state, { newViewsSet: _extends({}, state.newViewsSet, { error: null, loading: true }) });
    case _viewsSets.VALIDATE_VIEWSSET_FIELDS_SUCCESS:
      return _extends({}, state, { newViewsSet: _extends({}, state.newViewsSet, { error: null, loading: false }) });
    case _viewsSets.VALIDATE_VIEWSSET_FIELDS_FAILURE:
      var result = action.payload.data;
      if (!result) {
        error = { message: action.payload.message };
      } else {
        error = { title: result.title, categories: result.categories, description: result.description };
      }
      return _extends({}, state, { newViewsSet: _extends({}, state.newViewsSet, { error: error, loading: false }) });
    case _viewsSets.RESET_VIEWSSET_FIELDS:
      return _extends({}, state, { newViewsSet: _extends({}, state.newViewsSet, { error: null, loading: null }) });
    default:
      return state;
  }
};

var _viewsSets = require("../actions/viewsSets");

var baseViewsSet = {
  title: "",
  name: ""
};

var INITIAL_STATE = { viewsSetsList: { viewsSets: [], error: null, loading: false },
  newViewsSet: { viewsSet: baseViewsSet, error: null, loading: false },
  activeViewsSet: { viewsSet: null, error: null, loading: false },
  deletedViewsSet: { viewsSet: null, error: null, loading: false }
};

},{"../actions/viewsSets":366}],419:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? INITIAL_STATE : arguments[0];
  var action = arguments[1];

  var error = void 0;
  switch (action.type) {
    case _welcome.FETCH_CAMPOS:
      // start fetching views and set loading = true
      return _extends({}, state, { camPos: { data: [], error: null, loading: true } });
    case _welcome.FETCH_CAMPOS_SUCCESS:
      // return list of views and make loading = false
      return _extends({}, state, { camPos: { data: action.payload, error: null, loading: false } });
    case _welcome.FETCH_CAMPOS_FAILURE:
      // return error and make loading = false
      error = action.payload.data || { message: action.payload.message }; //2nd one is network or server down errors
      return _extends({}, state, { camPos: { data: [], error: error, loading: false } });

    default:
      return state;
  }
};

var _welcome = require('../actions/welcome');

var INITIAL_STATE = { camPos: { data: [], error: null, loading: false } };

},{"../actions/welcome":367}],420:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _App = require('./pages/App');

var _App2 = _interopRequireDefault(_App);

var _WelcomeIndex = require('./pages/WelcomeIndex');

var _WelcomeIndex2 = _interopRequireDefault(_WelcomeIndex);

var _ViewsSetsIndex = require('./pages/ViewsSetsIndex');

var _ViewsSetsIndex2 = _interopRequireDefault(_ViewsSetsIndex);

var _ViewsSetsNew = require('./pages/ViewsSetsNew');

var _ViewsSetsNew2 = _interopRequireDefault(_ViewsSetsNew);

var _ViewsSetsEdit = require('./pages/ViewsSetsEdit');

var _ViewsSetsEdit2 = _interopRequireDefault(_ViewsSetsEdit);

var _ViewsIndex = require('./pages/ViewsIndex');

var _ViewsIndex2 = _interopRequireDefault(_ViewsIndex);

var _ViewsNew = require('./pages/ViewsNew');

var _ViewsNew2 = _interopRequireDefault(_ViewsNew);

var _ViewsEdit = require('./pages/ViewsEdit');

var _ViewsEdit2 = _interopRequireDefault(_ViewsEdit);

var _InfowinsIndex = require('./pages/InfowinsIndex');

var _InfowinsIndex2 = _interopRequireDefault(_InfowinsIndex);

var _InfowinsNew = require('./pages/InfowinsNew');

var _InfowinsNew2 = _interopRequireDefault(_InfowinsNew);

var _QuestionNew = require('./pages/QuestionNew');

var _QuestionNew2 = _interopRequireDefault(_QuestionNew);

var _InfowinsEdit = require('./pages/InfowinsEdit');

var _InfowinsEdit2 = _interopRequireDefault(_InfowinsEdit);

var _QuestionEdit = require('./pages/QuestionEdit');

var _QuestionEdit2 = _interopRequireDefault(_QuestionEdit);

var _MarkersEdit = require('./pages/MarkersEdit');

var _MarkersEdit2 = _interopRequireDefault(_MarkersEdit);

var _MarkersNew = require('./pages/MarkersNew');

var _MarkersNew2 = _interopRequireDefault(_MarkersNew);

var _GearmapIndex = require('./pages/GearmapIndex');

var _GearmapIndex2 = _interopRequireDefault(_GearmapIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createElement(
  _reactRouter.Route,
  { path: '/', component: _App2.default },
  _react2.default.createElement(_reactRouter.IndexRoute, { component: _WelcomeIndex2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'viewsSets/new', component: _ViewsSetsNew2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'viewsSets', component: _ViewsSetsIndex2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'viewsSets/:vsid', component: _ViewsSetsEdit2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'vSviews/:vsid', component: _ViewsIndex2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'vSviews/:vsid/new', component: _ViewsNew2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'vSviews/:vsid/:id', component: _ViewsEdit2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'infowins', component: _InfowinsIndex2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'infowins/new/:parentType/:parentId', component: _InfowinsNew2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'questions/new/:parentType/:parentId', component: _QuestionNew2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'infowins/:parentType/:parentId/:id', component: _InfowinsEdit2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'questions/:parentType/:parentId/:id', component: _QuestionEdit2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'markers/new/:parentId', component: _MarkersNew2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'markers/:parentId/:id', component: _MarkersEdit2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: 'gearmap', component: _GearmapIndex2.default })
);

},{"./pages/App":395,"./pages/GearmapIndex":396,"./pages/InfowinsEdit":397,"./pages/InfowinsIndex":398,"./pages/InfowinsNew":399,"./pages/MarkersEdit":400,"./pages/MarkersNew":401,"./pages/QuestionEdit":402,"./pages/QuestionNew":403,"./pages/ViewsEdit":404,"./pages/ViewsIndex":405,"./pages/ViewsNew":406,"./pages/ViewsSetsEdit":407,"./pages/ViewsSetsIndex":408,"./pages/ViewsSetsNew":409,"./pages/WelcomeIndex":410,"react":"react","react-router":"react-router"}],421:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureStore;

var _redux = require('redux');

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _reduxPromise = require('redux-promise');

var _reduxPromise2 = _interopRequireDefault(_reduxPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Middleware you want to use in production:
var enhancer = (0, _redux.applyMiddleware)(_reduxPromise2.default);

function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  return (0, _redux.createStore)(_reducers2.default, initialState, enhancer);
};

},{"../reducers":411,"redux":"redux","redux-promise":"redux-promise"}],422:[function(require,module,exports){
(function (process){
'use strict';

if (process.env.NODE_ENV === 'production' || location && location.hostname !== 'localhost') {
  module.exports = require('./configureStore.prod');
} else {
  module.exports = require('./configureStore.dev');
}

}).call(this,require('_process'))
},{"./configureStore.dev":421,"./configureStore.prod":423,"_process":7}],423:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureStore;

var _redux = require('redux');

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _reduxPromise = require('redux-promise');

var _reduxPromise2 = _interopRequireDefault(_reduxPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Middleware you want to use in production:
var enhancer = (0, _redux.applyMiddleware)(_reduxPromise2.default);

function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  return (0, _redux.createStore)(_reducers2.default, initialState, enhancer);
};

},{"../reducers":411,"redux":"redux","redux-promise":"redux-promise"}],424:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var validateInfowin = exports.validateInfowin = function validateInfowin(values, dispatch) {
    var errors = { cameraPosition: {}, targetPosition: {} };
    if (!values) {
        return errors;
    }

    if (!values.title || values.title.trim() === '') {
        errors.title = 'Enter a Title';
    }

    if (!values.name || values.name.trim() === '') {
        errors.name = 'Enter an Id (a name)';
    }

    return errors;
};

//For instant async server validation
var asyncValidate = exports.asyncValidate = function asyncValidate(values, dispatch) {

    return new Promise(function (resolve, reject) {

        dispatch(validateInfowinFields(values)).then(function (response) {
            var data = response.payload.data;
            //if status is not 200 or any one of the fields exist, then there is a field error
            if (response.payload.status != 200 || data.title || data.description) {
                //let other components know of error by updating the redux` state
                dispatch(validateInfowinFieldsFailure(response.payload));
                reject(data); //this is for redux-form itself
            } else {
                //let other components know that everything is fine by updating the redux` state
                dispatch(validateInfowinFieldsSuccess(response.payload)); //ps: this is same as dispatching RESET_POST_FIELDS
                resolve(); //this is for redux-form itself
            }
        });
    });
};

},{}],425:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var validateMarker = exports.validateMarker = function validateMarker(values, dispatch) {
    var errors = { position: {} };
    if (!values) {
        return errors;
    }

    if (!values.title || values.title.trim() === '') {
        errors.title = 'Enter a Title';
    }

    return errors;
};

//For instant async server validation
var asyncValidate = exports.asyncValidate = function asyncValidate(values, dispatch) {

    return new Promise(function (resolve, reject) {

        dispatch(validateInfowinFields(values)).then(function (response) {
            var data = response.payload.data;
            //if status is not 200 or any one of the fields exist, then there is a field error
            if (response.payload.status != 200 || data.title || data.description) {
                //let other components know of error by updating the redux` state
                dispatch(validateInfowinFieldsFailure(response.payload));
                reject(data); //this is for redux-form itself
            } else {
                //let other components know that everything is fine by updating the redux` state
                dispatch(validateInfowinFieldsSuccess(response.payload)); //ps: this is same as dispatching RESET_POST_FIELDS
                resolve(); //this is for redux-form itself
            }
        });
    });
};

},{}],426:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var validateQuestion = exports.validateQuestion = function validateQuestion(values, dispatch) {
    var errors = { cameraPosition: {}, targetPosition: {} };
    console.log(values);
    if (!values) {
        return errors;
    }

    if (!values.title || values.title.trim() === '') {
        errors.title = 'Enter a Title';
    }

    if (!values.description || values.description.trim() === '') {
        errors.description = 'Enter an Description (a description)';
    }

    if (!values.qtype) {
        errors.qtype = 'Select the Question Type (a Question Type)';
    }

    var cnt = 0;
    var sumGrade = 0;

    if (!values.answer1 || values.answer1.trim() == '') {
        cnt++;
        errors.answer1 = 'This type of question requires at least 2 choices (a answer 1)';
    }

    if (!values.answer2 || values.answer2.trim() == '') {
        cnt++;
        errors.answer2 = 'This type of question requires at least 2 choices (a answer 2)';
    }

    if (!values.answer3 || values.answer3.trim() == '') {
        cnt++;
        errors.answer3 = 'This type of question requires at least 2 choices (a answer 3)';
    }

    if (!values.answer4 || values.answer4.trim() == '') {
        cnt++;
        errors.answer4 = 'This type of question requires at least 2 choices (a answer 4)';
    }

    if (!values.answer5 || values.answer5.trim() == '') {
        cnt++;
        errors.answer5 = 'This type of question requires at least 2 choices (a answer 5';
    }

    if (cnt <= 3) {
        errors.answer1 = '';
        errors.answer2 = '';
        errors.answer3 = '';
        errors.answer4 = '';
        errors.answer5 = '';
    }

    if (values.fraction1 && values.fraction1 != '') {
        sumGrade += Number(values.fraction1);
    }

    if (values.fraction2 && values.fraction2 != '') {
        sumGrade += Number(values.fraction2);
    }

    if (values.fraction3 && values.fraction3 != '') {
        sumGrade += Number(values.fraction3);
    }

    if (values.fraction4 && values.fraction4 != '') {
        sumGrade += Number(values.fraction4);
    }

    if (values.fraction5 && values.fraction5 != '') {
        sumGrade += Number(values.fraction5);
    }

    if (isNaN(sumGrade)) {
        if (!values.qtype) {
            errors.qtype = 'Select the Question Type (a Question Type)';
        } else {
            if (values.qtype == "multi") {
                errors.fraction1 = 'One of the choices should be 100%, so that it is possible to get a full grade for this question.';
            } else {
                errors.fraction1 = 'One of the choices should be 100%, so that it is possible to get a full grade for this question.';
            }
        }
    } else {
        var totalGrade = 0;
        totalGrade = sumGrade * 100;

        if (values.qtype == "multi") {
            if (totalGrade > 100) {
                errors.fraction1 = 'The positive grades you have chosen do not add up to 100% Instead, they add up to ' + sumGrade + '%';
            } else if (totalGrade < 100) {
                errors.fraction1 = 'The positive grades you have chosen do not add up to 100% Instead, they add up to ' + sumGrade + '%';
            } else if (sumGrade == 0) {
                errors.fraction1 = 'One of the choices should be 100%, so that it is possible to get a full grade for this question.';
            } else {
                if ((!values.answer1 || values.answer1.trim() == '') && Number(values.fraction1) > 0) {
                    errors.fraction1 = 'Grade set, but the Answer is blank';
                }
                if ((!values.answer2 || values.answer2.trim() == '') && Number(values.fraction2) > 0) {
                    errors.fraction2 = 'Grade set, but the Answer is blank';
                }
                if ((!values.answer3 || values.answer3.trim() == '') && Number(values.fraction3) > 0) {
                    errors.fraction3 = 'Grade set, but the Answer is blank';
                }
                if ((!values.answer4 || values.answer4.trim() == '') && Number(values.fraction4) > 0) {
                    errors.fraction4 = 'Grade set, but the Answer is blank';
                }
                if ((!values.answer5 || values.answer5.trim() == '') && Number(values.fraction5) > 0) {
                    errors.fraction5 = 'Grade set, but the Answer is blank';
                }
            }
        } else {

            if (values.franction1 && Number(values.fraction1) < 1 && values.franction2 && Number(values.fraction2) < 1 && values.franction3 && Number(values.fraction3) < 1 && values.franction4 && Number(values.fraction4) < 1 && values.franction5 && Number(values.fraction5) < 1) {

                errors.fraction1 = 'One of the choices should be 100%, so that it is possible to get a full grade for this question.';
            } else if (!values.fraction1 && !values.fraction2 && !values.fraction3 && !values.fraction4 && !values.fraction5) {

                errors.fraction1 = 'One of the choices should be 100%, so that it is possible to get a full grade for this question.';
            } else {

                if ((!values.answer1 || values.answer1.trim() == '') && values.fraction1 && Number(values.fraction1) > 0) {
                    errors.fraction1 = 'Grade set, but the Answer is blank';
                }
                if ((!values.answer2 || values.answer2.trim() == '') && values.fraction2 && Number(values.fraction2) > 0) {
                    errors.fraction2 = 'Grade set, but the Answer is blank';
                }
                if ((!values.answer3 || values.answer3.trim() == '') && values.fraction3 && Number(values.fraction3) > 0) {
                    errors.fraction3 = 'Grade set, but the Answer is blank';
                }
                if ((!values.answer4 || values.answer4.trim() == '') && values.fraction4 && Number(values.fraction4) > 0) {
                    errors.fraction4 = 'Grade set, but the Answer is blank';
                }
                if ((!values.answer5 || values.answer5.trim() == '') && values.fraction5 && Number(values.fraction5) > 0) {
                    errors.fraction5 = 'Grade set, but the Answer is blank';
                }
            }
        }

        if (values.feedback1 && values.feedback1.trim() != '' && (!values.answer1 || values.answer1.trim() == '')) values.feedback1 = '';
        if (values.feedback2 && values.feedback2.trim() != '' && (!values.answer2 || values.answer2.trim() == '')) values.feedback2 = '';
        if (values.feedback3 && values.feedback3.trim() != '' && (!values.answer3 || values.answer3.trim() == '')) values.feedback3 = '';
        if (values.feedback4 && values.feedback4.trim() != '' && (!values.answer4 || values.answer4.trim() == '')) values.feedback4 = '';
        if (values.feedback5 && values.feedback5.trim() != '' && (!values.answer5 || values.answer5.trim() == '')) values.feedback5 = '';
    }

    return errors;
};

//For instant async server validation
var asyncValidate = exports.asyncValidate = function asyncValidate(values, dispatch) {
    return new Promise(function (resolve, reject) {

        dispatch(validateQuestionFields(values)).then(function (response) {
            var data = response.payload.data;
            //if status is not 200 or any one of the fields exist, then there is a field error
            if (response.payload.status != 200 || data.title || data.description) {
                //let other components know of error by updating the redux` state
                dispatch(validateQuestionFieldsFailure(response.payload));
                reject(data); //this is for redux-form itself
            } else {
                //let other components know that everything is fine by updating the redux` state
                dispatch(validateQuestionFieldsSuccess(response.payload)); //ps: this is same as dispatching RESET_POST_FIELDS
                resolve(); //this is for redux-form itself
            }
        });
    });
};

},{}],427:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var validateView = exports.validateView = function validateView(values, dispatch) {
    var errors = { cameraPosition: {}, targetPosition: {} };
    if (!values) {
        return errors;
    }

    if (!values.title || values.title.trim() === '') {
        errors.title = 'Enter a Title';
    }

    if (values.cameraPosition) {
        if (values.cameraPosition.x !== undefined && (!values.cameraPosition.x || isNaN(values.cameraPosition.x))) {
            errors.cameraPosition.x = 'Enter some value';
        }
        if (values.cameraPosition.y !== undefined && (!values.cameraPosition.y || isNaN(values.cameraPosition.y))) {
            errors.cameraPosition.y = 'Enter some value';
        }
        if (values.cameraPosition.z !== undefined && (!values.cameraPosition.z || isNaN(values.cameraPosition.z))) {
            errors.cameraPosition.z = 'Enter some value';
        }
    }

    if (values.targetPosition) {
        if (values.targetPosition.x !== undefined && (!values.targetPosition.x || isNaN(values.targetPosition.x))) {
            errors.targetPosition.x = 'Enter some value';
        }
        if (values.targetPosition.y !== undefined && (!values.targetPosition.y || isNaN(values.targetPosition.y))) {
            errors.targetPosition.y = 'Enter some value';
        }
        if (values.targetPosition.z !== undefined && (!values.targetPosition.z || isNaN(values.targetPosition.z))) {
            errors.targetPosition.z = 'Enter some value';
        }
    }
    return errors;
};

//For instant async server validation
var asyncValidate = exports.asyncValidate = function asyncValidate(values, dispatch) {

    return new Promise(function (resolve, reject) {

        dispatch(validateViewFields(values)).then(function (response) {
            var data = response.payload.data;
            //if status is not 200 or any one of the fields exist, then there is a field error
            if (response.payload.status != 200 || data.title || data.description) {
                //let other components know of error by updating the redux` state
                dispatch(validateViewFieldsFailure(response.payload));
                reject(data); //this is for redux-form itself
            } else {
                //let other components know that everything is fine by updating the redux` state
                dispatch(validateViewFieldsSuccess(response.payload)); //ps: this is same as dispatching RESET_POST_FIELDS
                resolve(); //this is for redux-form itself
            }
        });
    });
};

var populateObjectsLeft = exports.populateObjectsLeft = function populateObjectsLeft(gearMap) {
    var ls = gearMap,
        ob = void 0,
        key = void 0,
        gearMapped = [],
        uniqueList = {};
    if (ls) {
        for (key in ls) {
            if (key && !uniqueList[key]) {
                gearMapped.push(key);
                uniqueList[key] = true;
            }
        }
    }
    return gearMapped.sort();
};

var populateObjectsRight = exports.populateObjectsRight = function populateObjectsRight(gearMap) {
    var ls = gearMap,
        ob = void 0,
        key = void 0,
        gearMapped = [],
        uniqueList = {};
    if (ls) {
        for (key in ls) {
            if (key && ls[key] && !uniqueList[ls[key]]) {
                gearMapped.push(ls[key]);
                uniqueList[ls[key]] = true;
            }
        }
    }
    return gearMapped.sort();
};

},{}],428:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var validateViewsSet = exports.validateViewsSet = function validateViewsSet(values, dispatch) {
    var errors = {};
    if (!values) {
        return errors;
    }

    if (!values.title || values.title.trim() === '') {
        errors.title = 'Enter a Title';
    }

    return errors;
};

//For instant async server validation
var asyncValidate = exports.asyncValidate = function asyncValidate(values, dispatch) {

    return new Promise(function (resolve, reject) {

        dispatch(validateViewFields(values)).then(function (response) {
            var data = response.payload.data;
            //if status is not 200 or any one of the fields exist, then there is a field error
            if (response.payload.status != 200 || data.title || data.description) {
                //let other components know of error by updating the redux` state
                dispatch(validateViewFieldsFailure(response.payload));
                reject(data); //this is for redux-form itself
            } else {
                //let other components know that everything is fine by updating the redux` state
                dispatch(validateViewFieldsSuccess(response.payload)); //ps: this is same as dispatching RESET_POST_FIELDS
                resolve(); //this is for redux-form itself
            }
        });
    });
};

},{}]},{},[394]);
