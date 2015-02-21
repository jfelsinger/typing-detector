'use strict';

var extend = require('../lib/extend'),
    Emitter = require('./emitter');

/**
 * Detector
 *
 * Detects when an event starts and finishes
 */
function Detector(name, timeout) {
    Emitter.call(this);

    this.isDetecting = false;
    this.timeout = timeout || 1000 * 5; // Time for when detection has timed out

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

    if (this.isDetecting) {
        // Clear the timer if we're still detecting an action
        clearTimeout(this._handle);
    } else {
        // Fire event if action just started again
        this.fire(this._action + '-started');
        this.isDetecting = true;
    }

    // Reset the timeout
    this._handle = setTimeout(function() {
        this.fire(this._action + '-stopped');
        this.isTyping = false;
    }.bind(this), this.timeout);

    return this;
};

module.exports = exports = Detector;
