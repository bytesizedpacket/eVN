var name = Symbol();
var version = Symbol();
var verbose = Symbol();
var logName = Symbol();
var logPrefix = Symbol();
var warnPrefix = Symbol();
var errPrefix = Symbol();

/**
 * A logging class, covering debug logs, warnings & errors
 * IMPORTANT: Each method returns a <code>function</code>!
 * Use like so:
 * @example
 * var logger = new Logger('myLog', 'v0.5b', false);
 *logger.warn('Something may be wrong!')();
 */
export class Logger {
/**
 * @param {string} [_name='UnnamedLogger'] - The name of the logger. Will show up in logs.
 * @param {string} [_version=NaN] - Version parameter, will show up in logs.
 * @param {bool} [_verbose=true] - Whether or not to skip non warn/error logs.
 */
	constructor (_name='Unnamedlogger', _version='NaN', _verbose=true) {
		this[name] = _name;
		this[version] = _version;
		this[verbose] = _verbose;

		this[logName] = `${this[name]} v${this[version]}`;
		this[logPrefix] = `[${this[logName]} INFO]`;
		this[warnPrefix] = `[${this[logName]} WARN]`;
		this[errPrefix] = `[${this[logName]} ERR]`;
	}

	/**
	 * A method for logging non-critical information.
	 * @param {...Anything} message - Message to log.
	 * @returns {Function} - <code>console.log</code> binded with the
	 * appropriate scope & arguments
	 */
	log(...msgs) {
		var logMsg = [this[logPrefix]];
		if(msgs.length < 1 || !this[verbose]) return ()=>{};
		
		if(msgs.length === 1 && typeof msgs[0] === 'string') logMsg[0] += ` ${msgs[0]}`;
		else logMsg = [logMsg[0], ...msgs];
		
		if(console && console.log) return console.log.bind(console, ...logMsg);
	}

	/**
	 * A method for logging warnings.
	 * @param {...Anything} message - Message to log.
	 * @returns {Function} - <code>console.warn</code> binded with the
	 * appropriate scope & arguments
	 */
	warn(...msgs) {
		var logMsg = [this[warnPrefix]];
		if(msgs.length < 1 || !this[verbose]) return ()=>{};
		
		if(msgs.length === 1 && typeof msgs[0] === 'string') logMsg[0] += ` ${msgs[0]}`;
		else logMsg = [logMsg[0], ...msgs];
		
		if(console && console.warn) return console.warn.bind(console, ...logMsg);
	}

	/**
	 * A method for throwing errors.
	 * @param {string|Error} error - Name/Type/Error to throw.
	 * @param {string} [message='UnknownError'] - Message to log. If
	 * <code>error instanceof Error</code> is true,
	 * <code>error.stack</code> will be used.
	 * @returns {Function} - <code>throw</code> and <code>console.error</code>
	 * binded with the appropriate scope & arguments
	 */
	throw(error='UnknownError', message) {
		var eErr;
		
		if(error instanceof Error) eErr = error;
		else { eErr = new Error(error); if(message) eErr.stack = message;	};

		eErr.name = `${this[errPrefix]} ${eErr.name}`;

		return ()=> {
			if(console && console.error) {
				if(message) console.error(`${this[errPrefix]} ${eErr.message}`);
				console.error(eErr.stack);
				throw `${this[logName]} halted`;
			} else throw eErr;
		};
	}
};
