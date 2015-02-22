'use strict';

var Detector = require('../src/detector');

var should = require('should');

describe('Detector', function() {

    it('should construct default values', function() {
        var detector = new Detector();

        // Check for default values
        detector.isDetecting.should.be.false;
        detector.preDetectionCount.should.equal(0);
        detector.timeout.should.equal(5000);

        detector._count.should.equal(0);
        detector._action.should.equal('action');
    });

    it('should construct supplied values', function() {
        var detector = new Detector('a', 1000, 3);
        
        detector._action.should.equal('a');
        detector.timeout.should.equal(1000);
        detector.preDetectionCount.should.equal(3);

    });

    describe('#detect', function() {

        it('should fire `action-detected` event', function(done) {
            var detector = new Detector();

            detector.on('action-detected', function() {
                done();
            });

            detector.detect();
        });

        it('should fire `action-started` event', function(done) {
            var detector = new Detector();

            detector.on('action-started', function() {
                done();
            });

            detector.detect();
        });

        it('should fire `action-stopped` event', function(done) {
            var detector = new Detector('action', 500);

            detector.on('action-stopped', function() {
                done();
            });

            detector.detect();
        });

        it('should fire `count-reset` event', function(done) {
            var detector = new Detector('action', 500);

            detector.on('count-reset', function() {
                done();
            });

            detector.detect();
        });

        it('should not start action before detection count', function(done) {
            var count = 10
            var detector = new Detector('action', 500, count);
            var cb = function() { throw new Error('Failed'); };

            detector.on('action-stopped', cb);
            detector.on('action-started', cb);
            detector.on('count-reset', function() { done(); });

            for (var i = 1; i < count; i++)
                detector.detect();
        });

    });

});
