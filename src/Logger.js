/**
 * @fileoverview A logging class, covering debug logs, warnings & errors
 * @module eVN/Logger
 * @param {string} [name='Unnamed Logger'] - The name of the logger. Will show up in logs.
 * @param {string} [version=NaN] - Version parameter, will show up in logs.
 * @param {bool} [doLog=true] - Whether or not to skip non warn/error logs.
 */

export class Logger {
	constructor (name='unnamed logger', version='0', verbose=false) {
		this.name = name;
		this.version = version;
		this.verbose = verbose;

		this.logName = `${this[name]} v${this.version}`;
		this.logPrefix = `[${this.logName} INFO]`;
		this.warnPrefix = `[${this.logName} WARN]`;
		this.errPrefix = `[${this.logName} ERR]`;
	}

	/**
	 * A method for logging non-critical information.
	 * @param {...Anything} message - Message to log.
	 */
	log(...msgs) {
		var logMsg = [this.logPrefix];
		if(msgs.length < 1 || !this.verbose) return;
		
		if(msgs.length === 1 && typeof msgs[0] === 'string') logMsg[0] += ` ${msgs[0]}`;
		else logMsg = [logMsg[0], ...msgs];
		
		if(console && console.log) return console.log.bind(console, ...logMsg);
	}

	/**
	 * A method for logging warnings.
	 * @param {...Anything} message - Message to log.
	 */
	warn(...msgs) {
		var logMsg = [this.warnPrefix];
		if(msgs.length < 1 || !this.verbose) return;
		
		if(msgs.length === 1 && typeof msgs[0] === 'string') logMsg[0] += ` ${msgs[0]}`;
		else logMsg = [logMsg[0], ...msgs];
		
		if(console && console.warn) return console.warn.bind(console, ...logMsg);
	}

	/**
	 * A method for throwing errors.
	 * @param {string|Error} message - Message of the error to throw.
	 * @param {string} [name=Unknown error] - Name of the error. Message will be used if none passed.
	 */
	throw(error='unspecified error', message) {
		var eErr;
		
		if(error instanceof Error) eErr = error;
		else { eErr = new Error(error); if(message) eErr.stack = message;	};

		eErr.name = `${this.errPrefix} ${eErr.name}`;

		return ()=> {
			if(console && console.error) {
				if(message) console.error(`${this.errPrefix} ${eErr.message}`);
				console.error(eErr.stack);
				throw `${this.logName} halted`;
			} else throw eErr;
		};
	}
};
