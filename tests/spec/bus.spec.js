const Bus = require('./../../src/bus');

describe('Bus', function() {
	beforeEach(function() {
		this.registry = sinon.stub();
		this.nameResolver = sinon.stub();
		this.locator = sinon.stub();
		this.handlerResolver = sinon.stub();
		this.bus = new Bus(this.registry, {
			nameResolver: this.nameResolver,
			locator: this.locator,
			handlerResolver: this.handlerResolver
		});
	});

	describe('handle', function() {
		it('throws on invalid command', function() {
			expect(()=>this.bus.handle()).to.throw(/Command expected/);
		});
		it('calls handler method with passed command and returns result', function() {
			const method = sinon.stub();
			const handler = sinon.stub();
			handler.execute = method;
			const command = sinon.stub();
			this.bus.resolveHandler = () => {
				return { method: handler.execute, handler: handler };
			};

			method.returns(123);

			expect(this.bus.handle(command)).to.equal(123);

			expect(method).to.have.been.calledWith(command);
			expect(method).to.have.been.calledOn(handler);
		})
	});

	describe('handler resolution', function() {
		it('throws when command name cannot be resolved', function() {
			this.nameResolver.returns(null);
			expect(()=>this.bus.resolveHandler()).to.throw(/resolve command name/);
		});

		it('throws when handler cannot be located', function() {
			this.nameResolver.returns('name');
			this.locator.returns(null);
			expect(()=>this.bus.resolveHandler({ID: null})).to.throw(/resolve handler for/);
		});

		it('throws when handler method cannot be resolved', function() {
			this.nameResolver.returns('name');
			this.locator.returns('handler');
			this.handlerResolver.returns(null);
			expect(()=>this.bus.resolveHandler({ID: {}})).to.throw(/resolve handler method for/);
		});

		it('throws when handler method is not a function', function() {
			this.nameResolver.returns('name');
			this.locator.returns('handler');
			this.handlerResolver.returns('not-a-function');
			expect(()=>this.bus.resolveHandler({ID: {execute: {}}})).to.throw(/method is not a function/);
		});

		it('returns handler and method', function() {
			const command = {};
			const handler = {execute:(r => r)};
			const name = 'name'
			this.nameResolver.returns(name);
			this.locator.withArgs(name, sinon.match.any).returns(handler);
			this.handlerResolver.withArgs(command, handler).returns(handler.execute);

			expect(this.bus.resolveHandler(command)).to.eql({
				handler,
				method: handler.execute,
				name
			})

		})
	});
})
