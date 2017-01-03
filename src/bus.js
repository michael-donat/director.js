const MemoryRegistry = require('./registry');

module.exports = class Bus {
	constructor(registry, {locator, nameResolver, handlerResolver} = {}) {
		this.registry = registry || new MemoryRegistry();
		this.locator = locator || function(command, registry) { return registry.get(command); };
		this.nameResolver = nameResolver || function(command) { return command ? command.ID : null; };
		this.handlerResolver = handlerResolver || function(command, handler) { return handler.execute ; };
		this.middleware = [];
	}

	use(middleware) {
		this.middleware.push(middleware);
	}

	resolveHandler(command) {

		const name = this.nameResolver(command);

		if (!name) {
			throw new Error(`Could not resolve command name for '${command ? command.constructor.name: 'undefined'}'.`);
		}

		const handler = this.locator(name, this.registry);

		if (!handler) {
			throw new Error(`Could not resolve handler for '${name}' command.`);
		}

		const handlerMethod = this.handlerResolver(command, handler);

		if (!handlerMethod) {
			throw new Error(`Could not resolve handler method for '${name}' command.`);
		}

		if (typeof handlerMethod !== 'function') {
			throw new Error(`Handler method is not a function for '${name}' command.`);
		}

		return { handler, method: handlerMethod, name };
	}

	handle(command, callback) {
		try {
			if (!command) {
				throw new Error(`Command expected, got ${typeof(command)} instead.`);
			}

			const { handler, method } = this.resolveHandler(command);

			const middlewareStack = this.middleware.slice(0);

			function next() {
				const middleware = middlewareStack.shift();

				if (!middleware) {
					return method.call(handler, command, callback);
				}

				return middleware.handle(handler, command, next);
			}

			return next();
		} catch (error) {
			if (callback) {
				return callback(error);
			}
			throw error;
		}
	}
}
