(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * public void extend([Object] child, [Object] parent, [Bool] extendConstructor)
 *
 * Extend an object
 */
module.exports = function extend(Child, Parent, extendConstructor) {
    var constructor = Child;

    // TODO: work this part out later
    if (false && extendConstructor) {
        constructor = function() {

        }
    }

    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = constructor;
}

},{}],2:[function(require,module,exports){
'use strict';

var extend = require('../lib/extend'),
    Emitter = require('./emitter');

/**
 * Detector
 *
 * Detects when an event starts and finishes
 */
function Detector(name, timeout, preDetectionCount) {
    Emitter.call(this);

    this.isDetecting = false;
    this.preDetectionCount = preDetectionCount || 0;
    this.timeout = timeout || 1000 * 5; // Time for when detection has timed out

    this._count = 0;
    this._action = name || 'action';
    this._handle = null;
}

extend(Detector, Emitter);


/**
 * Indicates that an action has been or is being performed. Ran on each
 * instance of an action.
 */
Detector.prototype.detect = function() {
    this.fire(this._action + '-detected');
    this._count++;

    if (this._handle)
        clearTimeout(this._handle);

    // If the count is higher than the detection count, we're safe to say
    // that the event has started
    if (this._count >= this.preDetectionCount) {

        if (!this.isDetecting) {
            // Fire event if action just started again
            this.fire(this._action + '-started');
            this.isDetecting = true;
        }

        // Reset the timeout
        this._handle = setTimeout(function() {
            this.fire(this._action + '-stopped');
            this.isTyping = false;
            this._count = 0;
            this.fire('count-reset');
        }.bind(this), this.timeout);

    } else {

        // Create a timeout to reset the counter if an action hasn't been
        // detected enough times within in the timeout limit.
        this._handle = setTimeout(function() {
            this._count = 0;
            this.fire('count-reset');
        }.bind(this), this.timeout);

    }

    return this;
};

module.exports = exports = Detector;

},{"../lib/extend":1,"./emitter":3}],3:[function(require,module,exports){
'use strict';

/**
 * Emitter
 *
 * Object that can be extended off of to give an object the ability to listen
 * for and emmit events
 */
var Emitter = function() {
    this.__events = {};
};


/**
 * public Object on([string] eventName, [Func] cb)
 *
 * Register an event listener to fire on a particular event
 */
Emitter.prototype.on = 
Emitter.prototype.onEvent = 
Emitter.prototype.addEventListener = 
function(eventName, cb) {
    if (!this.__events[eventName]) this.__events[eventName] = [];
    this.__events[eventName].push(cb);

    return this;
};


/**
 * public Object fire([string] eventName, [Func] cb)
 *
 * Register an event listener to fire on a particular event
 */
Emitter.prototype.fire = 
Emitter.prototype.fireEvent = 
Emitter.prototype.emit = 
Emitter.prototype.emitEvent = 
function(eventName, data) {
    if (this.__events[eventName]) 
        for(var key in this.__events[eventName])
            this.__events[eventName][key](this, data);

    return this;
};

module.exports = Emitter;

},{}],4:[function(require,module,exports){
/* jslint browser:true */

(function (root, factory) {

    'use strict';

    root.TypingDetector = factory();

}(window, function() {

    'use strict';

    return require('./typing-detector');

}));

},{"./typing-detector":5}],5:[function(require,module,exports){
'use strict';
/* jslint browser:true */

var extend = require('../lib/extend'),
    Detector = require('./detector');

function TypeDetector(options) {
    // Make sure that the options is an object
    if (typeof options !== 'object')
        options = {
            selector: options
        };

    // Default selector to the body element
    options.selector = options.selector || 'body';

    Detector.call(this, 'typing', options.timeout, options.wait);

    // If the selector is a string assume that it is indeed a selector
    if (typeof options.selector === 'string')
        this.el = document.querySelectorAll(options.selector);

    // If the selector is an object assume that it is an actual element
    else if (typeof options.selector === 'object')
        this.el = options.selector;

    else
        throw new Error('Invalid selector supplied: ' + options.selector);
}

extend(TypeDetector, Detector);

// Alias the `isDetecting` property as `isTyping`
Object.defineProperty(TypeDetector.prototype, 'isTyping', {
    get: function() { return this.isDetecting; },
    set: function(val) { this.isDetecting = val; },
    enumerable: true
});


/**
 * Start detecting a user's typing
 */
TypeDetector.prototype.start = 
TypeDetector.prototype.startDetecting = 
function() {
    if (this.el.length)
        for (var i = 0; i < this.el.length; i++)
            this.el[i].addEventListener('keydown', this.detect.bind(this));

    else
        this.el.addEventListener('keydown', this.detect.bind(this));

    return this;
};


/**
 * Stop detecting a user's typing
 */
TypeDetector.prototype.stop = 
TypeDetector.prototype.stopDetecting = 
function() {
    if (this.el.length)
        for (var i = 0; i < this.el.length; i++)
            this.el[i].removeEventListener('keydown', this.detect.bind(this));

    else
        this.el.removeEventListener('keydown', this.detect.bind(this));

    return this;
};


module.exports = exports = TypeDetector;

},{"../lib/extend":1,"./detector":2}]},{},[4])