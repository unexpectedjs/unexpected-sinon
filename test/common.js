sinon = require('sinon');
expect = require('unexpected');
unexpectedSinon = process.env.COVERAGE ?
    require('../lib-cov/unexpected-sinon') :
    require('../lib/unexpected-sinon');
