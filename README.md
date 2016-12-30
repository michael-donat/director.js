# Director.js [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)]() [![Build Status](https://img.shields.io/travis/michael-donat/director.js.svg?style=flat-square)](https://travis-ci.org/michael-donat/director.js)
 
## Requirements

You will need `node v6.0.0` or higher to be able to use director. Please get in touch or submit a PR if you need compatibility with lower versions or iojs.

## Installation

```bash
yarn add director.js
//or
npm install --save director.js
```

## Usage

### Init

Director.js provides a simplistic bootstrap method as its default export. 

```node
const bus = require('director.js')();

bus.registry.register('command', handler);

bus.handle(command);
```

If you require more control over configuration you can build the bus yourself.

```node
const director = require('director.js');

const bus = new director.Bus(registry, {
	locator, nameResolver, handlerResolver
});

bus.handle(command);
```

- `registry` - can be anything as long as your locator can use it to retrieve a handle by command name, if your registry provides `get(id)` method, the default locator will work fine.  
- `nameResolver(command)` - given command, it will return its name - default locator will return `command.ID` property
- `locator(command, registry)` - given command name returned by nameResolver, locator is responsible for returning a handler from registry -  by default it will call `registry.get(command)`
- `handlerResolver(command, handler)` - given command name and handler returned by locator it will return the command execution method, by default it will return `handler['execute']`

### Registry

The memory registry is exported via `director.MemoryRegistry` and is the default registry used if no other is provided.

- `MemoryRegistry.register(name, handler)` - register handler under name
- `MemoryRegistry.get(name)` - return handler by name

### Full example

```node

const director = require('director.js');

class CommandHandler {
	execute(command) {
		console.log(command.param);
	}
}

class Command {
	constructor(param) {
		this.param = 1;
	}
}

Command.ID = 'command';

const bus = director();

bus.registry.register(Command.ID, new CommandHandler());

bus.handle(new Command('param'));
```

## Contributing

All contributions are more than welcome. Fork and PR not forgetting about linting and testing.

## License

MIT

