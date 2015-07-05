/**
 * @fileoverview A logging class, covering debug logs, warnings & errors
 * @module eVN/Logger
 * @param {string} [name='Unnamed Logger'] - The name of the logger. Will show up in logs.
 * @param {string} [version=NaN] - Version parameter, will show up in logs.
 * @param {bool} [doLog=true] - Whether or not to skip non warn/error logs.
 */
module.exports = function Logger(name, version, doLog) {
	this.name = name || 'Na Logger';
	this.version = version || 'NaN';
	this.DEBUG = doLog || true;
};

module.exports.prototype = {

	/**
	 * A method for logging regular errors.
	 * @param {string} message - Message to log.
	 */
	"log": function(message) {
		if(this.DEBUG === false) { return; }
		
		/* append arguments[] to a debug logging array then apply it */
		var argumentsArray = Array.prototype.slice.call(arguments);
		var args = [this.name +' v'+ this.version +' debug message:'].concat(argumentsArray);
		if(console) console.log.apply(console, args);
	},

	/**
	 * A method for sending warnings
	 * @param {string} message - Warning to send.
	 */
	"warn": function(message) {
		
		/* append arguments[] to a debug logging array then apply it */
		var argumentsArray = Array.prototype.slice.call(arguments);
		var args = [this.name +' v'+ this.version +' warning:'].concat(argumentsArray);
		if(console) console.warn.apply(console, args);
	},

	/**
	 * A method for throwing errors.
	 * @param {string|Error} message - Message of the error to throw.
	 * @param {string} [name=Unknown error] - Name of the error. Message will be used if none passed.
	 */
	"throw": function(message, name) {
		if(message instanceof Error   &&   console) {
			console.error((name? name : 'Unspecified') + ' error from ' + this.name + ' v' + this.version + ': ', message.message);
			console.error('Stacktrace:', message.stack);
			throw message;
		} else {
			var err = new Error();
			err.name = (name? name : 'Unspecified') + ' error from ' + this.name + ' v' + this.version;
			err["Error message"] = message;
			err.message = err.name + ': ' + message || 'Unspecified error. Refer to the stacktrace for help.';
	
			throw err;
		}
	}
};
