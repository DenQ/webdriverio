/**
 *
 * Wait for an element (selected by css selector) for the provided amount of
 * milliseconds to be (dis/en)abled. If multiple elements get queryied by given
 * selector, it returns true (or false if reverse flag is set) if at least one
 * element is (dis/en)abled.
 *
 * @param {String}  selector element to wait for
 * @param {Number}  ms       time in ms
 * @param {Boolean} reverse  if true it waits for the opposite
 *
 * @uses protocol/executeAsync
 * @uses protocol/timeoutsAsyncScript
 *
 */

var async = require('async'),
    isEnabledFunc = require('../helpers/isEnabled.js'),
    ErrorHandler = require('../utils/ErrorHandler.js');

module.exports = function waitForEnabled(selector, ms, reverse) {

    /*!
     * make sure that callback contains chainit callback
     */
    var callback = arguments[arguments.length - 1];

    /*!
     * parameter check
     */
    if (typeof selector !== 'string') {
        return callback(new ErrorHandler.CommandError('number or type of arguments don\'t agree with waitForEnabled command'));
    }

    /*!
     * ensure that ms is set properly
     */
    if (typeof ms !== 'number') {
        ms = 500;
    }

    if (typeof reverse !== 'boolean') {
        reverse = false;
    }

    var self = this,
        response = {};

    async.waterfall([
        function(cb) {
            self.timeoutsAsyncScript(ms, cb);
        },
        function(res, cb) {
            response.timeoutsAsyncScript = res;
            self.executeAsync(isEnabledFunc, selector, reverse, cb);
        },
        function(res, cb) {
            response.executeAsync = res;
            cb();
        }
    ], function(err) {

        callback(err, response.executeAsync ? response.executeAsync.value : false, response);

    });

};