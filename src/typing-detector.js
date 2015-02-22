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
