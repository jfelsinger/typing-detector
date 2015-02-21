'use strict';
/* jslint browser:true */

var lib = require('../lib'),
    Emitter = require('./emitter');

function TypeDetector(selector) {
    Emitter.call(this);

    this.isDetecting = false;
    this.isTyping = false;

    this.timeout = 1000 * 5; // Time for when typing ends
    this.handle = null;
    this.el = document.querySelectorAll(selector);

}

lib.extend(TypeDetector, Emitter);

TypeDetector.prototype.start = 
function() {
    this.el.addEventListener('keydown', this.detect);
};


TypeDetector.prototype.stop = 
function() {
    this.el.removeEventListener('keydown', this.detect);
};


/**
 * Runs when typing is detected
 */
TypeDetector.prototype.detect = function() {
    this.fire('typing-detected');

    if (this.isTyping) {
        // Clear the timer if the user is still typing
        clearTimeout(this.handle);
    } else {
        // Fire typing started event if they just started again
        this.fire('typing-started');
        this.isTyping = true;
    }

    // Reset the timeout
    this.handle = setTimeout(function() {
        // Time passes, user isn't still typing. Fire stopped event
        this.fire('typing-stopped');
        this.isTyping = false;
    }.bind(this), this.timeout);
};

module.exports = exports = TypeDetector;
