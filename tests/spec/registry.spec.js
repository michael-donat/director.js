const Registry = require('./../../src/registry');

describe('MemoryRegistry', function() {
	it('registers and returns values', function() {
		const registry = new Registry();
		registry.register('a', 1);

		expect(registry.get('a')).to.equal(1);
	});

	it('throws when unknown name requested', function() {
		const registry = new Registry();

		expect(()=>registry.get('unknown')).to.throw();
	})
})
