Typing Detector [![Build Status](https://secure.travis-ci.org/jfelsinger/typing-detector.png?branch=master)](https://travis-ci.org/jfelsinger/typing-detector) [![Analytics](https://ga-beacon.appspot.com/UA-46797352-2/typing-detector/index)](https://github.com/igrigorik/ga-beacon)
===============

Detect when typing is happening.

## Installation

include it on your page
```
<script src="dist/measurement.min.js" type="text/javascript"></script>
```

or use browserify and npm

```
npm install typing-detector
```
```
TypingDetector = require('typing-detector');
```

## Basic Usage

To start initialize a new typing detector, and hook on to the events you want.

```
var TypingDetector = require('typing-detector');
var typingDetector = new TypingDetector({ selector: 'body' });

typingDetector
  .on('typing-started', function() {
    console.log('User started typing');
  })
  .on('typing-stopped', function() {
    console.log('User stopped typing');
  });
```

### Options

* `selector`: (default:'body') The selector or element html element that you want to detect typing on.
* `timeout`: (default:5000) The time in milliseconds to wait before deciding that a user has stopped typing.

### Events

* `typing-started`: Fires when a user has started typing
* `typing-stopped`: Fires when a user has stopped typing
