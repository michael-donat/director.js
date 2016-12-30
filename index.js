const Bus = require('./src/bus');
const MemoryRegistry = require('./src/registry');

const director = function() {
	const registry = new MemoryRegistry();
	return new Bus(registry);
}

director.Bus = Bus;
director.MemoryRegistry = MemoryRegistry;

module.exports = director;
