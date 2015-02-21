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
