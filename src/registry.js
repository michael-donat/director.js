module.exports = class MemoryRegistry {
	constructor() {
		this.registry = {};
	}
	register(name, instance) {
		this.registry[name] = instance;
	}
	get(name) {
		if(!this.registry[name]) {
			throw new Error(`Unknown command '${name}'`);
		}
		return this.registry[name];
	}
};
