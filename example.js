const director = require('.');

class PromiseCommandHandler {
	execute(command, context) {
		if (context.logger) {
			context.logger('RUNNING')
		}
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (!command.param) {
					return reject(new Error('Expected param to have a value.'))
				}
				return resolve(command.param);
			}, 1000);

		})
	}
}

class Command {
	constructor(param) {
		this.param = param;
	}
}

class Decorator {
	constructor(bus) {
		this.bus = bus;
	}

	handle(command, context = {}) {
		context.logger = console.log.bind('OMG');
		return this.bus.handle(command, context).then((result) => {
			console.log('Executed');
			return result;
		}).catch(err => {
			console.log('Failed');
			throw err;
		})
	}
}

Command.prototype.ID = 'command';

const promiseBus = director();

promiseBus.registry.register(Command.prototype.ID, new PromiseCommandHandler());

const bus = new Decorator(promiseBus);

bus.handle(new Command('param'))
	.then((result) => console.log('Result: ', result))
	.catch((err) => console.error('Error:  ', err));

bus.handle(new Command())
	.then((result) => console.log('Result: ', result))
	.catch((err) => console.error('Error:  ', err));
