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
