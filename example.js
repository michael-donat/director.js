const director = require('.');

class CommandHandler {
	execute(command, callback) {
		if (!command.param) {
			return callback(new Error('Expected param to have a value.'));
		}
		callback(null, command.param);
	}
}

class PromiseCommandHandler {
	execute(command) {
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

Command.prototype.ID = 'command';

const callbackBus = director();
const promiseBus = director();

callbackBus.registry.register(Command.prototype.ID, new CommandHandler());
promiseBus.registry.register(Command.prototype.ID, new PromiseCommandHandler());

callbackBus.use({handle: (handler, command, next) => {
	console.log('1');
	next();
}});

callbackBus.use({handle: (handler, command, next) => {
	console.log('2');
	next();
}});

callbackBus.handle(new Command('param'), function(err, result) {
	console.log('Result: ', result);
	console.error('Error:  ', err);
});

promiseBus.use({handle: (handler, command, next) => {
	return new Promise((resolve) => {
		console.log('prom1');
		setTimeout(()=>resolve(next()), 1000);
	});
}});

promiseBus.use({handle: (handler, command, next) => {
	return new Promise((resolve) => {
		console.log('prom2');
		setTimeout(()=>resolve(next()), 2000);
	});
}});

promiseBus.handle(new Command('param'))
	.then((result) => console.log('Result: ', result))
	.catch((err) => console.error('Error:  ', err));

/*
promiseBus.handle(new Command())
	.then((result) => console.log('Result: ', result))
	.catch((err) => console.error('Error:  ', err));
*/



