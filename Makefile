install:
	yarn install

lint:
	./node_modules/.bin/xo 'src/**/*.js'

test: test-spec test-component

test-spec:
	./node_modules/.bin/mocha -r tests/.bootstrap.js 'tests/spec/**/*.spec.js'

test-component:
	./node_modules/.bin/mocha -r tests/.bootstrap.js 'tests/component/test.js'
